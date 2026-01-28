import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStatsProps {
    totalThreats: number;
    avgRiskScore: number;
    activeAttacks: number;
    historicalData: { time: string; threats: number }[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
    totalThreats,
    avgRiskScore,
    activeAttacks,
    historicalData
}) => {
    return (
        <div className="space-y-6">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4 border-l-2 border-cyber-green">
                    <div className="text-[10px] uppercase opacity-50 mb-1 tracking-widest">Total Threats Detected</div>
                    <div className="text-2xl font-black neon-text">{totalThreats.toLocaleString()}</div>
                </div>
                <div className="glass-card p-4 border-l-2 border-cyber-blue">
                    <div className="text-[10px] uppercase opacity-50 mb-1 tracking-widest">Average Risk Score</div>
                    <div className="text-2xl font-black text-cyber-blue" style={{ textShadow: '0 0 8px rgba(0, 243, 255, 0.4)' }}>
                        {avgRiskScore.toFixed(1)}/10.0
                    </div>
                </div>
                <div className="glass-card p-4 border-l-2 border-cyber-red">
                    <div className="text-[10px] uppercase opacity-50 mb-1 tracking-widest">Active Attacks</div>
                    <div className="text-2xl font-black text-cyber-red animate-pulse">{activeAttacks}</div>
                </div>
            </div>

            {/* Line Chart */}
            <div className="glass-card p-6 h-[250px] flex flex-col">
                <h3 className="text-xs uppercase tracking-widest font-bold mb-4 opacity-70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-ping"></span>
                    Threat Activity (Last 10 Min)
                </h3>
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="time"
                                stroke="#666"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#666"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0a0a0a',
                                    border: '1px solid #ffffff10',
                                    fontSize: '11px',
                                    borderRadius: '4px'
                                }}
                                itemStyle={{ color: '#00ccff' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="threats"
                                stroke="#00f3ff"
                                strokeWidth={2}
                                dot={{ r: 2, fill: '#00f3ff' }}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
