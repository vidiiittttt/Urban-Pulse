import React from 'react';

export const TrafficLight = ({ state = 'RED', direction = 'N' }) => {
  const getLightColor = () => {
    switch (state) {
      case 'GREEN': return 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]';
      case 'YELLOW': return 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]';
      default: return 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]';
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 p-1.5 bg-slate-900/90 border border-slate-700 rounded-lg shadow-xl backdrop-blur-md z-30">
      <span className="text-[10px] font-mono font-bold text-slate-400">{direction}</span>
      <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${getLightColor()}`} />
      <span className="text-[9px] font-mono text-slate-300 uppercase">{state}</span>
    </div>
  );
};


export { TrafficLight };
export default TrafficLight;