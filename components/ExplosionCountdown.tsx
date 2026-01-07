
import React from 'react';

interface CountdownProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
}

const ExplosionCountdown: React.FC<CountdownProps> = ({ timeLeft, totalTime, isActive }) => {
  const percentage = (timeLeft / totalTime) * 100;
  
  const getProgressColor = () => {
    if (percentage > 60) return 'bg-emerald-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-600';
  };

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border ${isActive ? 'border-orange-200 bg-orange-50/10' : 'border-gray-100 opacity-60'} flex flex-col gap-4 transition-all`}>
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Battery Thermal Stability</h3>
            {!isActive && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[8px] rounded uppercase">Idle - Within Safe Limits</span>
            )}
          </div>
          <p className={`text-2xl font-black ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
            {!isActive ? "MONITORING..." : (timeLeft <= 0 ? "FAILURE" : `${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-gray-400 uppercase">Runaway Progress</span>
          <p className={`text-lg font-bold ${isActive ? (percentage < 20 ? 'text-red-600 animate-pulse' : 'text-orange-600') : 'text-gray-400'}`}>
            {!isActive ? 'STANDBY' : (percentage < 20 ? 'EXTREME' : 'ACTIVE DECAY')}
          </p>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${isActive ? getProgressColor() : 'bg-gray-300'}`} 
          style={{ width: `${Math.max(0, percentage)}%` }}
        />
        {!isActive && <div className="absolute inset-0 bg-white/20"></div>}
      </div>
      
      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
        <span>Thermal Runaway Imminent</span>
        <span>Stable State</span>
      </div>
    </div>
  );
};

export default ExplosionCountdown;
