import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Video, Webcam } from "lucide-react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import { detect, detectVideo } from "./utils/detect";

const Detector = ({ onBack }) => {
  const [loading, setLoading] = useState({ loading: true, progress: 0 });
  const [model, setModel] = useState({ net: null, inputShape: [1, 0, 0, 3] });
  const [streaming, setStreaming] = useState(null);
  const [activeSource, setActiveSource] = useState(null);

  const imageRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    tf.ready().then(async () => {
      console.log("📦 Loading yolov11s...");
      const modelPath = "yolov11s_web_model/model.json";

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        imageRef.current.src = event.target.result;
        setActiveSource("image");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWebcam = async () => {
    if (streaming === "camera") {
      const stream = cameraRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      cameraRef.current.srcObject = null;
      setStreaming(null);
      setActiveSource(null);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        cameraRef.current.srcObject = stream;
        setStreaming("camera");
        setActiveSource("camera");
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      videoRef.current.src = url;
      setStreaming("video");
      setActiveSource("video");
    }
  };

  return (
    <div className="min-h-screen bg-blackbg text-cream flex flex-col">
      {/* Loading Overlay */}
      {loading.loading && (
        <div className="fixed inset-0 bg-blackbg/95 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-cream text-lg font-semibold">Loading Model...</p>
            <p className="text-cream/60 text-sm mt-2">
              {Math.round(loading.progress * 100)}%
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-teal">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-darkaccent flex items-center justify-center text-cream font-bold">
              02
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-cream">
                YOLOv11s Object Detection
              </h1>
              <p className="text-sm text-cream/85">
                Real-time detection powered by TensorFlow.js
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-cream text-darkaccent hover:bg-cream/90"
          >
            <ArrowLeft />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 flex-1 w-full">
        {/* Control Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <label className="inline-flex">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <Button
            variant={activeSource === "camera" ? "outline" : "default"}
            onClick={handleWebcam}
          >
            <Webcam />
            {streaming === "camera" ? "Stop Webcam" : "Start Webcam"}
          </Button>

          <label className="inline-flex">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Detection Display */}
        <div className="poster-frame p-6">
          <div className="relative w-full aspect-video bg-blackbg/50 rounded-lg overflow-hidden flex items-center justify-center">
            {/* Hidden media elements */}
            <img
              ref={imageRef}
              src="#"
              alt="Upload"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ display: activeSource === "image" ? "block" : "none" }}
              onLoad={() => detect(imageRef.current, model, canvasRef.current)}
            />
            <video
              ref={cameraRef}
              autoPlay
              muted
              className="absolute inset-0 w-full h-full object-contain"
              style={{ display: activeSource === "camera" ? "block" : "none" }}
              onPlay={() =>
                detectVideo(cameraRef.current, model, canvasRef.current)
              }
            />
            <video
              ref={videoRef}
              autoPlay
              muted
              className="absolute inset-0 w-full h-full object-contain"
              style={{ display: activeSource === "video" ? "block" : "none" }}
              onPlay={() =>
                detectVideo(videoRef.current, model, canvasRef.current)
              }
            />

            {/* Canvas overlay for detections */}
            <canvas
              ref={canvasRef}
              width={model.inputShape[1]}
              height={model.inputShape[2]}
              className="absolute inset-0 w-full h-full object-contain"
            />

            {/* Placeholder when nothing is active */}
            {!activeSource && (
              <div className="text-center text-cream/50">
                <p className="text-lg font-semibold mb-2">No source selected</p>
                <p className="text-sm">Start webcam to begin detection</p>
              </div>
            )}
          </div>

          {/* Model Info */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-cream/70">Model:</span>
              <code className="px-2 py-1 bg-blackbg/30 rounded text-teal font-mono">
                yolov11s
              </code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cream/70">Input Shape:</span>
              <code className="px-2 py-1 bg-blackbg/30 rounded text-cream font-mono text-xs">
                {model.inputShape.join(" × ")}
              </code>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-cream/8 py-4 w-full">
        <div className="max-w-6xl mx-auto px-6 text-sm text-cream/80">
          © {new Date().getFullYear()} Office Items Recognition by ByteMe.
        </div>
      </footer>
    </div>
  );
};

export default Detector;
