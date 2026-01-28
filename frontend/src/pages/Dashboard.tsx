import React from 'react';
import ThreatStream from '../components/ThreatStream';
import DashboardStats from '../components/DashboardStats';
import RiskGauge from '../components/RiskGauge';
import AnalysisTool from '../components/AnalysisTool';
import { useSocket } from '../hooks/useSocket';
import { type HistoricalThreat } from '../services/api';

interface DashboardProps {
    initialHistory?: HistoricalThreat[];
}

const Dashboard: React.FC<DashboardProps> = ({ initialHistory }) => {
    const { messages, isConnected, clearMessages } = useSocket('ws://localhost:8080');

    // Default data for stats components - merge with initialHistory if provided
    const historicalData = (initialHistory && initialHistory.length > 0) ? initialHistory : [
        { time: '11:30', threats: 12 },
        { time: '11:31', threats: 18 },
        { time: '11:32', threats: 15 },
        { time: '11:33', threats: 25 },
        { time: '11:34', threats: 32 },
        { time: '11:35', threats: 28 },
        { time: '11:36', threats: 45 },
        { time: '11:37', threats: 38 },
        { time: '11:38', threats: 42 },
        { time: '11:39', threats: 54 },
    ];

    const stats = [
        { label: 'Active Sessions', value: '42', trend: '+12%', color: 'cyber-green' },
        { label: 'Network Integrity', value: '94%', trend: '-1.2%', color: 'cyber-blue' },
        { label: 'Protocol Violations', value: '7', trend: '+2', color: 'cyber-red' },
        { label: 'Neural Link Load', value: '64%', trend: '+8%', color: 'cyber-green' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] opacity-50 mb-1">Central Command</h2>
                    <h1 className="text-4xl font-black tracking-tighter">NETWORK MONITOR</h1>
                </div>
                <div className="glass-card flex items-center gap-4 px-6 h-16 bg-cyber-red/5">
                    <RiskGauge level={64} />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <DashboardStats
                        totalThreats={12842}
                        avgRiskScore={4.2}
                        activeAttacks={messages.length > 5 ? 3 : 1}
                        historicalData={historicalData}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="glass-card p-4 border-l-2 alert-border">
                                <div className="text-[9px] uppercase tracking-wider opacity-60 mb-1">{stat.label}</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold tracking-tight">{stat.value}</span>
                                    <span className={`text-[8px] ${stat.trend.startsWith('+') ? 'text-cyber-green' : 'text-cyber-red'}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <AnalysisTool />
                    <ThreatStream
                        alerts={messages}
                        onClear={clearMessages}
                        isConnected={isConnected}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
