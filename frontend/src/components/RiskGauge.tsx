import React from 'react';

interface RiskGaugeProps {
    level: number; // 0 to 100
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ level }) => {
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (level / 100) * circumference;

    const getColor = (val: number) => {
        if (val < 30) return 'stroke-cyber-green';
        if (val < 70) return 'stroke-cyber-blue';
        return 'stroke-cyber-red';
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-4 h-full">
            <div className="relative w-24 h-24">
                {/* Background Circle */}
                <svg className="w-full h-full -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-white/5"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={`transition-all duration-1000 ease-out ${getColor(level)}`}
                        style={{ filter: 'drop-shadow(0 0 5px currentColor)' }}
                    />
                </svg>

                {/* Percentage text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-xl font-black leading-none ${level > 70 ? 'text-cyber-red' : level > 30 ? 'text-cyber-blue' : 'text-cyber-green'}`}>
                        {level}%
                    </span>
                    <span className="text-[7px] uppercase opacity-40 font-bold tracking-tighter">Risk Factor</span>
                </div>
            </div>

            <div className="mt-2 text-center">
                <div className="text-[10px] uppercase font-bold opacity-70 tracking-widest">
                    {level < 30 ? 'Low' : level < 70 ? 'Moderate' : 'Critical'} Threat Level
                </div>
            </div>
        </div>
    );
};

export default RiskGauge;
