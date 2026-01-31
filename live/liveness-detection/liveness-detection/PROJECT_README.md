# Face Liveness Detection System

A production-ready, real-time face liveness detection system using MediaPipe Face Landmarker with modular architecture and anti-spoofing capabilities.

## 🎯 Features

- **Real-time Blink Detection**: Eye Aspect Ratio (EAR) based blink counting
- **Anti-Spoofing**: Movement variance analysis to detect static images
- **Modular Architecture**: Clean separation of concerns for easy maintenance
- **Session Management**: Multi-user support with unique session IDs
- **Configurable**: YAML-based configuration for development and production
- **Production Ready**: Comprehensive error handling and logging
- **Well Tested**: Unit tests included

## 📁 Project Structure

```
liveness-detection/
├── src/
│   ├── __init__.py
│   ├── liveness_engine.py          # Core detection engine
│   └── utils/
│       ├── __init__.py
│       ├── face_detector.py        # MediaPipe wrapper
│       ├── blink_detector.py       # EAR-based blink detection
│       └── anti_spoofing.py        # Movement variance analysis
├── examples/
│   ├── basic_test.py               # Simple webcam test
│   └── advanced_example.py         # Advanced usage with callbacks
├── tests/
│   ├── __init__.py
│   └── test_blink_detector.py      # Unit tests
├── config/
│   ├── default_config.yaml         # Development settings
│   └── production_config.yaml      # Production settings
├── models/
│   └── README.md                   # Model download instructions
├── docs/
│   └── architecture.md             # System architecture documentation
├── data/
│   ├── sample_videos/
│   └── test_images/
├── logs/
├── requirements.txt
├── setup.py
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### 1. Installation

```bash
# Install dependencies
pip install -r requirements.txt
```

### 2. Download Model

```bash
cd models
wget https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task
cd ..
```

### 3. Run Basic Test

```bash
python examples/basic_test.py
```

## 💡 Usage Examples

### Basic Usage

```python
from src.liveness_engine import LivenessEngine
import cv2

engine = LivenessEngine(model_path='models/face_landmarker.task')
cap = cv2.VideoCapture(0)
ret, frame = cap.read()

result = engine.process_frame(session_id="user_123", frame_data=frame)

if result["verified"]:
    print("✓ Liveness verified!")
```

## ⚙️ Configuration

Edit `config/default_config.yaml`:

```yaml
blink_detection:
  ear_threshold: 0.2
  required_blinks: 2

anti_spoofing:
  variance_threshold: 0.00001
  history_length: 30

session:
  time_limit: 10.0
  timeout: 15.0
```

## 📚 Documentation

See `docs/architecture.md` for detailed system architecture.

## 📄 License

Uses MediaPipe (Apache License 2.0)
