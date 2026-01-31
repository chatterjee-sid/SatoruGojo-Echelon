# Quick Setup Guide

## Complete Project Structure Created!

```
liveness-detection/
├── src/                         # Core source code
│   ├── liveness_engine.py       # Main detection engine
│   └── utils/                   # Modular utilities
│       ├── face_detector.py     # MediaPipe wrapper
│       ├── blink_detector.py    # Blink detection
│       └── anti_spoofing.py     # Anti-spoofing
│
├── examples/                    # Usage examples
│   ├── basic_test.py           # Simple webcam test
│   └── advanced_example.py     # Advanced callbacks
│
├── tests/                       # Unit tests
│   └── test_blink_detector.py
│
├── config/                      # Configuration files
│   ├── default_config.yaml     # Dev settings
│   └── production_config.yaml  # Prod settings
│
├── models/                      # Model files
│   └── README.md               # Download instructions
│
├── docs/                        # Documentation
│   └── architecture.md         # System design
│
├── data/                        # Data storage
│   ├── sample_videos/
│   └── test_images/
│
├── logs/                        # Log files
│
├── requirements.txt             # Python dependencies
├── setup.py                     # Package setup
└── .gitignore                   # Git ignore rules

```

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
cd liveness-detection
pip install -r requirements.txt
```

### Step 2: Download the Model

```bash
cd models
wget https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task
cd ..
```

### Step 3: Run the Basic Test

```bash
python examples/basic_test.py
```

Press 'q' to quit, 'r' to reset session.

## 📋 What's Different from Original Code?

### ✅ Modular Architecture
- **Before**: Everything in one file
- **After**: Separated into logical modules (face_detector, blink_detector, anti_spoofing)

### ✅ Better Organization
- **Before**: Mixed code and tests
- **After**: Clear separation (src/, tests/, examples/, config/)

### ✅ Configuration Management
- **Before**: Hardcoded values
- **After**: YAML configs for dev and production

### ✅ Documentation
- **Before**: No docs
- **After**: Architecture docs, API reference, README

### ✅ Testing
- **Before**: No tests
- **After**: Unit tests included

### ✅ Production Ready
- **Before**: Demo code
- **After**: Error handling, logging, session management

## 🔑 Key Components

### 1. LivenessEngine (`src/liveness_engine.py`)
- Main orchestrator
- Session management
- Combines all detectors

### 2. FaceDetector (`src/utils/face_detector.py`)
- MediaPipe interface
- Landmark extraction
- Clean abstraction

### 3. BlinkDetector (`src/utils/blink_detector.py`)
- EAR calculation
- Blink counting
- State management

### 4. AntiSpoofing (`src/utils/anti_spoofing.py`)
- Variance tracking
- Liveness scoring
- Photo detection

## 📊 How to Use Each Component

### Use the Full Engine (Recommended)
```python
from src.liveness_engine import LivenessEngine

engine = LivenessEngine('models/face_landmarker.task')
result = engine.process_frame(session_id, frame)
```

### Use Individual Components
```python
from src.utils import FaceDetector, BlinkDetector, AntiSpoofing

face_det = FaceDetector('models/face_landmarker.task')
blink_det = BlinkDetector()
anti_spoof = AntiSpoofing()

# Process frame
result = face_det.detect(frame)
landmarks = face_det.get_landmarks(result)
blink_detected, ear = blink_det.detect_blink(landmarks)
anti_spoof.update(landmarks)
is_live = anti_spoof.is_live()
```

## 🎯 Next Steps

1. **Customize Configuration**
   - Edit `config/default_config.yaml`
   - Adjust thresholds for your use case

2. **Add Tests**
   - Write tests for your specific requirements
   - Run: `python -m pytest tests/`

3. **Deploy to Production**
   - Use `config/production_config.yaml`
   - Set up logging
   - Add rate limiting

4. **Extend Functionality**
   - Add new detectors in `src/utils/`
   - Create custom workflows in `examples/`

## 🔒 Security Best Practices

1. Always use HTTPS for video streams
2. Implement rate limiting (3 attempts max)
3. Add session timeouts
4. Log all verification attempts
5. Use in combination with other auth methods

## 📞 Need Help?

Check the documentation in `docs/architecture.md` for detailed information about how everything works together.
