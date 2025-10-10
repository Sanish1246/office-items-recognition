import { useState } from "react";
import { Button } from "./ui/button";
import { BrainCircuit } from "lucide-react";
import { toast } from "sonner";

const UploadFile = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [result, setResult] = useState({ item: "", confidence: 0 });

  function analyzeImg() {
    if (!selectedImage) {
      toast.error("You should upload an image first!", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setResult({ item: "Chair", confidence: 100 });
        toast.success("Image analyzed successfully!", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      }, 2000);
    }
  }
  return (
    <div className="mt-5">
      <div className="border-1 h-108 w-200 border-indigo-700 mx-auto items-center">
        {selectedImage ? (
          isLoading ? (
            <div className="flex-center items-center justify-center  h-full w-full overflow-hidden bg-violet-50">
              <div className="three-body">
                <div className="three-body__dot" />
                <div className="three-body__dot" />
                <div className="three-body__dot" />
              </div>
            </div>
          ) : (
            <img
              src={URL.createObjectURL(selectedImage)}
              className="h-108 w-full object-fit"
            />
          )
        ) : (
          <div
            role="status"
            className=" h-full w-full  rtl:space-x-reverse md:flex md:items-center"
          >
            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-300   dark:bg-gray-700 flex-1">
              <svg
                className="w-10 h-10 text-gray-200 dark:text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
              <p>Upload an image</p>
            </div>

            <span className="sr-only">Upload an image...</span>
          </div>
        )}
      </div>
      <p className="mt-2">
        {result.item ? (
          <p>
            <b>Item:</b> {result.item} - <b>Confidence:</b>
            {result.confidence}%
          </p>
        ) : (
          <p>Upload an image to be anlayzed</p>
        )}
      </p>
      <div className="flex flex-row mt-3 justify-center items-center gap-3">
        <label>
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
            className="
   p-2 border border-gray-300 rounded-lg cursor-pointer
    file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
    file:text-sm file:font-semibold
    file:bg-blue-50 file:text-indigo-700 hover:file:bg-blue-100
    dark:text-[#f3f4f6] dark:bg-[#18181b] dark:border-[#334155]
    dark:file:bg-[#23272f] dark:file:text-[#a78bfa] dark:hover:file:bg-[#334155]
    mx-auto
  "
          />
        </label>
        <Button
          onClick={() => {
            console.log("button clicked");
            analyzeImg();
          }}
        >
          <BrainCircuit />
          Analyze
        </Button>
      </div>
    </div>
  );
};

export default UploadFile;
