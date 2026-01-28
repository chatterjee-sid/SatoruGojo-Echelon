import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    type?: 'error' | 'info' | 'success';
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, type = 'error' }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const colors = {
        error: 'border-cyber-red bg-cyber-red/10 text-cyber-red',
        info: 'border-cyber-blue bg-cyber-blue/10 text-cyber-blue',
        success: 'border-cyber-green bg-cyber-green/10 text-cyber-green',
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 50, x: '-50%' }}
                    className={`fixed bottom-8 left-1/2 z-[100] px-6 py-3 border rounded font-mono text-xs uppercase tracking-widest backdrop-blur-md shadow-lg ${colors[type]}`}
                >
                    <div className="flex items-center gap-3">
                        <span className="animate-pulse">◈</span>
                        {message}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
