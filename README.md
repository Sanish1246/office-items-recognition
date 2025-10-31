# Getting started

## Clone the repo

Clone the project repo by running the following command in your terminal

```
git clone https://github.com/Sanish1246/office-items-recognition.git
```

## Installing dependencies

In order to install all dependencies for the models, run the following command:

```
pip install -r ./office-items-classification/requirements.txt
```

Then, run the following command to install all the dependencies for the front-end

```
npm install
```

If you also want to use the object detection model, move to its project folder

```
cd ./office-items-classification/yolov11-tfjs
```

Then, run the following command to install all the dependencies for the front-end

```
npm install
```

## Using the item classification model

### Starting the application

Move to the office-items-classification folder

```
cd office-items-classification
```

Then, run the following command to start the Python server to use the model:

```
fastapi dev server.py
```

Wait until you get this message in the terminal

```
  INFO   Application startup complete.
```

Now, open another another terminal and type the following command to start the Vite server for the front end

```
npm run dev
```

### Accessing the application

If everything has been done correctly, the application should be available at this url

```
http://localhost:5173/
```

## Using the item detection model

### Starting the application

Open a new terminal if needed and move to the yolov11-tfjs folder

```
cd ./office-items-classification/yolov11-tfjs
```

Then, run the following command to start the application:

```
npm start
```

### Accessing the application

If everything has been done correctly, the application should be available at this url

```
http://localhost:5174/yolov11-tfjs/
```

# Example output
