# System Architecture

## Overview

The Liveness Detection System is designed with a modular architecture that separates concerns and allows for easy testing and maintenance.

## Component Diagram

```
┌─────────────────────────────────────────────────────┐
│                  Application Layer                   │
│  (examples/basic_test.py, advanced_callbacks.py)    │
└─────────────────────────┬───────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────┐
│              LivenessEngine (Core)                   │
│  - Session management                                │
│  - Workflow orchestration                            │
│  - Result aggregation                                │
└───┬──────────────┬───────────────┬──────────────────┘
    │              │               │
┌───▼────────┐ ┌──▼───────────┐ ┌─▼──────────────────┐
│    Face    │ │    Blink     │ │   Anti-Spoofing    │
│  Detector  │ │   Detector   │ │                    │
│            │ │              │ │                    │
│ MediaPipe  │ │ EAR-based    │ │ Variance Analysis  │
│ Landmarks  │ │ Detection    │ │                    │
└────────────┘ └──────────────┘ └────────────────────┘
```

## Module Descriptions

### 1. Core Module (`src/liveness_engine.py`)

**Responsibilities:**
- Coordinate all detection components
- Manage user sessions
- Enforce verification rules
- Aggregate results

**Key Methods:**
- `process_frame()`: Main processing pipeline
- `reset_session()`: Clear session state

### 2. Face Detector (`src/utils/face_detector.py`)

**Responsibilities:**
- Interface with MediaPipe Face Landmarker
- Extract facial landmarks
- Handle model initialization

**Dependencies:**
- MediaPipe Tasks API
- OpenCV for image processing

### 3. Blink Detector (`src/utils/blink_detector.py`)

**Responsibilities:**
- Calculate Eye Aspect Ratio (EAR)
- Track eye state over time
- Count blinks

**Algorithm:**
```
EAR = (||p2-p6|| + ||p3-p5||) / (2 * ||p1-p4||)

If EAR < threshold:
    Eye is closed
Else:
    If was previously closed:
        Blink detected
```

### 4. Anti-Spoofing (`src/utils/anti_spoofing.py`)

**Responsibilities:**
- Track landmark movement over time
- Calculate variance in 3D positions
- Distinguish live faces from photos

**Features:**
- Multi-point tracking (nose, chin, forehead)
- Configurable history window
- Confidence scoring

## Data Flow

```
Camera Frame (BGR)
    ↓
Convert to RGB
    ↓
MediaPipe Detection
    ↓
Extract Landmarks
    ↓
    ├─→ Blink Detector → EAR Calculation → Blink Count
    │
    ├─→ Anti-Spoofing → Variance Analysis → Liveness Score
    │
    └─→ Session Manager → Rule Verification → Final Result
```

## Session State Machine

```
┌─────────┐
│  START  │
└────┬────┘
     │
     ▼
┌────────────┐
│ PROCESSING │◄─────┐
└─┬──────┬──┘      │
  │      │         │
  │      └─────────┘
  │       (Continue)
  │
  ├─→ VERIFIED (Success)
  ├─→ TIMEOUT (Failed)
  └─→ NO_FACE (Retry)
```

## Configuration Management

Configurations are stored in YAML files:
- `config/default_config.yaml` - Development settings
- `config/production_config.yaml` - Production settings

Loaded at runtime based on environment.

## Error Handling

1. **Camera Errors**: Graceful fallback with error messages
2. **Model Loading**: Validate model path before initialization
3. **Detection Failures**: Return safe default states
4. **Resource Cleanup**: Ensure proper cleanup in all exit paths

## Performance Considerations

- **Frame Rate**: Targets 30 FPS for real-time detection
- **Memory**: Limited history windows to prevent memory growth
- **CPU Usage**: Optimized landmark extraction
- **Latency**: Sub-100ms processing per frame

## Security Features

1. **Anti-Spoofing**: Variance-based photo detection
2. **Session Timeout**: Prevents indefinite sessions
3. **Rate Limiting**: (Future) Prevent brute force attempts
4. **Audit Logging**: (Future) Track all verification attempts

## Extension Points

The architecture allows for easy extension:

1. **New Detectors**: Implement detector interface
2. **Additional Checks**: Add to process pipeline
3. **Custom Rules**: Modify verification logic
4. **Output Formats**: Add result formatters

## Testing Strategy

- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **End-to-End Tests**: Full pipeline validation
- **Performance Tests**: FPS and latency benchmarks
