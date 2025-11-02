import { useState } from "react";
import { Button } from "./ui/button";
import { BrainCircuit } from "lucide-react";
import { toast } from "sonner";

type Detection = { item: string; confidence: number };

interface Props {
  onDetect?: (d: Detection) => void;
}

const UploadFile = ({ onDetect }: Props) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({ item: "", confidence: 0 });

  async function analyzeImg() {
    if (!selectedImage) {
      toast.error("You should upload an image first!", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      return;
    }

    setIsLoading(true);

    try {
      const form = new FormData();
      form.append("classification_file", selectedImage);

      const res = await fetch("http://localhost:8000/api/classification", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const firstResult = data?.results?.[0] ?? null;

      if (!firstResult || Object.keys(firstResult).length === 0) {
        throw new Error("No classification results");
      }

      // Using the class with max prob as the identified class
      const entries = Object.entries(firstResult) as [string, number][];
      const [bestClass, bestProb] = entries.reduce((a, b) =>
        a[1] > b[1] ? a : b
      );
      const prettyClass =
        bestClass.charAt(0).toUpperCase() + bestClass.slice(1);

      const confidence = Math.round(bestProb * 100);

      setResult({ item: prettyClass, confidence });

      // Notify parent about new detection
      if (onDetect) onDetect({ item: prettyClass, confidence });

      toast.success("Image analyzed successfully!", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Analysis failed. See console for details.", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      setResult({ item: "", confidence: 0 });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-5">
      <div className="poster-frame h-96 w-full mx-auto items-center overflow-hidden">
        {selectedImage ? (
          isLoading ? (
            <div className="flex items-center justify-center h-full w-full overflow-hidden bg-darkaccent">
              <div className="three-body">
                <div className="three-body__dot" />
                <div className="three-body__dot" />
                <div className="three-body__dot" />
              </div>
            </div>
          ) : (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected upload"
              className="h-96 w-full object-contain"
            />
          )
        ) : (
          <div role="status" className="h-full w-full md:flex md:items-center">
            <div className="flex items-center justify-center w-full h-full bg-darkaccent flex-1">
              <svg
                className="w-16 h-16 text-cream"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>

            <span className="sr-only">Upload an image</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <p className="mt-2 text-cream">Analysis in progress...</p>
      ) : result.item === "" ? (
        <p className="mt-2 text-cream">Upload an image to be analyzed</p>
      ) : (
        <p className="mt-2 text-cream">
          <b>Item:</b> {result.item} - <b>Confidence:</b> {result.confidence}%
        </p>
      )}

      <div className="mt-4 p-4 rounded-md bg-tan/8 border border-cream/8 flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 w-full md:w-auto">
          <label className="w-full block">
            <div className="text-xs text-cream/80 mb-2">Choose image</div>
            <input
              type="file"
              name="office-image"
              accept="image/*"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const file = event.currentTarget.files?.[0]; //
                if (file) {
                  setSelectedImage(file);
                  setResult({ item: "", confidence: 0 });
                }
              }}
              className={
                "w-full md:w-64 p-2 rounded-lg cursor-pointer border border-cream/12 bg-blackbg/10 text-cream placeholder:text-cream/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tan file:text-darkaccent hover:file:bg-tan/90 focus:ring-2 focus:ring-teal"
              }
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              analyzeImg();
            }}
            className="bg-red text-black font-semibold px-4 py-2 hover:brightness-95 ring-teal"
          >
            <BrainCircuit />
            Classify
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
