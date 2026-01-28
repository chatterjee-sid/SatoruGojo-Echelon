import React from 'react';

const StatusBar: React.FC = () => {
    return (
        <div className="h-12 border-b border-white/10 flex items-center justify-between px-6 bg-cyber-black/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full alert-bg animate-pulse"></span>
                    <span className="text-xs uppercase tracking-widest font-bold">System Status: <span className="alert-neon-text">Operational</span></span>
                </div>
                <div className="h-4 w-px bg-white/10"></div>
                <div className="text-[10px] uppercase tracking-tighter opacity-70">
                    Uptime: <span className="text-cyber-green">99.98%</span>
                </div>
                <div className="text-[10px] uppercase tracking-tighter opacity-70">
                    Threats Blocked: <span className="text-cyber-red">1,242</span>
                </div>
            </div>

            <div className="flex items-center gap-4 text-[10px] uppercase">
                <div className="flex flex-col items-end">
                    <span className="opacity-50">Latency</span>
                    <span className="text-cyber-green">24ms</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="opacity-50">CPU Load</span>
                    <span className="text-cyber-blue">14%</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="opacity-50">Mem Usage</span>
                    <span className="text-cyber-blue">4.2GB</span>
                </div>
            </div>
        </div>
    );
};

export default StatusBar;
