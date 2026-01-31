import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = authService.getToken();
            const storedUser = authService.getStoredUser();

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);
                setIsAuthenticated(true);

                try {
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser.user || currentUser);
                } catch (error) {
                    console.error('Failed to verify token:', error);
                    authService.logout();
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = useCallback(async (credentials) => {
        try {
            const response = await authService.login(credentials);
            setToken(response.token);
            setUser(response.user);
            setIsAuthenticated(true);
            toast.success('Login successful!');
            return { success: true };
        } catch (error) {
            const message = error.message || 'Login failed';
            toast.error(message);
            return { success: false, error: message };
        }
    }, []);

    const register = useCallback(async (userData) => {
        try {
            const response = await authService.register(userData);
            setToken(response.token);
            setUser(response.user);
            setIsAuthenticated(true);
            toast.success('Registration successful!');
            return { success: true };
        } catch (error) {
            const message = error.message || 'Registration failed';
            toast.error(message);
            return { success: false, error: message };
        }
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        toast.success('Logged out successfully');
    }, []);

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
