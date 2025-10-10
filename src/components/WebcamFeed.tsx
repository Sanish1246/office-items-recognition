import { useRef } from "react";
import Webcam from "react-webcam";

const WebcamFeed = () => {
  const videoElement = useRef(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  return (
    <div className="camView mt-3">
      <Webcam
        audio={false}
        ref={videoElement}
        videoConstraints={videoConstraints}
        className="mx-auto border-1 border-indigo-700"
      />
      <p>Searching for an object...</p>
    </div>
  );
};

export default WebcamFeed;
