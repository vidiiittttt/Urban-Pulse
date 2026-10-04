import React from 'react';

export const SensorNode = ({ label, active = false }) => {
  return (
    <div className="relative flex items-center justify-center group cursor-pointer">
      <div className={`w-3.5 h-3.5 rounded-sm rotate-45 transition-all duration-200 border ${
        active 
          ? 'bg-cyan-400 border-cyan-200 shadow-[0_0_12px_#22d3ee]' 
          : 'bg-slate-800 border-slate-600'
      }`}>
        {active && <span className="absolute inset-0 rounded-sm bg-cyan-300 animate-ping opacity-75" />}
      </div>
      <div className="absolute bottom-5 hidden group-hover:flex flex-col items-center bg-slate-900 text-cyan-400 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap z-30 shadow-xl">
        <span>{label}</span>
        <span className="text-[8px] text-slate-400">PZT / TENG / MAG</span>
      </div>
    </div>
  );
};