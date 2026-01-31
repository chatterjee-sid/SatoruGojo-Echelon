# Models Directory

## Required Model Files

### face_landmarker.task

This directory should contain the MediaPipe Face Landmarker model.

**Download the model:**

```bash
wget https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task
```

Or download manually from:
https://developers.google.com/mediapipe/solutions/vision/face_landmarker

**File size:** ~5.4 MB

**Model details:**
- Type: Face Landmarker (468 landmarks)
- Precision: Float16
- Platform: Cross-platform (CPU)

After downloading, place the file in this directory:
```
liveness-detection/models/face_landmarker.task
```

## Alternative Models

While this project is designed for the face_landmarker model, you can experiment with other MediaPipe models if needed. Update the model path in the configuration files accordingly.
