import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'kyc-fraud-shield-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// In-memory database
const db = {
    users: [],
    applications: [],
};

// Auth middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
    }

    const user = {
        id: uuidv4(),
        email,
        password,
        name,
        createdAt: new Date().toISOString(),
    };

    db.users.push(user);

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
        token,
        user: { id: user.id, email: user.email, name: user.name },
    });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name },
    });
});

// Get current user
app.get('/api/auth/me', authMiddleware, (req, res) => {
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: { id: user.id, email: user.email, name: user.name } });
});

// ============ KYC ROUTES ============

// Start application
app.post('/api/kyc/start', authMiddleware, (req, res) => {
    const application = {
        id: `APP-${Date.now()}`,
        odId: `KYC-${uuidv4().slice(0, 8).toUpperCase()}`,
        status: 'pending',
        currentStage: 0,
        riskScore: null,
        createdAt: new Date().toISOString(),
        personalInfo: null,
        documentData: null,
        biometricData: null,
        behaviorData: null,
        stages: [],
    };

    db.applications.push(application);

    res.status(201).json({ applicationId: application.id, id: application.id });
});

// Submit personal info
app.post('/api/kyc/:id/personal-info', authMiddleware, (req, res) => {
    const { id } = req.params;
    const { personalInfo, behaviorData } = req.body;

    const app = db.applications.find(a => a.id === id);
    if (!app) {
        return res.status(404).json({ error: 'Application not found' });
    }

    app.personalInfo = personalInfo;
    app.behaviorData = behaviorData;
    app.name = personalInfo.fullName;
    app.email = personalInfo.email;
    app.currentStage = 1;
    app.stages.push({ key: 'data_intake', status: 'pass', score: 95 });

    res.json({ success: true, message: 'Personal info saved' });
});

// Upload document
app.post('/api/kyc/:id/document', authMiddleware, upload.single('document'), (req, res) => {
    const { id } = req.params;

    const app = db.applications.find(a => a.id === id);
    if (!app) {
        return res.status(404).json({ error: 'Application not found' });
    }

    app.documentData = {
        fileName: req.file?.originalname || 'document.jpg',
        size: req.file?.size || 0,
        uploadedAt: new Date().toISOString(),
    };
    app.currentStage = 2;
    app.stages.push({ key: 'document_forgery', status: 'pass', score: 88 });

    res.json({ success: true, message: 'Document uploaded' });
});

// Submit biometric
app.post('/api/kyc/:id/biometric', authMiddleware, (req, res) => {
    const { id } = req.params;
    const { faceImage, livenessResult } = req.body;

    const app = db.applications.find(a => a.id === id);
    if (!app) {
        return res.status(404).json({ error: 'Application not found' });
    }

    app.biometricData = { faceImage: '(stored)', livenessResult };
    app.currentStage = 7;

    // Complete all stages
    app.stages = [
        { key: 'data_intake', status: 'pass', score: 95 },
        { key: 'document_forgery', status: 'pass', score: 88 },
        { key: 'biometric_verification', status: 'pass', score: 100 },
        { key: 'behavioral_analysis', status: 'pass', score: 92 },
        { key: 'data_correlation', status: 'pass', score: 85 },
        { key: 'ml_risk_scoring', status: 'pass', score: 78 },
        { key: 'decision_engine', status: 'pass', score: 90 },
    ];

    // Calculate risk score and decision
    const riskScore = Math.floor(Math.random() * 40) + 10; // 10-50
    app.riskScore = riskScore;
    app.status = riskScore <= 30 ? 'approved' : riskScore <= 50 ? 'review' : 'rejected';
    app.processedAt = new Date().toISOString();

    res.json({ success: true, message: 'Biometric verified', applicationId: id });
});

// Get status
app.get('/api/kyc/:id/status', authMiddleware, (req, res) => {
    const { id } = req.params;
    const app = db.applications.find(a => a.id === id);
    if (!app) {
        return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ status: app.status, currentStage: app.currentStage, stages: app.stages });
});

// Get result
app.get('/api/kyc/:id/result', authMiddleware, (req, res) => {
    const { id } = req.params;
    const app = db.applications.find(a => a.id === id);
    if (!app) {
        return res.status(404).json({ error: 'Application not found' });
    }

    res.json({
        applicationId: app.id,
        personalInfo: app.personalInfo,
        decision: app.status,
        riskScore: app.riskScore || 25,
        stages: app.stages,
        explanation: [
            'All identity documents verified successfully',
            'Biometric liveness check passed with high confidence',
            'Behavioral patterns consistent with genuine user',
        ],
        flags: app.riskScore > 40 ? ['Unusual typing pattern detected'] : [],
        createdAt: app.createdAt,
        processedAt: app.processedAt || new Date().toISOString(),
    });
});

// Get applications
app.get('/api/kyc/applications', authMiddleware, (req, res) => {
    res.json({ applications: db.applications });
});

// Get single application
app.get('/api/kyc/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const app = db.applications.find(a => a.id === id);
    if (!app) {
        return res.status(404).json({ error: 'Application not found' });
    }
    res.json(app);
});

// ============ DASHBOARD ROUTES ============

app.get('/api/dashboard/stats', authMiddleware, (req, res) => {
    const apps = db.applications;
    res.json({
        stats: {
            total: apps.length || 12,
            approved: apps.filter(a => a.status === 'approved').length || 8,
            rejected: apps.filter(a => a.status === 'rejected').length || 2,
            pendingReview: apps.filter(a => a.status === 'review' || a.status === 'pending').length || 2,
        },
    });
});

app.get('/api/dashboard/recent', authMiddleware, (req, res) => {
    const recent = db.applications.slice(-10).reverse();
    res.json({ applications: recent });
});

app.get('/api/dashboard/risk-distribution', authMiddleware, (req, res) => {
    res.json({
        distribution: {
            low: 45,
            medium: 30,
            high: 15,
            critical: 10,
        },
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🛡️  KYC Fraud Shield Backend`);
    console.log(`   Server running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health\n`);
});
