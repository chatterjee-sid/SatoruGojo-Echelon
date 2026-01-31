# Behavioral Analysis Microservice (Echelon)

A standalone Node.js microservice designed to detect automated interactions and suspicious user behavior during KYC (Know Your Customer) flows. This service uses non-intrusive telemetry to identify bots, script-based navigation, and high-risk input patterns.

## Features

### Advanced Cybersecurity Checks
- **Mouse Trajectory Analysis**: Calculates the "Straightness Ratio" of mouse movements to distinguish between human-curved paths and bot-perfect linear paths.
- **Scroll Entropy Analysis**: Monitors scroll velocity and acceleration to detect automated "jump-to-bottom" or perfectly consistent scroll speeds.
- **Cognitive Hesitation**: Measures the delay between field focus and first keydown. Extremely low delays (< 50ms) across multiple fields suggest pre-programmed input filling.
- **Typing Rhythm Analysis**: Detects bots by analyzing the variance in key press intervals (dwell time and flight time).
- **Navigation Flow**: Identifies suspicious field jumps (e.g., skipping required contact fields to jump straight to PII).
- **PII Paste Detection**: Flags sensitive fields (like SSN or Full Name) that are filled via paste operations.

### Risk Assessment
Returns a **Synthetic Risk Score** (0-100) calculated by weighting various behavioral flags, providing a unified threat assessment for any user session.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Math Utilities**: Math.js (for statistical variance)
- **Networking**: Axios (for internal verification/monitoring)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
cd behavior-service
npm install
```

### Running the Service
```bash
# Production mode
npm start

# Development mode (with nodemon)
npm run dev
```
The service defaults to port `3001`.

## API Documentation

### Analyze Behavior
- **Endpoint**: `POST /api/analyze-behavior`
- **Payload**: Array of telemetry events.
```json
[
  { "type": "mousemove", "x": 100, "y": 150, "timestamp": 1706710000100 },
  { "type": "scroll", "depth": 15, "timestamp": 1706710001500 },
  { "type": "focus", "fieldId": "fullName", "timestamp": 1706710004000 },
  { "type": "keydown", "fieldId": "fullName", "timestamp": 1706710005500 }
]
```
- **Response**:
```json
{
  "behaviorScore": "0.95",
  "syntheticRiskScore": 15,
  "flags": ["PII_Paste_Detected"],
  "details": { ... }
}
```

## Testing & Verification
The project includes a comprehensive testing suite in the `testing/` directory.

### Running Automated Tests
```bash
node testing/run_tests.js
```
This script runs various behavioral samples (Human Healthy, Bot Trajectory, Automated Scroll, etc.) and saves the analysis results to `testing/output/`.

---
Part of the **Echelon Fraud Detection Platform**.
