import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";
import Toaster from "@/components/ui/sonner";
import UploadFile from "./components/UploadFile";
import WebcamFeed from "./components/WebcamFeed";

type Detection = { item: string; confidence: number };

function App() {
  const [choice, setChoice] = useState("Upload");

  // Keep a short history of recent detections
  const [detections, setDetections] = useState<Detection[]>(() =>
    Array.from({ length: 3 }, () => ({ item: "—", confidence: 0 }))
  );

  const pushDetection = (d: Detection) => {
    setDetections((prev) => [d, ...prev].slice(0, 3));
  };

  const palette = [
    "var(--teal)",
    "var(--red)",
    "var(--tan)",
    "var(--dark-accent)",
  ];

  return (
    <div className="min-h-screen bg-blackbg text-cream flex flex-col">
      <header className="bg-teal">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-darkaccent flex items-center justify-center text-cream font-bold">
              01
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-cream">
                Office Items Recognition
              </h1>
              <p className="text-sm text-cream/85">
                Upload or capture an image to classify office items.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex gap-3 mb-4">
              <Button
                variant={choice === "Upload" ? "outline" : "default"}
                onClick={() => setChoice("Upload")}
              >
                <Upload />
                Upload
              </Button>

              <Button
                variant={choice === "Webcam" ? "outline" : "default"}
                onClick={() => setChoice("Webcam")}
              >
                <Camera />
                Webcam
              </Button>
            </div>

            <div>
              {choice === "Upload" ? (
                <UploadFile onDetect={pushDetection} />
              ) : (
                <WebcamFeed onDetect={pushDetection} />
              )}
            </div>
          </div>

          <aside className="w-full md:w-64">
            <div className="poster-frame p-6">
              <h3 className="text-lg font-semibold text-cream">Last Detected Items</h3>

              {/* Column headers (Item | Confidence) */}
              <div className="mt-4 grid grid-cols-2 items-center gap-2 pb-2 border-b border-cream/8">
                <div className="text-sm font-medium text-cream">Item</div>
                <div className="text-sm font-medium text-cream text-right">
                  Confidence
                </div>
              </div>

              <div className="mt-3 grid gap-3">
                {detections.map((d, i) => {
                  const avatarBg = palette[i % palette.length];
                  const avatarTextClass =
                    avatarBg === "var(--tan)"
                      ? "text-darkaccent"
                      : "text-cream";
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 p-3 rounded-md bg-blackbg/30"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`w-10 h-10 rounded-md flex items-center justify-center font-semibold ${avatarTextClass}`}
                          style={{ background: avatarBg }}
                        >
                          {i + 1}
                        </div>
                        <div className="text-sm font-medium text-cream">
                          {d.item === "—" ? "No detection" : d.item}
                        </div>
                      </div>

                      <div className="text-xs text-cream/70">
                        {d.item === "—" ? "—" : `${d.confidence}%`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-auto border-t border-cream/8 py-4 w-full">
        <div className="max-w-5xl mx-auto px-6 text-sm text-cream/80">
          © {new Date().getFullYear()} Office Items Recognition by ByteMe.
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;
