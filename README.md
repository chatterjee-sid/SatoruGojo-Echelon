# Echelon: Modular Risk Assessment & Monitoring Platform

Echelon is a high-performance, real-time threat detection and risk assessment platform. Built with a modular plugin architecture, it allows for dynamic loading of detection models and provides a live dashboard for monitoring system health and threat levels.

![Echelon Preview](https://via.placeholder.com/800x400?text=Echelon+Dashboard+Preview)

## 🚀 Features

- **Modular Plugin System**: Easily integrate new detection models without restarting the server.
- **Real-time Alerting**: WebSocket-based push notifications for high-risk detections.
- **Interactive Dashboard**: Visualize threat history with Recharts and smooth animations via Framer Motion.
- **Comprehensive API**: RESTful endpoints for prediction, history retrieval, and system status.
- **Dynamic Configuration**: Hot-swappable active models and flexible CORS settings.

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.9+)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
- **Database**: SQLite (scalable to PostgreSQL)
- **Real-time**: WebSockets

### Frontend
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)

## 📂 Project Structure

```text
Echelon/
├── app/                # FastAPI Backend
│   ├── api/            # API routes
│   ├── core/           # Core configuration and database logic
│   ├── models/         # SQLAlchemy models
│   ├── modules/        # Dynamic plugins/models
│   └── main.py         # Entry point
├── frontend/           # React + Vite Frontend
│   ├── src/            # Components, Hooks, Context, Pages
│   └── public/         # Static assets
├── test/               # Test suites
└── requirements.txt    # Python dependencies
```

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd Echelon
```

### 2. Backend Setup
```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload
```
The server will be available at `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The dashboard will be available at `http://localhost:5173`.

## 🔋 Plugin Development

Echelon uses a plugin pattern. To add a new detection model:
1. Create a new `.py` file in `app/modules/`.
2. Implement the `BaseModel` interface (preprocess and predict methods).
3. Update `ACTIVE_MODEL` in `.env` or `app/core/config.py`.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
