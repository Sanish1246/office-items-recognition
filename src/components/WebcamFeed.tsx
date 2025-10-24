import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";

const WebcamFeed = () => {
  const [result, setResult] = useState({ item: "", confidence: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  async function analyzeFrame() {
    if (!webcamRef.current) return;

    try {
      setIsAnalyzing(true);
      // Capture current frame as base64
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error("Failed to capture frame");

      // Convert base64 to blob
      const base64Response = await fetch(imageSrc);
      const imageBlob = await base64Response.blob();

      // Create form data
      const formData = new FormData();
      formData.append("classification_file", imageBlob, "webcam-capture.jpg");

      // Send to server
      const response = await fetch("http://localhost:8000/api/classification", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const firstResult = data?.results?.[0] ?? null;

      if (!firstResult || Object.keys(firstResult).length === 0) {
        throw new Error("No classification results");
      }

      // Get class with highest probability
      const entries = Object.entries(firstResult) as [string, number][];
      const [bestClass, bestProb] = entries.reduce((a, b) =>
        a[1] > b[1] ? a : b
      );

      setResult({ item: bestClass, confidence: Math.round(bestProb * 100) });
      toast.success("Object detected!", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss(),
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze frame", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss(),
        },
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnalyzing) {
        analyzeFrame();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  return (
    <div className="camView mt-3">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="mx-auto border-1 border-indigo-700"
      />
      {isAnalyzing ? (
        <p>Analyzing frame...</p>
      ) : result.item === "" ? (
        <p>Waiting for objects...</p>
      ) : (
        <p>
          <b>Item:</b> {result.item}
        </p>
      )}
    </div>
  );
};

export default WebcamFeed;
