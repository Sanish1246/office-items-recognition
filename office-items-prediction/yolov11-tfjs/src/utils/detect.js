import * as tf from "@tensorflow/tfjs";
import { renderBoxes } from "./renderBox";
import labels from "./labels.json";

const numClass = labels.length;

/**
 * Preprocess image / frame before forwarded into the model
 */
const preprocess = (source, modelWidth, modelHeight) => {
  let xRatio, yRatio; // ratios for boxes

  const input = tf.tidy(() => {
    const img = tf.browser.fromPixels(source);

    const [h, w] = img.shape.slice(0, 2);
    const maxSize = Math.max(w, h);
    const imgPadded = img.pad([
      [0, maxSize - h],
      [0, maxSize - w],
      [0, 0],
    ]);

    xRatio = maxSize / w;
    yRatio = maxSize / h;

    return tf.image
      .resizeBilinear(imgPadded, [modelWidth, modelHeight])
      .div(255.0)
      .expandDims(0);
  });

  return [input, xRatio, yRatio];
};

/**
 * Run detection on a single frame or image
 */
export const detect = async (source, model, canvasRef, callback = () => {}) => {
  const [modelWidth, modelHeight] = model.inputShape.slice(1, 3);

  tf.engine().startScope();
  const [input, xRatio, yRatio] = preprocess(source, modelWidth, modelHeight);

  const res = model.net.execute(input);
  const transRes = res.transpose([0, 2, 1]); // [1, D, N] -> [1, N, D]

  // --- YOLOv11: outputDepth is typically 5 or 6 (x, y, w, h, conf[, class])
  const boxesTensor = tf.tidy(() => {
    const w = transRes.slice([0, 0, 2], [-1, -1, 1]);
    const h = transRes.slice([0, 0, 3], [-1, -1, 1]);
    const x1 = tf.sub(transRes.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2));
    const y1 = tf.sub(transRes.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2));
    return tf.concat([y1, x1, tf.add(y1, h), tf.add(x1, w)], 2).squeeze();
  });

  // Only confidence score (no multiple classes)
  const [scores, classes] = tf.tidy(() => {
    const conf = transRes.slice([0, 0, 4], [-1, -1, 1]).squeeze();
    const fakeClasses = tf.zerosLike(conf); // no class info, default to 0
    return [conf, fakeClasses];
  });

  const nms = await tf.image.nonMaxSuppressionAsync(
    boxesTensor,
    scores,
    500,
    0.45,
    0.2
  );

  const boxes_data = boxesTensor.gather(nms, 0).dataSync();
  const scores_data = scores.gather(nms, 0).dataSync();
  const classes_data = classes.gather(nms, 0).dataSync();

  renderBoxes(canvasRef, boxes_data, scores_data, classes_data, [
    xRatio,
    yRatio,
  ]);

  tf.dispose([res, transRes, boxesTensor, scores, classes, nms]);
  callback();
  tf.engine().endScope();
};

/**
 * Run continuous detection for video source
 */
export const detectVideo = (vidSource, model, canvasRef) => {
  const detectFrame = async () => {
    if (vidSource.videoWidth === 0 && vidSource.srcObject === null) {
      const ctx = canvasRef.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      return;
    }
    detect(vidSource, model, canvasRef, () => {
      requestAnimationFrame(detectFrame);
    });
  };

  detectFrame();
};
