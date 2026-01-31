# Synthetic Identity Detection Backend

This is the backend API for the Synthetic Identity Detection application. It provides a robust engine for analyzing user identity records to detect potential fraud, specifically focusing on "synthetic identities"—fake identities created by combining real and fake information.

## 🚀 Overview

The backend is built with **Node.js** and **Express.js** and follows a modular **MVC (Model-View-Controller)** architecture. It processes identity records (either in batches or individually) and cross-references them against a database of known legitimate users to identify anomalies and high-risk patterns.

## 🛠 Features & Detection Rules

The core of the system is the `DetectionEngine`, which implements four key pillars of fraud detection:

1.  **Age Mismatch Detection** 🎂
    *   **Logic:** Compares the user's Date of Birth (DOB) with their estimated `faceAge`.
    *   **Trigger:** If the variance exceeds ±5 years.
    *   **Why:** Synthetic identities often use real DOBs (from stolen SSNs) that don't match the actual person's appearance.

2.  **Identity Clustering** 🕸️
    *   **Logic:** Checks if sensitive identifiers (Email, Phone, Device ID) are being shared across multiple *different* user IDs.
    *   **Trigger:** If `email`, `phone`, or `deviceId` is associated with another known user.
    *   **Why:** Fraudsters often reuse contact info or devices to manage multiple fake accounts.

3.  **Behavioral Pattern Analysis** 🤖
    *   **Logic:** Analyzes the time taken to complete the registration form (`formTime`).
    *   **Trigger:** If completion time is unnaturally fast (< 2 seconds).
    *   **Why:** Indicates automated scripts/bots rather than human interaction.

4.  **Network Fingerprinting** 🌐
    *   **Logic:** Analyzes the combination of IP Address and Device ID.
    *   **Trigger:** If multiple disparate identities originate from the exact same device and network endpoint.
    *   **Why:** Highly indicative of a "fraud farm" or organized attack.

## 🏗 Architecture

The codebase is refactored into a clean, maintainable structure:

*   **`server.js`**: Application entry point. Sets up middleware (CORS, Helmet, Morgan) and mounts routes.
*   **`routes/`**: Defines API endpoints.
*   **`controllers/`**: Handles request logic, input validation, and orchestrates the detection process.
*   **`services/`**: Contains the business logic.
    *   `detectionEngine.js`: The class containing all the algorithms and scoring logic.
*   **`data/`**: Stores static reference data.
    *   `legitimateUsers.json`: A database of trusted/legitimate user profiles used for cross-referencing new applications.

## 🔌 API Endpoints

### 1. Analyze Records
**POST** `/api/analyze`

Analyzes user data for synthetic fraud.

**Input Format (Single Record):**
Compares the input against the internal `legitimateUsers.json` database.
```json
{
  "record": {
    "name": "John Doe",
    "dob": "01-01-1990",
    "email": "john@example.com",
    "phone": "555-0199",
    "faceAge": 33,
    "deviceId": "uuid-v4-hash",
    "ip": "192.168.1.1",
    "formTime": 5000,
    "userId": "NEW_USER_123"
  }
}
```

**Input Format (Batch):**
Analyzes a batch of records for internal consistency and cross-correlation (useful for processing historical logs).
```json
{
  "records": [ ...array of record objects... ]
}
```

### 2. Health Check
**GET** `/api/health`

Returns the operational status of the API.
```json
{
  "status": "ok",
  "timestamp": "2024-03-21T10:00:00.000Z"
}
```

## ⚙️ Setup & Installation

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    # Runs on http://localhost:3001
    ```

3.  **Run Production Server:**
    ```bash
    npm start
    ```

## 🧪 Testing

You can test the API using the frontend application or via `curl`:

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"record": {"name": "Test", "dob": "01-01-2025", "faceAge": 30, ...}}'
```
