# KYC Fraud Shield - Frontend Development Prompt

> **Role**: You are a senior frontend engineer building a hackathon-ready KYC Fraud Detection System frontend.

---

## 📋 PROJECT CONTEXT

We are building a **Synthetic Identity Fraud Detection System** for a 24-hour AI + Cybersecurity hackathon.

### 7-Stage KYC Pipeline

| Stage | Description |
|-------|-------------|
| 1. Data Intake | Form + hidden behavioral collection |
| 2. Document Forgery Detection | AI-generated/tampered detection |
| 3. Biometric Verification | Eye blink liveness + face matching |
| 4. Behavioral Pattern Analysis | Mouse/keyboard/form patterns |
| 5. Multi-Source Data Correlation | Cross-checking all data |
| 6. ML Risk Scoring | Final fraud probability |
| 7. Decision Engine | Approve/review/reject |

---

## ⚠️ CONSTRAINTS

- Must be **fully functional, no placeholders**
- No unnecessary animations
- Focus on demo clarity
- Must integrate with Node.js + Express + Python ML backend
- Buildable in **under 2-3 hours** by 2 developers
- Must work reliably during live demo

---

## 🛠️ TECH STACK (MANDATORY)

| Category | Technology |
|----------|------------|
| Framework | React (Vite) |
| Components | Functional components only |
| Hooks | `useState`, `useEffect`, `useRef`, `useContext` |
| HTTP Client | Axios |
| Styling | Tailwind CSS |
| Routing | react-router-dom |
| Camera | react-webcam |
| Face Detection | face-api.js |
| Charts | chart.js + react-chartjs-2 |
| Notifications | react-hot-toast |
| Icons | lucide-react |

---

## 📁 FOLDER STRUCTURE (CREATE EXACTLY THIS)

```
src/
├── components/
│   ├── Layout/
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── Layout.jsx
│   ├── KYC/
│   │   ├── PersonalInfoForm.jsx
│   │   ├── DocumentUpload.jsx
│   │   ├── BiometricVerification.jsx
│   │   ├── PipelineStatus.jsx
│   │   └── ResultDisplay.jsx
│   ├── Dashboard/
│   │   ├── StatsCards.jsx
│   │   ├── RiskDistributionChart.jsx
│   │   ├── RecentApplications.jsx
│   │   └── RiskGauge.jsx
│   ├── BehaviorTracker/
│   │   └── BehaviorTracker.jsx
│   └── Common/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Card.jsx
│       └── Loading.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── NewApplication.jsx
│   ├── ApplicationDetail.jsx
│   └── Applications.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── kycService.js
│   └── behaviorService.js
├── context/
│   ├── AuthContext.jsx
│   └── BehaviorContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useBehaviorTracking.js
│   └── useBlinkDetection.js
├── utils/
│   ├── constants.js
│   └── helpers.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🔌 API ENDPOINTS TO INTEGRATE

| Service | Base URL |
|---------|----------|
| Backend | `http://localhost:5000` |
| ML Service | `http://localhost:5001` |

### Auth Endpoints

```
POST /api/auth/register    → { email, password, name }
POST /api/auth/login       → { email, password }
GET  /api/auth/me          → Get current user (requires token)
```

### KYC Endpoints

```
POST /api/kyc/start              → Start new KYC application
POST /api/kyc/:id/personal-info  → Submit personal info + behavioral data
POST /api/kyc/:id/document       → Upload document (multipart/form-data)
POST /api/kyc/:id/biometric      → Submit biometric data (face image + liveness result)
GET  /api/kyc/:id/status         → Get current pipeline status
GET  /api/kyc/:id/result         → Get final result
GET  /api/kyc/applications       → List all applications for user
```

### Document Analysis Endpoint (ML Service)

```
POST /api/analyze/document → Analyze document for forgery
```

### Dashboard Endpoints

```
GET /api/dashboard/stats             → Get aggregate statistics
GET /api/dashboard/recent            → Get recent applications
GET /api/dashboard/risk-distribution → Get risk score distribution
```

---

## 📄 PAGES TO BUILD

### 1. Landing.jsx
- Hero section with project title: **"KYC Fraud Shield"**
- Brief description of what system does
- Two CTA buttons: `"Start KYC Verification"` and `"View Dashboard"`
- Simple, professional look

### 2. Login.jsx
- Email and password fields
- Login button
- Link to register page
- Handle loading and error states

### 3. Register.jsx
- Name, email, password fields
- Register button
- Link to login page

### 4. Dashboard.jsx
- Stats cards showing: **Total Applications**, **Approved**, **Rejected**, **Pending Review**
- Pie chart: Risk distribution (Low/Medium/High/Critical)
- Recent applications table with status badges
- Risk gauge showing average risk score

