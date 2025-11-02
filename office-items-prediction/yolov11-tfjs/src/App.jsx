// App.jsx
import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import Loader from "./components/Loader";
import ButtonHandler from "./components/ButtonHandler";
import { detect, detectVideo } from "./utils/detect";
import "./style/App.css";

const App = () => {
  const [loading, setLoading] = useState({ loading: true, progress: 0 });
  const [model, setModel] = useState({ net: null, inputShape: [1, 0, 0, 3] });
  const [streaming, setStreaming] = useState(null);

  const imageRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    tf.ready().then(async () => {
      console.log("📦 Loading yolov11s...");
      const modelPath = `${window.location.href}/yolov11s_web_model/model.json`;

      const net = await tf.loadGraphModel(modelPath, {
        onProgress: (fractions) => {
          setLoading({ loading: true, progress: fractions });
        },
      });

      console.log("✅ yolov11s loaded.");

      // Warmup
      const dummyInput = tf.ones(net.inputs[0].shape);
      const warmupResults = net.execute(dummyInput);
      tf.dispose([warmupResults, dummyInput]);
      console.log("🔥 Warmed up yolov11s");

      setLoading({ loading: false, progress: 1 });
      setModel({
        net: net,
        inputShape: net.inputs[0].shape,
      });
    });
  }, []);

  return (
    <div className="App">
      {loading.loading && <Loader progress={loading.progress} />}

      <div className="header">
        <h1>📷Object Detection</h1>
        <p>
          Real-time object detection powered by <code>tensorflow.js</code>
        </p>
        <p>
          Model: <code className="code">yolov11s</code>
        </p>
      </div>

      <div className="content">
        <img
          src="#"
          ref={imageRef}
          onLoad={() => detect(imageRef.current, model, canvasRef.current)}
        />
        <video
          autoPlay
          muted
          ref={cameraRef}
          onPlay={() =>
            detectVideo(cameraRef.current, model, canvasRef.current)
          }
        />
        <video
          autoPlay
          muted
          ref={videoRef}
          onPlay={() => detectVideo(videoRef.current, model, canvasRef.current)}
        />
        <canvas
          width={model.inputShape[1]}
          height={model.inputShape[2]}
          ref={canvasRef}
        />
      </div>

      <ButtonHandler
        imageRef={imageRef}
        cameraRef={cameraRef}
        videoRef={videoRef}
        streaming={streaming}
        setStreaming={setStreaming}
      />
    </div>
  );
};

export default App;
