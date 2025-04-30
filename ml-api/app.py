import os
import io
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from PIL import Image

app = FastAPI(title="Plant Disease Prediction API", description="API for predicting plant diseases from images")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define model paths based on your directory structure
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
POTATO_MODEL_PATH = os.path.join(MODELS_DIR, "Potato_best.h5")
TOMATO_MODEL_PATH = os.path.join(MODELS_DIR, "Tomato_best.h5")
PEPPER_MODEL_PATH = os.path.join(MODELS_DIR, "Pepper__bell_best.h5")

# Print paths for debugging
print(f"Current working directory: {os.getcwd()}")
print(f"Looking for models in: {MODELS_DIR}")
print(f"Potato model path: {POTATO_MODEL_PATH}")
print(f"Tomato model path: {TOMATO_MODEL_PATH}")
print(f"Pepper model path: {PEPPER_MODEL_PATH}")

# Image size
IMG_SIZE = (224, 224)

# Class labels
POTATO_CLASSES = [
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy"
]

TOMATO_CLASSES = [
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites_Two_spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

PEPPER_CLASSES = [
    "Pepper_bell___Bacterial_spot",
    "Pepper_bell___healthy"
]

# Global variables for models
potato_model = None
tomato_model = None
pepper_model = None

# Load models at startup
@app.on_event("startup")
async def load_models():
    global potato_model, tomato_model, pepper_model
    
    # Check if model files exist
    for model_path in [POTATO_MODEL_PATH, TOMATO_MODEL_PATH, PEPPER_MODEL_PATH]:
        if os.path.exists(model_path):
            print(f"Model file found: {model_path}")
        else:
            print(f"Model file NOT found: {model_path}")
    
    try:
        # Load models directly from h5 files
        potato_model = tf.keras.models.load_model(POTATO_MODEL_PATH)
        print("✓ Potato model loaded successfully")
    except Exception as e:
        print(f"✗ Error loading potato model: {str(e)}")
        potato_model = None
        
    try:
        tomato_model = tf.keras.models.load_model(TOMATO_MODEL_PATH)
        print("✓ Tomato model loaded successfully")
    except Exception as e:
        print(f"✗ Error loading tomato model: {str(e)}")
        tomato_model = None
        
    try:
        pepper_model = tf.keras.models.load_model(PEPPER_MODEL_PATH)
        print("✓ Pepper model loaded successfully")
    except Exception as e:
        print(f"✗ Error loading pepper model: {str(e)}")
        pepper_model = None

# Helper function to preprocess images
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    image = image.resize(IMG_SIZE)
    image = np.array(image) / 255.0
    return np.expand_dims(image, axis=0)

@app.get("/")
async def root():
    return {"message": "Plant Disease Prediction API is running"}

@app.post("/predict/potato")
async def predict_potato(file: UploadFile = File(...)):
    if potato_model is None:
        return {"error": "Potato model not loaded"}
    
    try:
        image_bytes = await file.read()
        processed_image = preprocess_image(image_bytes)
        prediction = potato_model.predict(processed_image)
        predicted_class_index = np.argmax(prediction[0])
        confidence = float(prediction[0][predicted_class_index])
        
        return {
            "plant": "potato",
            "disease": POTATO_CLASSES[predicted_class_index],
            "confidence": confidence,
            "probabilities": {POTATO_CLASSES[i]: float(prediction[0][i]) for i in range(len(POTATO_CLASSES))}
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/predict/tomato")
async def predict_tomato(file: UploadFile = File(...)):
    if tomato_model is None:
        return {"error": "Tomato model not loaded"}
    
    try:
        image_bytes = await file.read()
        processed_image = preprocess_image(image_bytes)
        prediction = tomato_model.predict(processed_image)
        predicted_class_index = np.argmax(prediction[0])
        confidence = float(prediction[0][predicted_class_index])
        
        return {
            "plant": "tomato",
            "disease": TOMATO_CLASSES[predicted_class_index],
            "confidence": confidence,
            "probabilities": {TOMATO_CLASSES[i]: float(prediction[0][i]) for i in range(len(TOMATO_CLASSES))}
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/predict/pepper")
async def predict_pepper(file: UploadFile = File(...)):
    if pepper_model is None:
        return {"error": "Pepper model not loaded"}
    
    try:
        image_bytes = await file.read()
        processed_image = preprocess_image(image_bytes)
        prediction = pepper_model.predict(processed_image)
        predicted_class_index = np.argmax(prediction[0])
        confidence = float(prediction[0][predicted_class_index])
        
        return {
            "plant": "pepper_bell",
            "disease": PEPPER_CLASSES[predicted_class_index],
            "confidence": confidence,
            "probabilities": {PEPPER_CLASSES[i]: float(prediction[0][i]) for i in range(len(PEPPER_CLASSES))}
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/health")
async def health_check():
    models_status = {
        "potato_model": "loaded" if potato_model is not None else "not loaded",
        "tomato_model": "loaded" if tomato_model is not None else "not loaded",
        "pepper_model": "loaded" if pepper_model is not None else "not loaded"
    }
    return {"status": "healthy", "models": models_status}

# Add an endpoint to list available files in the models directory
@app.get("/files")
async def list_files():
    if os.path.exists(MODELS_DIR):
        files = os.listdir(MODELS_DIR)
        return {"models_directory": MODELS_DIR, "files": files}
    else:
        return {"error": f"Models directory not found: {MODELS_DIR}"}