### 5. NewApplication.jsx ⭐ (MOST IMPORTANT PAGE)

This is the main KYC flow with **4 steps**:

#### Step 1: Personal Information Form
- **Fields**: Full Name, DOB, Address, City, State, Country, SSN, Email, Phone
- Hidden behavior tracking starts when page loads
- "Next" button to proceed

#### Step 2: Document Upload
- Upload ID document (drag-drop or click)
- Show upload preview
- Call document analysis API
- Display forgery detection result
- "Next" button (disabled until document analyzed)

#### Step 3: Biometric Verification
- Show webcam feed
- Display instruction: `"Please blink X times"` (X is random 2-4)
- Real-time blink detection using face-api.js
- Show blink counter progress
- Capture face image after liveness verified
- "Next" button (disabled until liveness passed)

#### Step 4: Review & Submit
- Show summary of all entered data
- Show document analysis result
- Show biometric result
- "Submit Application" button
- On submit: Send all data including behavioral data to backend

### 6. ApplicationDetail.jsx
- Show full pipeline status (7 stages with pass/fail/pending)
- Show individual stage scores
- Show final risk score with gauge
- Show decision: **APPROVE/REVIEW/REJECT** with color coding
- Show explanation (top anomalies)
- Show all flags and inconsistencies

### 7. Applications.jsx
- Table listing all KYC applications
- **Columns**: ID, Name, Date, Status, Risk Score, Action
- Status badges: Pending (yellow), Approved (green), Rejected (red), Review (orange)
- Click row to go to ApplicationDetail

---

## 🧩 CRITICAL COMPONENTS TO BUILD

### BehaviorTracker.jsx
> This component runs silently in background during form filling.

**Must Track:**
- Mouse movements (x, y, timestamp) - every 100ms
- Scroll events (direction, velocity)
- Keystroke timings (keydown timestamp, keyup timestamp for each field)
- Field focus events (which field, when focused)
- Time to first keystroke after focus (cognitive hesitation)
- Tab vs Click navigation

**Store all data in context, send to backend on form submit.**

---

### BiometricVerification.jsx

**Must Implement:**
- Webcam access using react-webcam
- Load face-api.js models on mount
- Real-time face detection
- Eye Aspect Ratio (EAR) calculation from landmarks
- Blink detection when EAR drops below `0.20`
- Random challenge generation (2-4 blinks)
- Blink counter display
- 15-second timeout
- Capture frame when liveness verified
- Pass/Fail result

---

### PipelineStatus.jsx

Visual display of 7 pipeline stages:
- Each stage shows: **Name**, **Status** (pending/pass/fail/processing), **Score**
- Use icons: ⏳ pending, ✅ pass, ❌ fail, 🔄 processing
- Highlight current stage
- Show connector lines between stages

---

### RiskGauge.jsx

Circular gauge showing risk score 0-100:

| Score Range | Risk Level | Color |
|-------------|------------|-------|
| 0-30 | Low Risk | 🟢 Green |
| 30-50 | Medium Risk | 🟡 Yellow |
| 50-70 | High Risk | 🟠 Orange |
| 70-100 | Critical Risk | 🔴 Red |

---

## 🗂️ STATE MANAGEMENT

### AuthContext.jsx

**Store:**
- `user` object
- `token`
- `isAuthenticated` boolean
- `login` function
- `logout` function
- `loading` state

### BehaviorContext.jsx

**Store:**
- `mouseMovements` array
- `scrollEvents` array
- `keystrokeTimings` object (per field)
- `fieldFocusEvents` array
- `navigationPatterns` array
- `startTracking` function
- `stopTracking` function
- `getData` function (returns all behavioral data)
- `resetData` function

---

## 📡 API SERVICE FILES

### api.js
```javascript
// Create axios instance with base URL
// Add request interceptor to attach JWT token
// Add response interceptor for error handling
// Export configured instance
```

### kycService.js
```javascript
// startApplication()                              → POST /api/kyc/start
// submitPersonalInfo(id, data, behaviorData)      → POST /api/kyc/:id/personal-info
// uploadDocument(id, file)                        → POST /api/kyc/:id/document (multipart)
// submitBiometric(id, faceImage, livenessResult)  → POST /api/kyc/:id/biometric
// getStatus(id)                                   → GET /api/kyc/:id/status
// getResult(id)                                   → GET /api/kyc/:id/result
// getApplications()                               → GET /api/kyc/applications
```

### behaviorService.js
```javascript
// formatBehaviorData(rawData)  → Convert raw tracking data to API format
// calculateMetrics(data)       → Calculate derived metrics (typing speed, mouse velocity, etc.)
```

