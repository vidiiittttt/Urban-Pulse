import React from 'react';
import { useSimulation } from './SimulationContext';

export const SimulationControls = () => {
  const { simulateVehicle, simulateEmergencyVehicle, congestion, batteryLevel, energyGenerated } = useSimulation();

  const getCongestionBadge = (status) => {
    switch (status) {
      case 'NORMAL': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'BUSY': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'HEAVY': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider">
          Simulation Controls & Energy Metrics
        </h3>
        <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md border ${getCongestionBadge(congestion)}`}>
          CONGESTION: {congestion}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => simulateVehicle()}
          className="px-3 py-2 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-mono font-semibold transition"
        >
          + Spawn Random Vehicle
        </button>

        <button 
          onClick={simulateEmergencyVehicle}
          className="px-3 py-2 bg-red-600/40 hover:bg-red-600/60 border border-red-500 text-red-200 rounded-lg text-xs font-mono font-bold transition shadow-[0_0_12px_rgba(239,68,68,0.3)]"
        >
          🚨 Simulate Emergency Vehicle
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {['Car', 'Two-wheeler', 'Bus', 'Truck', 'Pedestrian'].map(type => (
          <button
            key={type}
            onClick={() => simulateVehicle(type)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-[11px] font-mono transition"
          >
            +{type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-400 block">PIEZO/TENG HARVESTED</span>
          <span className="text-base font-mono font-bold text-emerald-400">{energyGenerated} J</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-400 block">EST. BATTERY LEVEL</span>
          <span className="text-base font-mono font-bold text-cyan-400">{batteryLevel}%</span>
        </div>
      </div>
    </div>
  );
};