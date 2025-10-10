import numpy as np
from tqdm import tqdm
from sqlalchemy.orm import Session
from database import SessionLocal
from collections import defaultdict

from embeddings import get_embedding 
from crud import search_similar 
from get_directory import generate_ground_truth

def calculate_metrics_by_label(retrieved_results, correct_label, total_relevant_in_db):
    if not retrieved_results: return 0.0, 0.0, 0.0
    hits = sum(1 for item in retrieved_results if item['label'] == correct_label)
    precision = hits / len(retrieved_results)
    recall = hits / total_relevant_in_db if total_relevant_in_db > 0 else 0.0
    f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    return precision, recall, f1_score

def evaluate_internal_consistency(data_directory: str, db: Session, k: int):
    ground_truth_by_label = generate_ground_truth(data_directory)
    print(ground_truth_by_label)
    print(f"\nStarting internal consistency evaluation on: {data_directory}")
    
    results_by_label = defaultdict(lambda: {'precisions': [], 'recalls': [], 'f1_scores': []})
    
    for label, image_paths in tqdm(ground_truth_by_label.items(), desc="Processing Labels"):
        total_relevant = len(image_paths) - 1
        if total_relevant < 1: continue

        for query_path in tqdm(image_paths, desc=f"  Querying '{label}'", leave=False):
            try:
                query_vector = get_embedding(query_path)
                if query_vector is None: continue
                retrieved_results = search_similar(db, query_vector.tolist(), k=k)
                p, r, f1 = calculate_metrics_by_label(retrieved_results, label, total_relevant)
                results_by_label[label]['precisions'].append(p)
                results_by_label[label]['recalls'].append(r)
                results_by_label[label]['f1_scores'].append(f1)
            except OSError as e:
                print(f"\n⚠️ Warning: Skipping corrupt image: {query_path}")
                continue
    
    # --- Print Results ---
    all_precisions = [p for metrics in results_by_label.values() for p in metrics['precisions']]
    if not all_precisions:
        print("Evaluation could not be completed. No queries were processed.")
        return

    print("\n--- Per-Label Performance (Internal Consistency) ---")
    for label, metrics in results_by_label.items():
        print(f"\n# Label: '{label}'")
        print(f"  - Avg Precision@{k}: {np.mean(metrics['precisions']):.4f}")
        print(f"  - Avg Recall@{k}:    {np.mean(metrics['recalls']):.4f}")
        print(f"  - Avg F1-Score@{k}:  {np.mean(metrics['f1_scores']):.4f}")
    
    print("\n--- Overall Performance (Internal Consistency) ---")
    print(f"\n(Averaged across all {len(all_precisions)} queries)")
    print(f"  - Overall Avg Precision@{k}: {np.mean(all_precisions):.4f}")

if __name__ == "__main__":
    db = SessionLocal()
    K = 5

    try:
        val_directory = '../models/Google_Images/val'
        evaluate_internal_consistency(val_directory, db, k=K)

    finally:
        print("\nClosing database session.")
        db.close()