---

## 🎨 UI SPECIFICATIONS

### Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Blue | `#3B82F6` |
| Success | Green | `#10B981` |
| Warning | Yellow | `#F59E0B` |
| Danger | Red | `#EF4444` |
| Background | Gray | `#F3F4F6` |
| Card Background | White | `#FFFFFF` |
| Text | Dark Gray | `#1F2937` |

### Status Badge Colors

| Status | Background | Text |
|--------|------------|------|
| Approved | Green | White |
| Rejected | Red | White |
| Pending Review | Orange | White |
| Processing | Blue | White |
| Pending | Gray | Dark |

### Risk Score Colors

| Score Range | Color |
|-------------|-------|
| 0-30 | Green |
| 31-50 | Yellow |
| 51-70 | Orange |
| 71-100 | Red |

---

## 🔧 SPECIFIC IMPLEMENTATION REQUIREMENTS

### For Blink Detection (`useBlinkDetection.js` hook)

1. **Load these face-api.js models on mount:**
   - `tinyFaceDetector`
   - `faceLandmark68TinyNet`

2. **Get video element ref**

3. **Run detection every 100ms**

4. **Calculate EAR (Eye Aspect Ratio):**
   ```
   EAR = (|P2-P6| + |P3-P5|) / (2 * |P1-P4|)
   ```

5. **Eye landmark indices:**
   - Left eye: `[36-41]`
   - Right eye: `[42-47]`

6. **Blink threshold:** EAR < `0.20` for 2+ consecutive frames

7. **Track blink timestamps** to validate natural timing (150-400ms per blink)

---

### For Behavior Tracking (`useBehaviorTracking.js` hook)

1. Add event listeners on mount, remove on unmount
2. Throttle mouse tracking to every 100ms (performance)

**Calculate derived metrics:**
- `avgMouseVelocity`
- `mouseJitter` (variance in small movements)
- `scrollEntropy`
- `avgTypingSpeed` (chars per minute)
- `keystrokeDwellVariance`
- `keystrokeFlightVariance`
- `avgCognitiveHesitation`
- `tabToClickRatio`

---

### For Document Upload

- **Accept**: `image/jpeg`, `image/png`, `application/pdf`
- **Max size**: 10MB
- Show preview for images
- Show loading while analyzing
- Display analysis result with forgery score and flags

---

## 📦 WHAT TO GENERATE

Generate **complete, copy-paste ready** code for:

1. ✅ All files in the folder structure
2. ✅ `package.json` with all dependencies
3. ✅ `tailwind.config.js`
4. ✅ `vite.config.js`
5. ✅ `index.css` with Tailwind imports
6. ✅ Every component fully implemented
7. ✅ Every page fully implemented
8. ✅ All hooks fully implemented
9. ✅ All services fully implemented
10. ✅ All context providers fully implemented

---

## 📝 OUTPUT FORMAT

For each file, output:

```jsx
// filepath: src/components/Example.jsx
[complete code here]
```

**Generate files in this order:**

1. Configuration files (`package.json`, `vite.config.js`, `tailwind.config.js`, `index.css`)
2. Utils and constants
3. Services (`api.js`, `authService.js`, `kycService.js`, `behaviorService.js`)
4. Context providers
5. Hooks
6. Common components
7. Feature components (Layout, KYC, Dashboard, BehaviorTracker)
8. Pages
9. `App.jsx` and `main.jsx`

---

## ❗ IMPORTANT NOTES

- ❌ **NO** placeholder comments like `"// implement logic here"`
- ❌ **NO** TypeScript
- ❌ **NO** incomplete functions
- ✅ Every component must be **fully working**
- ✅ Include **proper error handling**
- ✅ Include **loading states**
- ✅ Include **toast notifications** for user feedback
- ✅ Make it **demo-ready**
- ✅ Keep code **simple and readable**
- ✅ Add brief comments only where logic is complex

---

## 🚀 START GENERATING THE COMPLETE FRONTEND CODE NOW.

---

## 📖 HOW TO USE THIS PROMPT

1. **Copy everything** from this document
2. **Open Claude** (claude.ai or API)
3. **Paste the entire prompt**
4. **Wait for Claude to generate** all the files
5. **Copy each file** into your project

---

## ⚙️ AFTER GENERATION - Setup Commands

```bash
# Create Vite React project
npm create vite@latest client -- --template react
cd client

# Install dependencies
npm install axios react-router-dom react-webcam face-api.js chart.js react-chartjs-2 react-hot-toast lucide-react

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then copy all generated files into the `src/` folder.