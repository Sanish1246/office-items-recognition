from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import os
from fastapi.middleware.cors import CORSMiddleware
from classification_model import model

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/classification")
async def classify_image(classification_file: UploadFile = File(...)):
    # Save uploaded file temporarily
    temp_path = f"temp_{classification_file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await classification_file.read())

    # Run the YOLO model on the uploaded image
    results = model(temp_path)

    # Extract probabilities and class names
    response_data = []
    for result in results:
        if result.probs is not None:  # for classification models
            class_names = result.names
            probs = result.probs.data.tolist()  # tensor → list
            # Round floats to 2 decimal places
            class_probs = {class_names[i]: round(float(probs[i]), 2) for i in range(len(probs))}
            response_data.append(class_probs)

    # Remove the temporary image file
    os.remove(temp_path)

    # Send probabilities back as JSON
    return JSONResponse(content={"results": response_data})
