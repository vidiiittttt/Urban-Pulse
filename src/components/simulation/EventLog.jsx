import React from 'react';
import { useSimulation } from './SimulationContext';

export const EventLog = () => {
  const { events } = useSimulation();

  const getEventStyle = (type) => {
    switch (type) {
      case 'EMERGENCY': return 'text-red-400 bg-red-950/30 border-red-800/50';
      case 'ALERT': return 'text-amber-400 bg-amber-950/20 border-amber-800/40';
      case 'SYSTEM': return 'text-cyan-400 bg-cyan-950/20 border-cyan-800/40';
      case 'SUCCESS': return 'text-emerald-400 bg-emerald-950/20 border-emerald-800/40';
      default: return 'text-slate-300 bg-slate-950/40 border-slate-800/60';
    }
  };

  return (
    <div className="flex flex-col h-[240px] bg-slate-900/80 border border-slate-800 rounded-xl p-3 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Live Sensor & Signal Event Stream
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px] scrollbar-thin">
        {events.map((event) => (
          <div 
            key={event.id}
            className={`p-1.5 rounded border ${getEventStyle(event.type)} flex items-start gap-2 transition-all`}
          >
            <span className="text-slate-500 shrink-0 text-[10px]">{event.timestamp}</span>
            <span className="flex-1 leading-tight">{event.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventLog;