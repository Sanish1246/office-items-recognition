import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";

const WebcamFeed = () => {
  const [result, setResult] = useState({ item: "", confidence: 0 });
  const videoElement = useRef(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  useEffect(() => {
    //Adding mock timeout to simulate intended behaviour
    const timer = setTimeout(() => {
      setResult({ item: "Chair", confidence: 100 });
      toast.success("Object found!", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss(),
        },
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="camView mt-3">
      <Webcam
        audio={false}
        ref={videoElement}
        videoConstraints={videoConstraints}
        className="mx-auto border-1 border-indigo-700"
      />
      {result.item == "" ? (
        <p>Searching for an object...</p>
      ) : (
        <p>
          <b>Item:</b> {result.item} - <b>Confidence:</b>
          {result.confidence}%
        </p>
      )}
    </div>
  );
};

export default WebcamFeed;
