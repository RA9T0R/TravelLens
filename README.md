# 🌍 TravelLens: Content-Based Image Retrieval (CBIR) Web App

TravelLens is a full-stack machine learning application designed to solve the problem of image-based place discovery. It allows users to upload a photo and retrieve semantically similar images by leveraging deep learning vector embeddings and specialized database indexing.


## ✨ Project Overview

| Feature | Detail |
| :--- | :--- |
| **Project Type** | Content-Based Image Retrieval (CBIR) / Semantic Search |
| **Problem Solved** | Inability to search for places when the name is unknown. |
| **ML Technique** | **Vector Search** using **Transfer Learning** (ResNet50). |
| **Vector Dimension** | **2048-D** |
| **Primary Metric** | **Precision@k** (Overall Avg P@5: 0.9137) |


## ⚠️ Critical Warning: Model Size

The backend uses **ResNet50** ($\approx 25.6$ million parameters). This model **exceeds the 512 MiB RAM limit** of Render's free tier.

* **Deployment Status:** If deployed to the free tier, the service **will fail** with an "Out of Memory" error.
* **Solution:** For cloud deployment, the instance must be upgraded (e.g., Render Starter Tier 1GB+), or the model must be replaced with the lightweight MobileNetV2.

***

## 🏗️ Architecture and Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | **React + Vite + Tailwind CSS** | Provides the responsive UI, handles user input (image upload), and displays ranked results. |
| **Backend/API** | **FastAPI (Python)** | High-performance server. Hosts the ML model, processes images, and manages all database transactions. |
| **ML Model Core** | **ResNet50** | The feature extractor model, generating the high-fidelity **2048-D** vector embedding. |
| **Database/Vector DB** | **Supabase (PostgreSQL)** | Stores image metadata and utilizes the `pgvector` extension for efficient vector storage and querying. |

### 🧠 Methodology: Semantic Search

1.  **Feature Extraction:** The **ResNet50** model converts the input image into a **2048-dimensional vector embedding**.
2.  **Normalization:** The vector is L2-normalized to ensure similarity depends only on the vector's direction (semantics).
3.  **Retrieval:** The backend uses the **L2 Distance operator (`<->`)** via `pgvector` to find the **Approximate Nearest Neighbors (ANN)**—the images with the smallest distance (highest similarity) to the query.


## 📊 Evaluation Summary

The model's success is defined by high accuracy in the initial results (Precision).

| Metric | Cutoff | Score | Implication |
| :--- | :--- | :--- | :--- |
| **Overall Avg Precision** | **@k=5** | **0.9137** | **Excellent.** On average, over 9 out of 10 immediate results are relevant. |
| **Highest Precision** | @k=5 | 0.9886 (Stonehenge) | Near-perfect confidence and accuracy for visually distinct landmarks. |
| **Recall Trade-Off** | Low Recall ($\approx 0.12$ @ k=5) | Acceptable. Confirms the model prioritizes quality and selectivity (Precision) over comprehensive coverage. |

***

## ⚙️ Local Development Setup

To run the full application stack locally for presentation or development:

### Prerequisites

* Python 3.9+ (with `venv` activated)
* Node.js & npm/yarn
* Access to your Supabase PostgreSQL instance

### 1. Backend Setup (FastAPI / Python)

1.  Navigate to the `/backend` directory.
2.  Set up your Python virtual environment and install dependencies:
    ```bash
    python -m venv .venv
    # Activate: .venv\Scripts\activate (Windows) or source .venv/bin/activate (Linux/macOS)
    pip install -r requirements.txt
    ```
3.  Ensure your `.env` file contains the correct local database credentials.
4.  Start the FastAPI server:
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000
    ```

### 2. Frontend Setup (React / Vite)

1.  Open a **NEW terminal session**.
2.  Navigate to the `/frontend` directory.
3.  Install Node dependencies:
    ```bash
    npm install
    ```
4.  Start the React application:
    ```bash
    npm run dev
    ```

The application will be accessible in your web browser at `http://localhost:5173/`.
