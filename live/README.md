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

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

Run the script:
```bash
python main.py
```

- **Objective**: Blink 2 times within 10 seconds.
- **Controls**:
  - `q`: Quit the application.
  - `r`: Reset the liveness session.

## Notes

- The script automatically downloads the `face_landmarker.task` model file (approx. 3.6MB) on the first run.
- This is a standalone tool for verification; the main application uses the `liveness/` directory.
