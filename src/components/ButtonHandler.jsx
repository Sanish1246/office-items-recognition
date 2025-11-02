// components/ButtonHandler.jsx
import { Webcam } from "../utils/webcam";

const ButtonHandler = ({ cameraRef, streaming, setStreaming }) => {
  const webcam = new Webcam();

  // closing camera streaming
  const closeCamera = () => {
    webcam.close(cameraRef.current);
    cameraRef.current.style.display = "none";
    setStreaming(null);
  };

  return (
    <div className="btn-container">
      {/* Webcam Handler */}
      <button
        onClick={() => {
          if (streaming === null) {
            webcam.open(cameraRef.current);
            cameraRef.current.style.display = "block";
            setStreaming("camera");
          } else if (streaming === "camera") {
            closeCamera();
          }
        }}
      >
        {streaming === "camera" ? "Close" : "Open"} Webcam
      </button>
    </div>
  );
};

export default ButtonHandler;
