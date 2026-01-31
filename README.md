# Synthetic Identity Detector

A full-stack web application for detecting synthetic identities using multi-source data correlation. Built with Node.js/Express backend and React frontend.

## Features

### Detection Engine
The core detection system analyzes identity records using four correlation rules:

1. **Age Mismatch Detection**: Flags records where the variance between DOB-calculated age and face-detected age exceeds ±5 years
2. **Identity Clustering**: Detects when the same phone, email, or deviceId is used across multiple unique userIds
3. **Behavioral Pattern Analysis**: Identifies potential bot activity when form completion time is under 2 seconds
4. **Network Fingerprinting**: Flags multiple disparate identities sharing the same IP and deviceId combination

### Risk Scoring
- **0-39**: Low Risk (Clean)
- **40-69**: Medium Risk (Suspicious)
- **70-100**: High Risk (Synthetic)

## Project Structure

```
synthetic-identity-detection/
├── backend/                 # Node.js/Express API
│   ├── server.js           # Main server with Detection Engine
│   ├── package.json        # Backend dependencies
│   ├── routes/             # API routes
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── data/               # Sample data
│   └── demo/               # Demo scripts
├── app/                    # React Frontend (Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── sections/       # Main UI components
│   │   │   ├── Dashboard.tsx      # Main dashboard with upload
│   │   │   ├── ResultsTable.tsx   # Analysis results table
│   │   │   └── DetailView.tsx     # Detailed record analysis
│   │   ├── services/       # API integration
│   │   ├── types/          # TypeScript definitions
│   │   ├── lib/            # Utilities and sample data
│   │   └── components/     # Reusable UI components
│   ├── package.json        # Frontend dependencies
│   └── dist/               # Production build
├── LICENSE                 # MIT License
├── README.md               # This file
└── .gitignore             # Git ignore rules
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/synthetic-identity-detection.git
cd synthetic-identity-detection
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd ../app
npm install
```

## Project Structure

```
synthetic-identity-detection/

## API Endpoints

### POST /api/analyze
Analyzes an array of identity records.

**Request Body:**
```json
{
  "records": [
    {
      "name": "string",
      "dob": "YYYY-MM-DD",
      "email": "string",
      "phone": "string",
      "faceAge": number,
      "deviceId": "string",
      "ip": "string",
      "formTime": number,
      "userId": "string"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalRecords": number,
    "syntheticCount": number,
    "cleanCount": number,
    "averageRiskScore": number,
    "rulesTriggered": {}
  },
  "results": [
    {
      "...recordData",
      "analysis": {
        "riskScore": number,
        "isSynthetic": boolean,
        "reasons": [...],
        "details": [...],
        "analyzedAt": "ISO timestamp"
      }
    }
  ]
}
```

### GET /api/health
Health check endpoint.

## Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm install
npm start
# or npm run dev
```
Server runs on http://localhost:3001

**Frontend (in another terminal):**
```bash
cd app
npm install
npm run dev
```
Dev server runs on http://localhost:5173

### Production Build

**Build frontend:**
```bash
cd app
npm run build
```

**Start backend with static files:**
```bash
cd backend
npm install
npm start
```
The server serves both API and frontend static files on http://localhost:3001

### Production Build

**Build frontend:**
```bash
cd app
npm run build
```

**Start backend with static files:**
```bash
cd backend
npm install
npm start
```
The server serves both API and frontend static files on http://localhost:3001

## Sample Data

The application includes sample data demonstrating various fraud scenarios:
- Clean records with no issues
- Age mismatch (face age vs DOB variance > 5 years)
- Fast form completion (bot suspected)
- Identity clustering (shared email/phone/device)
- Network fingerprint conflicts (same IP + device)

Click "Load Sample" in the dashboard to populate with test data.

## Technology Stack

- **Backend**: Node.js, Express, Helmet, CORS, Morgan
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **UI Components**: Radix UI primitives, Lucide icons
- **State Management**: React hooks (useState, useCallback)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or open an issue on GitHub.

## Acknowledgments

- Built with React, Express.js, and modern web technologies
- UI components from shadcn/ui and Radix UI
- Icons from Lucide Icons
