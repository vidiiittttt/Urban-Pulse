import React from 'react';
import { useSimulation } from './SimulationContext';
import { Intersection } from './Intersection';

const SimulationControls = () => {
  const simulation = useSimulation();

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="mb-3 text-xs font-mono font-bold text-cyan-400">
        SIMULATION CONTROLS
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => simulation?.simulateVehicle?.()}
          className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-mono text-cyan-300 hover:bg-cyan-500/20"
        >
          + VEHICLE
        </button>

        <button
          onClick={() => simulation?.simulateEmergencyVehicle?.()}
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-mono text-red-300 hover:bg-red-500/20"
        >
          🚨 EMERGENCY
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-slate-950 p-2">
          <div className="text-[9px] font-mono text-slate-500">
            VEHICLES
          </div>

          <div className="text-lg font-mono font-bold text-cyan-400">
            {simulation?.vehicleCount ?? 0}
          </div>
        </div>

        <div className="rounded-lg bg-slate-950 p-2">
          <div className="text-[9px] font-mono text-slate-500">
            AVG SPEED
          </div>

          <div className="text-lg font-mono font-bold text-emerald-400">
            {simulation?.averageSpeed ?? 0} km/h
          </div>
        </div>
      </div>
    </div>
  );
};

const EventFeed = () => {
  const { events } = useSimulation();

  const safeEvents = Array.isArray(events) ? events : [];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-mono font-bold text-purple-400">
          LIVE EVENT FEED
        </div>

        <div className="text-[9px] font-mono text-slate-500">
          {safeEvents.length} EVENTS
        </div>
      </div>

      <div className="max-h-52 space-y-2 overflow-y-auto">
        {safeEvents.length === 0 ? (
          <div className="rounded-lg bg-slate-950 p-3 text-[10px] font-mono text-slate-500">
            Waiting for simulation events...
          </div>
        ) : (
          safeEvents.slice(0, 12).map((event, index) => {
            const message =
              typeof event === 'string'
                ? event
                : event?.message ||
                  event?.text ||
                  event?.type ||
                  'Simulation event';

            return (
              <div
                key={event?.id || index}
                className="rounded-lg border border-slate-800 bg-slate-950 p-2"
              >
                <div className="text-[10px] font-mono text-slate-300">
                  {message}
                </div>

                {event?.timestamp && (
                  <div className="mt-1 text-[8px] font-mono text-slate-600">
                    {event.timestamp}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export const UrbanPulseSimulationView = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <div className="text-2xl font-mono font-bold tracking-wide text-cyan-400">
            URBAN PULSE // VIRTUAL TRAFFIC ENGINE
          </div>

          <div className="mt-1 text-xs font-mono text-slate-500">
            SIMULATION MODE — CAMERALESS SMART PAVEMENT
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Intersection />
          </div>

          <div className="flex flex-col gap-4">
            <SimulationControls />
            <EventFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UrbanPulseSimulation() {
  return <UrbanPulseSimulationView />;
}