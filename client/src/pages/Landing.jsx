import { Link } from 'react-router-dom';
import { Shield, CheckCircle, FileSearch, Fingerprint, Brain, ArrowRight } from 'lucide-react';
import { Button } from '../components/Common';

const Landing = () => {
    const features = [
        {
            icon: FileSearch,
            title: 'Document Forgery Detection',
            description: 'AI-powered analysis to detect tampered or AI-generated documents',
        },
        {
            icon: Fingerprint,
            title: 'Biometric Liveness',
            description: 'Real-time blink detection to verify human presence',
        },
        {
            icon: Brain,
            title: 'Behavioral Analysis',
            description: 'Track mouse, keyboard, and form patterns for anomaly detection',
        },
        {
            icon: CheckCircle,
            title: 'ML Risk Scoring',
            description: 'Advanced machine learning for accurate fraud probability',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="px-6 py-4">
                <nav className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                            <Shield size={24} className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">KYC Fraud Shield</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link to="/register">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero */}
            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full text-primary-400 text-sm font-medium mb-6">
                        <Shield size={16} />
                        AI-Powered Identity Verification
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Synthetic Identity
                        <br />
                        <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                            Fraud Detection
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        Advanced 7-stage KYC pipeline combining document verification, biometric liveness,
                        behavioral analysis, and ML risk scoring to detect synthetic identity fraud.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <Link to="/application/new">
                            <Button size="lg" icon={ArrowRight} iconPosition="right">
                                Start KYC Verification
                            </Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                                View Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4">
                                <feature.icon size={24} className="text-primary-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Pipeline Steps */}
                <div className="mt-24 text-center">
                    <h2 className="text-3xl font-bold text-white mb-12">7-Stage Verification Pipeline</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Data Intake', 'Document Check', 'Biometrics', 'Behavior Analysis', 'Data Correlation', 'ML Scoring', 'Decision'].map((step, idx) => (
                            <div key={step} className="flex items-center">
                                <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm">
                                    <span className="text-primary-400 font-bold mr-2">{idx + 1}.</span>
                                    {step}
                                </div>
                                {idx < 6 && <ArrowRight size={16} className="text-gray-600 mx-2" />}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 mt-20 py-8">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
                    © 2024 KYC Fraud Shield. Built for AI + Cybersecurity Hackathon.
                </div>
            </footer>
        </div>
    );
};

export default Landing;
