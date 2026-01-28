import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type ThreatAlert } from '../hooks/useSocket';

interface ThreatStreamProps {
    alerts: ThreatAlert[];
    onClear: () => void;
    isConnected: boolean;
}

const ThreatStream: React.FC<ThreatStreamProps> = ({ alerts, onClear, isConnected }) => {
    const getSeverityStyles = (severity: ThreatAlert['severity']) => {
        switch (severity) {
            case 'critical': return 'text-cyber-red border-cyber-red bg-cyber-red/10';
            case 'high': return 'text-orange-500 border-orange-500 bg-orange-500/10';
            case 'med': return 'text-cyber-blue border-cyber-blue bg-cyber-blue/10';
            case 'low': return 'text-cyber-green border-cyber-green bg-cyber-green/10';
            default: return 'text-gray-400 border-gray-400 bg-gray-400/10';
        }
    };

    return (
        <div className="glass-card flex flex-col h-full max-h-[600px] overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-3">
                    <h3 className="text-xs uppercase tracking-widest font-bold">Live Threat Stream</h3>
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-cyber-green animate-pulse' : 'bg-gray-600'}`}></div>
                </div>
                <button
                    onClick={onClear}
                    className="text-[10px] uppercase font-bold opacity-50 hover:opacity-100 transition-opacity hover:text-cyber-red"
                >
                    Clear Logs
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                <AnimatePresence initial={false}>
                    {alerts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex items-center justify-center text-[10px] uppercase opacity-30 italic"
                        >
                            Listening for incoming threats...
                        </motion.div>
                    ) : (
                        alerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, x: 20, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="border border-white/5 bg-white/5 rounded p-3 text-[11px] font-mono group hover:border-white/20 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="opacity-40">{alert.timestamp}</span>
                                    <span className={`px-2 py-0.5 border text-[9px] uppercase font-bold rounded ${getSeverityStyles(alert.severity)}`}>
                                        {alert.severity}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between">
                                        <span className="text-white/80">Source IP:</span>
                                        <span className="text-cyber-blue">{alert.ip}</span>
                                    </div>
                                    <div className="mt-1 text-white group-hover:alert-neon-text transition-colors">
                                        {alert.event}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ThreatStream;
