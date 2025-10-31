// src/components/WebcamFeed.tsx
import { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Camera } from "lucide-react";

type Detection = { item: string; confidence: number };

interface Props {
  onDetect?: (d: Detection) => void;
}

const WebcamFeed = ({ onDetect }: Props) => {
  const [result, setResult] = useState({ item: "", confidence: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  async function captureFrameAsBlob(): Promise<Blob | null> {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9);
    });
  }

  async function analyzeFrame() {
    if (!videoRef.current) return;

    try {
      setIsAnalyzing(true);
      const blob = await captureFrameAsBlob();
      if (!blob) throw new Error("Failed to capture frame");

      const formData = new FormData();
      formData.append("classification_file", blob, "webcam-capture.jpg");

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

      const entries = Object.entries(firstResult) as [string, number][];
      const [bestClass, bestProb] = entries.reduce((a, b) => (a[1] > b[1] ? a : b));
      const prettyClass = bestClass.charAt(0).toUpperCase() + bestClass.slice(1);

      const confidence = Math.round(bestProb * 100);
      setResult({ item: prettyClass, confidence: confidence });

      if (onDetect) onDetect({ item: prettyClass, confidence });

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

  function start() {
    if (!navigator.mediaDevices) return;
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        })
        .catch((err) => {
          console.error("Camera start failed:", err);
          toast.error("Unable to access camera");
        });
  }

  function stop() {
    if (!videoRef.current) return;
    const tracks = (videoRef.current.srcObject as MediaStream)?.getTracks() || [];
    tracks.forEach((t) => t.stop());
    videoRef.current.srcObject = null;
  }

  // Auto-start when component mounts
  // and stop when it unmounts / user switches away.
  useEffect(() => {
    start();
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <div className="poster-frame p-4 rounded-md">
        <div className="bg-darkaccent h-96 rounded-md overflow-hidden flex items-center justify-center">
          <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
          />
        </div>
        <div className="mt-4 flex gap-4">
          <Button
              onClick={() => {
                analyzeFrame();
              }}
              className="bg-teal text-cream"
              disabled={isAnalyzing}
          >
            <Camera />
            Capture
          </Button>
          <Button
              onClick={() => {
                stop();
              }}
              className="bg-red text-black"
          >
            Stop
          </Button>
        </div>
        {isAnalyzing ? (
            <p className="text-cream mt-2">Analyzing frame...</p>
        ) : result.item === "" ? (
            <p className="text-cream mt-2">Waiting for objects...</p>
        ) : (
            <p className="text-cream mt-2">
              <b>Item:</b> {result.item} - <b>Confidence:</b> {result.confidence}%
            </p>
        )}
      </div>
  );
};

export default WebcamFeed;
