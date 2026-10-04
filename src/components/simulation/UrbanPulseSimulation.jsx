import React from 'react';
import { SimulationProvider, useSimulation } from './SimulationContext';
import { Intersection } from './Intersection';
import { SimulationControls } from './SimulationControls';
import { EventLog } from './EventLog';

const MetricsHeader = () => {
  const { vehicleCount, averageSpeed, density } = useSimulation();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
        <span className="text-[11px] font-mono text-slate-400 block">ACTIVE VEHICLES</span>
        <span className="text-xl font-mono font-bold text-cyan-400">{vehicleCount}</span>
      </div>
      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
        <span className="text-[11px] font-mono text-slate-400 block">AVG CROSSING SPEED</span>
        <span className="text-xl font-mono font-bold text-emerald-400">{averageSpeed} km/h</span>
      </div>
      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
        <span className="text-[11px] font-mono text-slate-400 block">NORTH / SOUTH FLOW</span>
        <span className="text-xl font-mono font-bold text-purple-400">{density.north + density.south} veh</span>
      </div>
      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
        <span className="text-[11px] font-mono text-slate-400 block">EAST / WEST FLOW</span>
        <span className="text-xl font-mono font-bold text-amber-400">{density.east + density.west} veh</span>
      </div>
    </div>
  );
};

export const UrbanPulseSimulationView = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="mb-4">
        <h2 className="text-xl font-mono font-bold text-cyan-400 tracking-wide">
          URBAN PULSE // VIRTUAL TRAFFIC & SMART PAVEMENT ENGINE
        </h2>
        <p className="text-xs font-mono text-slate-400">
          Simulated Patent Concept: Self-Powered, Camera-less Piezo/Tribo/Magnetic Smart Pavement Telemetry
        </p>
      </div>

      <MetricsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Intersection />
        </div>
        <div className="flex flex-col gap-4">
          <SimulationControls />
          <EventLog />
        </div>
      </div>
    </div>
  );
};

export default function UrbanPulseSimulation() {
  return (
    <SimulationProvider>
      <UrbanPulseSimulationView />
    </SimulationProvider>
  );
}