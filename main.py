from fastapi import FastAPI, File, UploadFile
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import requests
from keras.layers import TFSMLayer
import keras
from tensorflow.keras.models import load_model

# Use the proper endpoint name (usually 'serving_default')
from fastapi.middleware.cors import CORSMiddleware





app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict to ["http://localhost"] for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
MODEL = load_model('./train/my_model.h5')






CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())

    img_batch = np.expand_dims(image, 0)
    predictions=MODEL.predict(img_batch)
    predicted_class=CLASS_NAMES[np.argmax(predictions[0])]
    confidence=np.max(predictions[0])
    return {
        'class':predicted_class,
        'confidence':float(confidence)
    }

    

    

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)

    



