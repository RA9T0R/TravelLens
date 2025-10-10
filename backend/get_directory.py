import os

def generate_ground_truth(root_folder: str) -> dict:
    ground_truth = {}
    print(f"Scanning directory: {root_folder}")

    for label_name in os.listdir(root_folder):
        label_path = os.path.join(root_folder, label_name)
        
        if os.path.isdir(label_path):
            image_paths = []
            for image_name in os.listdir(label_path):
                if image_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                    full_path = os.path.join(label_path, image_name)
                    image_paths.append(full_path.replace('\\', '/'))
            
            if image_paths:
                ground_truth[label_name] = image_paths
                
    return ground_truth