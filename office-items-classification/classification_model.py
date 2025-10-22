from ultralytics import YOLO

model = YOLO("yolo11s-cls.pt")  # load a pretrained runs (recommended for training)

# Load a runs
model = YOLO(r"runs\train8\weights\best.pt")  # load a custom runs

