# Getting started

## Clone the repo

Clone the project repo in a folder of your choice by running the following command in your terminal

```
git clone https://github.com/Sanish1246/office-items-recognition.git
```

## Installing dependencies
Navigate to the cloned office-items-recognition folder

```
cd office-items-recognition
```

In order to install all dependencies for the model, run the following command:

```
pip install -r ./office-items-prediction/requirements.txt
```

Then, run the following command to install all the dependencies for the front-end (assuming that you are still on the office-items-recognition folder, else navigate there and then run the command)

```
npm install
```

## Starting the application

Move to the office-items-prediction folder (assuming that you are still on the office-items-recognition folder, else navigate there and then run the command)

```
cd office-items-prediction
```

Then, run the following command to start the Python server to use the model:

```
fastapi dev server.py
```

Wait until you get this message in the terminal

```
  INFO   Application startup complete.
```

Now, open another another terminal, navigate to the office-items-recognition folder and type the following command to start the Vite server for the front end

```
npm run dev
```

## Accessing the application

If everything has been done correctly, the application should be available at this url

```
http://localhost:5173/
```

# How to use

You can switch between 3 different interfaces, 2 for object classification (upload & webcam input) and 1 for object detection

## File upload

On the file upload interface, you can click on "Choose file" to upload and image and then click on "Classify" to classify it
After a brief delay, the image will be classified, and the identified class and confidence level will be displayed

## Webcam input

On the webcam input interface, you can click on "Capture" to capture a screenshot from your frontal camera.
The screenshot will then be classified by the model, and the identified class and confidence level will be displayed

## Object detection

On the object detection interface, you will first need to wait for the model to load (this may take a while).
Then, you can press on the "Start Webcam" button to open your frontal webcam.
The model will then draw a bounding box around each item it detects, outuptting the class and its confidence level

# Example output

File Upload example output
![File upload](https://github.com/Sanish1246/office-items-recognition/blob/main/uploadOutput.png)

Webcam photo example output
![Webcam photo](https://github.com/Sanish1246/office-items-recognition/blob/main/webcamOutput.png)

Object detection example output
![object detection](https://github.com/Sanish1246/office-items-recognition/blob/main/detectionOutput.png)
