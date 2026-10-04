import React from 'react';
import { useSimulation } from './SimulationContext';
import { Vehicle } from './Vehicle';
// import TrafficLight from './TrafficLight';
import { SensorNode } from './SensorNode';

export const Intersection = () => {
  const { vehicles, trafficSignals, emergencyMode } = useSimulation();

  return (
    <div className="relative w-full h-[520px] bg-slate-950 rounded-xl border border-cyan-500/20 overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

      {emergencyMode && (
        <div className="absolute top-0 inset-x-0 bg-red-600/90 text-white text-center py-1 font-mono text-xs font-bold tracking-widest z-40 animate-pulse border-b border-red-400">
          🚨 EMERGENCY VEHICLE OVERRIDE PROTOCOL ACTIVE - CORRIDOR CLEARANCE 🚨
        </div>
      )}

      {/* Vertical Road */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-32 bg-slate-900 border-x border-slate-700/60">
        <div className="absolute inset-y-0 left-1/2 border-r-2 border-dashed border-amber-500/40" />
      </div>

      {/* Horizontal Road */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-32 bg-slate-900 border-y border-slate-700/60">
        <div className="absolute inset-x-0 top-1/2 border-b-2 border-dashed border-amber-500/40" />
      </div>

      {/* Smart Pavement Sensor Nodes */}
      <div className="absolute top-[15%] left-[46%] -translate-x-1/2"><SensorNode label="Node N-A (0m)" /></div>
      <div className="absolute top-[27.5%] left-[46%] -translate-x-1/2"><SensorNode label="Node N-B (12.5m)" /></div>

      <div className="absolute bottom-[15%] left-[54%] -translate-x-1/2"><SensorNode label="Node S-A (0m)" /></div>
      <div className="absolute bottom-[27.5%] left-[54%] -translate-x-1/2"><SensorNode label="Node S-B (12.5m)" /></div>

      <div className="absolute left-[15%] top-[54%] -translate-y-1/2"><SensorNode label="Node W-A (0m)" /></div>
      <div className="absolute left-[27.5%] top-[54%] -translate-y-1/2"><SensorNode label="Node W-B (12.5m)" /></div>

      <div className="absolute right-[15%] top-[46%] -translate-y-1/2"><SensorNode label="Node E-A (0m)" /></div>
      <div className="absolute right-[27.5%] top-[46%] -translate-y-1/2"><SensorNode label="Node E-B (12.5m)" /></div>

      {/* Traffic Signals */}
      <div className="absolute top-[32%] left-[36%]"><TrafficLight state={trafficSignals?.north || 'RED'} direction="N" /></div>
      <div className="absolute bottom-[32%] right-[36%]"><TrafficLight state={trafficSignals?.south || 'RED'} direction="S" /></div>
      <div className="absolute top-[36%] right-[32%]"><TrafficLight state={trafficSignals?.east || 'GREEN'} direction="E" /></div>
      <div className="absolute bottom-[36%] left-[32%]"><TrafficLight state={trafficSignals?.west || 'RED'} direction="W" /></div>

      {/* Vehicles Overlay */}
      {vehicles && vehicles.map((vehicle) => (
        <Vehicle key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
};

export default Intersection;