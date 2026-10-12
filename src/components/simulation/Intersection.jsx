import React from 'react';
import { useSimulation } from './SimulationContext';
import { SensorNode } from './SensorNode';

const TrafficLight = ({ label, state }) => {
  const normalizedState = String(state || 'RED').toUpperCase();

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-[8px] font-mono font-bold text-slate-400">
        {label}
      </div>

      <div className="flex gap-1 rounded-full border border-slate-700 bg-slate-950 p-1">
        <div className={`h-3 w-3 rounded-full ${normalizedState === 'RED' ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 'bg-slate-800'}`} />
        <div className={`h-3 w-3 rounded-full ${normalizedState === 'YELLOW' ? 'bg-yellow-400 shadow-[0_0_15px_#facc15]' : 'bg-slate-800'}`} />
        <div className={`h-3 w-3 rounded-full ${normalizedState === 'GREEN' ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : 'bg-slate-800'}`} />
      </div>

      <div className="text-[8px] font-mono text-cyan-400">
        {normalizedState}
      </div>
    </div>
  );
};

const SimpleVehicle = ({ vehicle }) => {
  const direction = String(vehicle?.direction || '').toUpperCase();

  const position =
    typeof vehicle?.position === 'object' && vehicle.position !== null
      ? vehicle.position
      : null;

  const raw =
    position
      ? direction === 'NORTH' || direction === 'SOUTH'
        ? position.y
        : position.x
      : vehicle?.position;

  const numericPosition = Number.isFinite(Number(raw))
    ? Number(raw)
    : 50;

  let style = {
    position: 'absolute',
    zIndex: 20,
    width: '12px',
    height: '22px',
    borderRadius: '4px',
    background: vehicle?.isEmergency ? '#ef4444' : '#22d3ee',
    boxShadow: vehicle?.isEmergency
      ? '0 0 15px #ef4444'
      : '0 0 10px #22d3ee',
    transition: 'all 100ms linear',
  };

  if (direction === 'NORTH') {
    style.top = `${numericPosition}%`;
    style.left = '46%';
    style.transform = 'translate(-50%, -50%)';
  } else if (direction === 'SOUTH') {
    style.top = `${100 - numericPosition}%`;
    style.left = '54%';
    style.transform = 'translate(-50%, -50%)';
  } else if (direction === 'EAST') {
    style.left = `${100 - numericPosition}%`;
    style.top = '46%';
    style.transform = 'translate(-50%, -50%) rotate(90deg)';
  } else if (direction === 'WEST') {
    style.left = `${numericPosition}%`;
    style.top = '54%';
    style.transform = 'translate(-50%, -50%) rotate(90deg)';
  } else {
    style.left = '50%';
    style.top = '50%';
    style.transform = 'translate(-50%, -50%)';
  }

  return <div style={style} title={`${vehicle?.type || 'Vehicle'} ${vehicle?.speed || 0} km/h`} />;
};

export const Intersection = () => {
  const simulation = useSimulation();

  const trafficSignals = simulation?.trafficSignals || {};

  const sensorNodes = Array.isArray(simulation?.sensorNodes)
    ? simulation.sensorNodes
    : [];

  const vehicles = Array.isArray(simulation?.vehicles)
    ? simulation.vehicles
    : [];

  const getSensor = (id) =>
    sensorNodes.find((sensor) => sensor?.id === id);

  return (
    <div className="relative w-full min-h-[560px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">

      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="absolute left-0 right-0 top-1/2 h-44 -translate-y-1/2 bg-slate-900 border-y border-slate-700">
        <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-yellow-500/30" />
      </div>

      <div className="absolute bottom-0 top-0 left-1/2 w-44 -translate-x-1/2 bg-slate-900 border-x border-slate-700">
        <div className="absolute bottom-0 top-0 left-1/2 border-l border-dashed border-yellow-500/30" />
      </div>

      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 bg-slate-800/80 border border-slate-700" />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-mono font-bold text-cyan-400">
        NORTH
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono font-bold text-cyan-400">
        SOUTH
      </div>

      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-cyan-400">
        WEST
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-cyan-400">
        EAST
      </div>

      <div className="absolute left-1/2 top-24 -translate-x-1/2">
        <TrafficLight label="NORTH" state={trafficSignals?.north} />
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
        <TrafficLight label="SOUTH" state={trafficSignals?.south} />
      </div>

      <div className="absolute left-24 top-1/2 -translate-y-1/2">
        <TrafficLight label="WEST" state={trafficSignals?.west} />
      </div>

      <div className="absolute right-24 top-1/2 -translate-y-1/2">
        <TrafficLight label="EAST" state={trafficSignals?.east} />
      </div>

      <div className="absolute left-1/2 top-[15%] -translate-x-1/2">
        <SensorNode label="N-A" sensorType="PZT / TENG / MAG" active={Boolean(getSensor('N-A')?.active)} />
      </div>

      <div className="absolute left-1/2 top-[27.5%] -translate-x-1/2">
        <SensorNode label="N-B" sensorType="PZT / TENG / MAG" active={Boolean(getSensor('N-B')?.active)} />
      </div>

      <div className="absolute left-1/2 bottom-[15%] -translate-x-1/2">
        <SensorNode label="S-A" sensorType="PZT / TENG / MAG" active={Boolean(getSensor('S-A')?.active)} />
      </div>

      <div className="absolute left-1/2 bottom-[27.5%] -translate-x-1/2">
        <SensorNode label="S-B" sensorType="PZT / TENG / MAG" active={Boolean(getSensor('S-B')?.active)} />
      </div>

      <div className="absolute left-[15%] top-1/2 -translate-y-1/2">
        <SensorNode label="W-A" sensorType="PZT / TENG / MAG" active={Boolean(getSensor('W-A')?.active)} />
      </div>

      <div className="absolute left-[27.5%] top-1/2 -translate-y-1/2">
        <SensorNode label="W-B" sensorType="PZT / TENG / MAG" active={Boolean(getSensor('W-B')?.active)} />
      </div>

      <div className="absolute right-[15%] top-1/2 -translate-y-1/2">
        <SensorNode label="E-A" sensorType="PZT / TENG / MAG" active={Boolean(getSensor('E-A')?.active)} />
      </div>

      <div className="absolute right-[27.5%] top-1/2 -translate-y-1/2">
        <SensorNode label="E-B" sensorType="PZT / TENG / MAG" active={Boolean(getSensor('E-B')?.active)} />
      </div>

      {vehicles.map((vehicle, index) => (
        <SimpleVehicle
          key={vehicle?.id || `vehicle-${index}`}
          vehicle={vehicle}
        />
      ))}

      <div className="absolute bottom-3 left-3 z-30 rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2">
        <div className="text-[9px] font-mono text-slate-500">
          SENSOR NETWORK
        </div>

        <div className="text-xs font-mono font-bold text-emerald-400">
          ● {sensorNodes.length || 8} NODES ONLINE
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-30 rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 text-right">
        <div className="text-[9px] font-mono text-slate-500">
          ACTIVE VEHICLES
        </div>

        <div className="text-lg font-mono font-bold text-cyan-400">
          {vehicles.length}
        </div>
      </div>

      {simulation?.emergencyMode && (
        <div className="absolute left-1/2 top-3 z-40 -translate-x-1/2 rounded-lg border border-red-500/50 bg-red-950/80 px-4 py-2">
          <div className="text-xs font-mono font-bold text-red-400 animate-pulse">
            🚨 EMERGENCY PRIORITY ACTIVE
          </div>
        </div>
      )}
    </div>
  );
};

export default Intersection;