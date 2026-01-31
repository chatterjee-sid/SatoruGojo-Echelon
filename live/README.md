# Echelon Live Testing Playground

This directory contains a standalone liveness detection script (`main.py`) for quick testing and debugging using MediaPipe's Face Landmarker.

## Prerequisites

- Python 3.8+
- Webcam available

## Setup

1. (Optional) Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
   ```bash
   pip install -r requirements.txt
   ```

## Usage

```bash
python main.py
```

- **Objective**: Blink 2 times within 10 seconds.
- **Controls**:
  - `q`: Quit the application.
  - `r`: Reset the liveness session.

## Implementation: main.py

This section documents the implementation and runtime behavior of `main.py` in this workspace.

- **Purpose:** A compact liveness/blink detector using MediaPipe's Face Landmarker and the webcam. The runnable goal is to detect two blinks within a short time window (10 seconds by default) as a simple liveness check.

- **High-level flow:**
   - Load or ensure availability of the `face_landmarker.task` model file.
   - Open the default webcam with OpenCV and start a capture loop.
   - For each frame: convert color/format as required, run the Face Landmarker to get face detections and landmark arrays, and extract eye landmarks.
   - Compute a blink metric (commonly an Eye Aspect Ratio or vertical eyelid separation) per eye and apply a threshold with simple debounce to detect a blink event.
   - Maintain a session state: blink count, timer (session start), and success condition (2 blinks within the configured timeout). Draw overlays on the frame to show instructions, blink count, and status.
   - Listen for keys: `q` to quit, `r` to reset the session.
   - Cleanup: release the camera and close OpenCV windows.

- **Key implementation points:**
   - Model initialization: `main.py` ensures the MediaPipe Face Landmarker task file is present (downloads if missing) and constructs the landmarker with appropriate options (tracking, output format).
   - Landmark extraction: the landmarker returns normalized or pixel coordinates for facial landmarks; the script maps these into pixel-space for the current frame size before computing distances.
   - Blink detection: the script computes a ratio/vertical distance between upper and lower eyelid landmarks (averaging across a small set of eye landmarks for robustness). A small hysteresis/debounce window prevents multiple counts for a single blink.
   - Timing and session logic: a per-session timer enforces the required time window (default ~10s). If the required blinks are detected within the window, the session reports success.
   - UI overlays: OpenCV `putText` and simple shapes annotate the frame with blink counts, remaining time, and success/failure messages.

- **Dependencies:** See `requirements.txt` for the exact packages used:
   - `opencv-python`
   - `mediapipe`
   - `numpy`
   - `requests` (used for model download if applicable)

## Notes

- The script automatically downloads the `face_landmarker.task` model file (approx. 3.6MB) on the first run.
- This is a standalone tool for verification; the main application uses the `liveness/` directory.

---

# Advanced Biometric Liveness Service (FastAPI)

Below is the technical documentation for the production-grade liveness microservice.

## Architecture & Technologies

- **FastAPI**: Modern, high-performance web framework for building APIs with Python.
- **MediaPipe Face Mesh**: A high-fidelity face tracking solution that estimates 468 3D face landmarks in real-time.
- **OpenCV**: Open-source computer vision library for image processing and frame decoding.
- **NumPy**: Fundamental package for scientific computing with Python, used for EAR and variance calculations.

## Service Flow

1. **Input Interface**: Receives image frames and session identifiers via a RESTful POST endpoint.
2. **Preprocessing**: Frames are decoded from buffer and converted to RGB for neural network compatibility.
3. **Face Mesh Processing**: MediaPipe extracts 468 facial landmarks.
4. **Analysis Pipeline**:
   - **EAR (Eye Aspect Ratio)**: Calculates the ratio of distances between eyelid landmarks to detect human blinks.
   - **Static Spoof Detection**: Monitors landmark movement variance across 5 consecutive frames. A variance of 0.0% flags as a `STATIC_IMAGE_SPOOF`.
   - **Challenge-Response**: Validates if the user completes the "2 blinks in 5 seconds" challenge.
5. **Output**: Returns real-time verification status, blink count, and risk flags.

## Input/Output Format

### POST `/api/verify-liveness`

**Input (Multipart/Form-Data):**
- `file`: Image frame (Binary)
- `session_id`: Unique session identifier (String)

**Output (JSON):**
```json
{
  "status": "verified | processing | no_face",
  "blinkCount": 2,
  "isLive": true,
  "variance": 0.00045,
  "verified": true,
  "flags": []
}
```

## Key Concepts

- **Eye Aspect Ratio (EAR)**: A mathematical formula quantifying the eye's openness. If the vertical distance between eyelids drops below a threshold relative to the horizontal width, a "blink" is recorded.
- **Landmark Variance**: Human faces always have micro-movements (breathing, muscle twitching). If facial landmarks are perfectly static across frames, it indicates a high probability of a photo or static screen replay attack.
- **Challenge-Response**: An active liveness check where the user must perform a specific action (blinking) within a time window to prove presence.

## Real-World Use Cases & Impact

- **Digital KYC Onboarding**: Used by Fintech and Banking apps to ensure a live human is opening the account, preventing identity theft using high-resolution photos or deepfake videos.
- **Secure Authentication (2FA)**: Acts as a "Biometric Second Factor" where users must prove presence before accessing sensitive data or authorizing large transactions.
- **Remote Proctoring**: Ensures that a student is physically present and active during an online examination, preventing automated bypasses.
- **Impact**: Dramatically reduces "Presentation Attacks" (spoofing with screen replays or masks) and ensures a frictionless, "passive" security layer for the end user.
