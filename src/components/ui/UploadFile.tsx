import React from "react";
import { useState } from "react";
import { Button } from "./button";
import { BrainCircuit } from "lucide-react";

const UploadFile = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <div className="mt-5">
      <div className="border-1 h-108 w-200 border-red-500 mx-auto items-center">
        {selectedImage ? (
          <img
            src={URL.createObjectURL(selectedImage)}
            className="h-108 w-full object-fit"
          />
        ) : (
          <p>Upload an image</p>
        )}
      </div>
      <p className="mt-2">
        <b>Item:</b> Chair - <b>Confidence:</b>100%
      </p>
      <div className="flex flex-row mt-3 justify-center items-center gap-3">
        <label>
          <input
            type="file"
            name="office-image"
            accept="image/*"
            onChange={(event) => {
              if (event.target.files[0]) {
                setSelectedImage(event.target.files[0]);
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
        <Button>
          <BrainCircuit />
          Analyze
        </Button>
      </div>
    </div>
  );
};

export default UploadFile;
