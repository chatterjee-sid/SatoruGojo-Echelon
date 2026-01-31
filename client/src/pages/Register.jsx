import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User } from 'lucide-react';
import { Button, Input, Card } from '../components/Common';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
        });

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4">
                        <Shield size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Create Account</h1>
                    <p className="text-gray-400 mt-2">Get started with KYC Fraud Shield</p>
                </div>

                {/* Form */}
                <Card className="bg-gray-800/50 border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-danger-500/10 border border-danger-500/20 rounded-lg text-danger-400 text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            icon={User}
                            className="[&_label]:text-gray-300 [&_input]:bg-gray-700 [&_input]:border-gray-600 [&_input]:text-white"
                        />

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            icon={Mail}
                            className="[&_label]:text-gray-300 [&_input]:bg-gray-700 [&_input]:border-gray-600 [&_input]:text-white"
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            icon={Lock}
                            className="[&_label]:text-gray-300 [&_input]:bg-gray-700 [&_input]:border-gray-600 [&_input]:text-white"
                        />

                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            icon={Lock}
                            className="[&_label]:text-gray-300 [&_input]:bg-gray-700 [&_input]:border-gray-600 [&_input]:text-white"
                        />

                        <Button type="submit" fullWidth loading={loading} size="lg">
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </Card>

                <p className="text-center text-gray-500 text-sm mt-8">
                    <Link to="/" className="hover:text-gray-400">← Back to Home</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
