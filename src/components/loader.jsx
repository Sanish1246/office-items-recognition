// components/Loader.jsx
import "../style/loader.css";

const Loader = ({ progress }) => {
  return (
    <div className="wrapper">
      <div className="spinner"></div>
      <p>Loading model... {(progress * 100).toFixed(2)}%</p>
    </div>
  );
};

export default Loader;
