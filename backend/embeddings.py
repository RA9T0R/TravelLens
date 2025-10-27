import numpy as np
from numpy.linalg import norm
# 🟢 FIX 1: Change import from resnet50 to mobilenet_v2
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input 
from tensorflow.keras.preprocessing import image

# Load model once (global)
# 🟢 FIX 2: Instantiate MobileNetV2
# This model uses ~3.5 million parameters vs. ResNet50's ~25.6 million.
model = MobileNetV2(weights="imagenet", include_top=False, pooling="avg")

def get_embedding(img_path: str) -> np.ndarray:
    # Target size (224, 224) is compatible with MobileNetV2
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    # 🟢 FIX 3: preprocess_input from the mobilenet_v2 library ensures correct scaling
    x = preprocess_input(x) 
    
    features = model.predict(x, verbose=0)
    embedding = features.flatten()
    embedding /= norm(embedding)
    return embedding