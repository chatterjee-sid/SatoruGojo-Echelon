import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Sidebar: React.FC = () => {
    const { alertColor, setAlertColor } = useTheme();

    const navItems = [
        { name: 'Terminal', icon: '◈' },
        { name: 'Network Map', icon: '◎' },
        { name: 'Intrusion Detection', icon: '⚠' },
        { name: 'Vulnerability Scans', icon: '⚵' },
        { name: 'Logs', icon: '▤' },
        { name: 'Settings', icon: '⚙' },
    ];

    return (
        <div className="w-64 border-r border-white/10 h-screen flex flex-col bg-cyber-black sticky top-0">
            <div className="p-6">
                <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
                    ECHELON <span className="text-xs font-mono alert-neon-text">v1.0</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all group hover:bg-white/5 rounded-md"
                    >
                        <span className="text-cyber-green group-hover:alert-neon-text transition-colors">{item.icon}</span>
                        <span className="opacity-70 group-hover:opacity-100">{item.name}</span>
                    </button>
                ))}
            </nav>

            <div className="p-6 border-t border-white/10">
                <div className="text-[10px] uppercase opacity-50 mb-3 tracking-widest">Alert Profile</div>
                <div className="flex gap-2">
                    {(['cyber-red', 'cyber-green', 'cyber-blue'] as const).map((color) => (
                        <button
                            key={color}
                            onClick={() => setAlertColor(color)}
                            className={`w-6 h-6 rounded-sm border transition-all ${alertColor === color ? 'border-white scale-110 shadow-lg' : 'border-white/10 opacity-50 hover:opacity-100'
                                } ${color === 'cyber-red' ? 'bg-cyber-red' : color === 'cyber-green' ? 'bg-cyber-green' : 'bg-cyber-blue'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
