## Getting Started

## Installing dependencies

In order to install all dependencies for the model, run the following command:

```
pip install -r ./office-items-classification/requirements.txt
```

Then, run the following command to install all the dependencies for the front-end

```
npm install
```

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
