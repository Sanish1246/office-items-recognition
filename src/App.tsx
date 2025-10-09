import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";

function App() {
  const [choice, setChoice] = useState("Upload");
  return (
    <>
      <div className="w-screen text-center border-1 mx-auto">
        <h1 className="mt-5 text-2xl">Office Items Recognition</h1>
        <p className="mt-10">Choose an option</p>
        <div className="flex flex-row justify-center mt-5">
          <Button variant="outline" onClick={() => setChoice("Upload")}>
            <Upload />
            Upload
          </Button>
          <Button variant="outline" onClick={() => setChoice("Webcam")}>
            <Camera />
            Webcam
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
