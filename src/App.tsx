import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import UploadFile from "./components/UploadFile";
import Webcam from "./components/Webcam";

function App() {
  const [choice, setChoice] = useState("Upload");

  return (
    <>
      <div className="w-screen text-center mx-auto">
        <h1 className="mt-5 text-2xl font-bold">Office Items Recognition</h1>
        <p className="mt-5">Choose an input method</p>
        <div className="flex flex-row justify-center mt-3 gap-3">
          <Button onClick={() => setChoice("Upload")}>
            <Upload />
            Upload
          </Button>
          <Button onClick={() => setChoice("Webcam")}>
            <Camera />
            Webcam
          </Button>
        </div>
        <div>{choice == "Upload" ? <UploadFile /> : <Webcam />}</div>
        <Toaster richColors />
      </div>
    </>
  );
}

export default App;
