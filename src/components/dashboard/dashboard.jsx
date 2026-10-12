import React from 'react';
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  Car,
  Gauge,
  Radio,
  ShieldAlert,
  Zap,
  Cpu,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Clock3,
  Route,
  Waves,
} from 'lucide-react';
import { useSimulation } from '../simulation/SimulationContext';
import { Intersection } from '../simulation/Intersection';

const Card = ({
  title,
  value,
  unit,
  icon: Icon,
  accent = 'cyan',
  subtitle,
}) => {
  const accents = {
    cyan: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/[0.04]',
    emerald:
      'text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.04]',
    purple:
      'text-purple-400 border-purple-500/20 bg-purple-500/[0.04]',
    yellow:
      'text-yellow-400 border-yellow-500/20 bg-yellow-500/[0.04]',
    red: 'text-red-400 border-red-500/20 bg-red-500/[0.04]',
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-slate-900/70 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-700 ${accents[accent]}`}
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-current opacity-[0.035] blur-2xl" />

      <div className="relative flex items-center justify-between">
        <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-slate-500">
          {title}
        </span>

        <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-2">
          <Icon size={16} />
        </div>
      </div>

      <div className="relative mt-4 flex items-end gap-2">
        <span className="text-3xl font-mono font-bold tracking-tight text-slate-100">
          {value}
        </span>

        {unit && (
          <span className="mb-1 text-[9px] font-mono font-bold tracking-widest text-slate-500">
            {unit}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="relative mt-2 text-[8px] font-mono text-slate-600">
          {subtitle}
        </div>
      )}
    </div>
  );
};

const Section = ({ title, eyebrow, icon: Icon, children, className = '' }) => (
  <section
    className={`overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl shadow-black/10 backdrop-blur-xl ${className}`}
  >
    <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06] p-2 text-cyan-400">
            <Icon size={15} />
          </div>
        )}

        <div>
          {eyebrow && (
            <div className="text-[8px] font-mono font-bold tracking-[0.2em] text-cyan-500/70">
              {eyebrow}
            </div>
          )}

          <h2 className="mt-0.5 text-[11px] font-mono font-bold tracking-[0.18em] text-slate-300">
            {title}
          </h2>
        </div>
      </div>

      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
    </div>

    <div className="p-5">{children}</div>
  </section>
);

const DirectionIcon = ({ direction }) => {
  if (direction === 'NORTH') return <ArrowUp size={14} />;
  if (direction === 'SOUTH') return <ArrowDown size={14} />;
  if (direction === 'EAST') return <ArrowRight size={14} />;
  return <ArrowLeft size={14} />;
};

const SignalState = ({ state }) => {
  const normalized = String(state || 'RED').toUpperCase();

  const config =
    normalized === 'GREEN'
      ? {
          dot: 'bg-emerald-400 shadow-[0_0_14px_#34d399]',
          text: 'text-emerald-400',
        }
      : normalized === 'YELLOW'
        ? {
            dot: 'bg-yellow-400 shadow-[0_0_14px_#facc15]',
            text: 'text-yellow-400',
          }
        : {
            dot: 'bg-red-500 shadow-[0_0_14px_#ef4444]',
            text: 'text-red-400',
          };

  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
      <span className={`text-[10px] font-mono font-bold ${config.text}`}>
        {normalized}
      </span>
    </div>
  );
};

const EventType = ({ type }) => {
  const normalized = String(type || 'INFO').toUpperCase();

  const styles =
    normalized === 'EMERGENCY'
      ? 'border-red-500/30 bg-red-500/10 text-red-400'
      : normalized === 'SUCCESS'
        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
        : normalized === 'SENSOR'
          ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
          : 'border-purple-500/30 bg-purple-500/10 text-purple-400';

  return (
    <span
      className={`rounded-md border px-1.5 py-0.5 text-[7px] font-mono font-bold tracking-wider ${styles}`}
    >
      {normalized}
    </span>
  );
};

export default function Dashboard() {
  const simulation = useSimulation();

  const vehicles = Array.isArray(simulation?.vehicles)
    ? simulation.vehicles
    : [];

  const sensors = Array.isArray(simulation?.sensorNodes)
    ? simulation.sensorNodes
    : [];

  const events = Array.isArray(simulation?.events)
    ? simulation.events
    : [];

  const density = simulation?.density || {};

  const activeSensors = sensors.filter(
    (sensor) => sensor?.active
  ).length;

  const totalDetections = sensors.reduce(
    (total, sensor) =>
      total + Number(sensor?.detectionCount || 0),
    0
  );

  const vehicleDistribution = [
    'Car',
    'Two-wheeler',
    'Bus',
    'Truck',
    'Pedestrian',
  ].map((type) => ({
    type,
    count: vehicles.filter(
      (vehicle) => vehicle?.type === type
    ).length,
  }));

  const directions = [
    {
      key: 'north',
      label: 'NORTH',
      direction: 'NORTH',
    },
    {
      key: 'south',
      label: 'SOUTH',
      direction: 'SOUTH',
    },
    {
      key: 'east',
      label: 'EAST',
      direction: 'EAST',
    },
    {
      key: 'west',
      label: 'WEST',
      direction: 'WEST',
    },
  ];

  const maxDensity = Math.max(
    1,
    ...directions.map(
      ({ key }) => Number(density[key]) || 0
    )
  );

  const congestionClass =
    simulation?.congestion === 'CRITICAL'
      ? 'border-red-500/40 bg-red-500/10 text-red-400'
      : simulation?.congestion === 'HEAVY'
        ? 'border-orange-500/40 bg-orange-500/10 text-orange-400'
        : simulation?.congestion === 'BUSY'
          ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
          : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400';

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020617] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[-15%] h-[420px] w-[420px] rounded-full bg-cyan-500/[0.035] blur-[120px]" />
        <div className="absolute right-[-5%] top-[20%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.025] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
        <header className="mb-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_18px_#22d3ee]" />
                  <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-30" />
                </div>

                <div className="text-[9px] font-mono font-bold tracking-[0.3em] text-cyan-500">
                  INTELLIGENT TRANSPORTATION CONTROL
                </div>
              </div>

              <h1 className="mt-2 text-2xl font-mono font-black tracking-[0.14em] text-slate-100 sm:text-3xl">
                URBAN <span className="text-cyan-400">PULSE</span>
              </h1>

              <p className="mt-1 text-[9px] font-mono tracking-widest text-slate-500">
                SMART PAVEMENT // REAL-TIME TRAFFIC INTELLIGENCE
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                <div>
                  <div className="text-[8px] font-mono font-bold text-emerald-400">
                    SYSTEM ONLINE
                  </div>
                  <div className="text-[7px] font-mono text-slate-600">
                    TELEMETRY NOMINAL
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/[0.05] px-3 py-2">
                <Cpu size={14} className="text-purple-400" />
                <div>
                  <div className="text-[8px] font-mono font-bold text-purple-400">
                    SIMULATION MODE
                  </div>
                  <div className="text-[7px] font-mono text-slate-600">
                    DIGITAL TWIN ACTIVE
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-800/80 px-5 py-3">
            <span className="rounded-md border border-cyan-500/20 bg-cyan-500/[0.04] px-2 py-1 text-[7px] font-mono font-bold tracking-wider text-cyan-400">
              CAMERALESS
            </span>

            <span className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[7px] font-mono font-bold tracking-wider text-slate-500">
              EDGE PROCESSING
            </span>

            <span className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[7px] font-mono font-bold tracking-wider text-slate-500">
              SENSOR FUSION
            </span>

            <span className="ml-auto text-[7px] font-mono tracking-wider text-slate-600">
              ALL VALUES SIMULATED
            </span>
          </div>
        </header>

        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Card
            title="ACTIVE VEHICLES"
            value={simulation?.vehicleCount ?? 0}
            unit="VEH"
            icon={Car}
            accent="cyan"
            subtitle="LIVE INTERSECTION LOAD"
          />

          <Card
            title="AVERAGE SPEED"
            value={simulation?.averageSpeed ?? 0}
            unit="KM/H"
            icon={Gauge}
            accent="emerald"
            subtitle="ACTIVE VEHICLE MEAN"
          />

          <Card
            title="CONGESTION"
            value={simulation?.congestion ?? 'NORMAL'}
            icon={Activity}
            accent={
              simulation?.congestion === 'CRITICAL'
                ? 'red'
                : simulation?.congestion === 'HEAVY'
                  ? 'yellow'
                  : 'cyan'
            }
            subtitle="REAL-TIME CLASSIFICATION"
          />

          <Card
            title="ENERGY TELEMETRY"
            value={Number(
              simulation?.energyGenerated ?? 0
            ).toFixed(1)}
            unit="J"
            icon={Zap}
            accent="yellow"
            subtitle="SIMULATED KINETIC OUTPUT"
          />

          <Card
            title="BATTERY LEVEL"
            value={Number(
              simulation?.batteryLevel ?? 0
            ).toFixed(1)}
            unit="%"
            icon={BatteryCharging}
            accent="purple"
            subtitle="SIMULATED STORAGE STATE"
          />
        </div>

        {simulation?.emergencyMode && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-red-500/50 bg-red-950/30 shadow-[0_0_35px_rgba(239,68,68,0.08)]">
            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-400">
                  <ShieldAlert size={22} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_12px_#ef4444]" />
                    <span className="text-sm font-mono font-black tracking-wider text-red-400">
                      EMERGENCY PRIORITY ACTIVE
                    </span>
                  </div>

                  <div className="mt-1 text-[9px] font-mono text-red-300/60">
                    NORTH / SOUTH CORRIDOR CLEARANCE OVERRIDE
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-center">
                <div className="text-[8px] font-mono text-red-300/50">
                  PRIORITY SIGNAL
                </div>
                <div className="text-xs font-mono font-bold text-red-400">
                  NORTH → GREEN
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <Section
            title="VIRTUAL INTERSECTION"
            eyebrow="LIVE DIGITAL TWIN"
            icon={Route}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/[0.04] px-2 py-1 text-[8px] font-mono text-cyan-400">
                  {vehicles.length} VEHICLES TRACKED
                </span>

                <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] px-2 py-1 text-[8px] font-mono text-emerald-400">
                  {activeSensors}/{sensors.length || 8} SENSOR NODES ACTIVE
                </span>
              </div>

              <span className="text-[8px] font-mono text-slate-600">
                N / S / E / W CORRIDORS
              </span>
            </div>

            <Intersection />
          </Section>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Section
            title="ADAPTIVE TRAFFIC CONTROL"
            eyebrow="SIGNAL INTELLIGENCE"
            icon={Activity}
          >
            <div className="grid grid-cols-2 gap-3">
              {directions.map(
                ({ key, label, direction }) => {
                  const state = String(
                    simulation?.trafficSignals?.[key] || 'RED'
                  ).toUpperCase();

                  const count =
                    Number(density[key]) || 0;

                  return (
                    <div
                      key={key}
                      className="group rounded-xl border border-slate-800 bg-slate-950/80 p-4 transition-all hover:border-slate-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-md border border-slate-800 bg-slate-900 p-1.5 text-cyan-400">
                            <DirectionIcon
                              direction={direction}
                            />
                          </div>

                          <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400">
                            {label}
                          </span>
                        </div>

                        <SignalState state={state} />
                      </div>

                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <div className="text-[8px] font-mono text-slate-600">
                            CORRIDOR LOAD
                          </div>

                          <div className="mt-1 text-xl font-mono font-bold text-slate-200">
                            {count}
                          </div>
                        </div>

                        <div className="h-10 w-1.5 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="w-full rounded-full bg-cyan-400 transition-all duration-500"
                            style={{
                              height: `${Math.min(
                                100,
                                (count / maxDensity) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <Clock3
                  size={13}
                  className="text-cyan-400"
                />
                <span className="text-[8px] font-mono text-slate-500">
                  ADAPTIVE UPDATE INTERVAL
                </span>
              </div>

              <span className="text-[9px] font-mono font-bold text-cyan-400">
                5.0 SEC
              </span>
            </div>
          </Section>

          <Section
            title="CONGESTION MONITOR"
            eyebrow="DIRECTIONAL DENSITY"
            icon={Waves}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[8px] font-mono text-slate-600">
                CURRENT SYSTEM STATE
              </span>

              <span
                className={`rounded-lg border px-3 py-1.5 text-[9px] font-mono font-bold tracking-wider ${congestionClass}`}
              >
                {simulation?.congestion || 'NORMAL'}
              </span>
            </div>

            <div className="space-y-4">
              {directions.map(
                ({ key, label, direction }) => {
                  const count =
                    Number(density[key]) || 0;

                  const width = Math.min(
                    100,
                    Math.max(
                      4,
                      (count / maxDensity) * 100
                    )
                  );

                  return (
                    <div key={key}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DirectionIcon
                            direction={direction}
                          />

                          <span className="text-[9px] font-mono font-bold text-slate-500">
                            {label}
                          </span>
                        </div>

                        <span className="text-[9px] font-mono font-bold text-cyan-400">
                          {count} VEH
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                          style={{
                            width: `${width}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </Section>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Section
            title="SENSOR NETWORK"
            eyebrow="MULTI-MODAL TELEMETRY"
            icon={Radio}
          >
            <div className="mb-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <div className="text-[8px] font-mono text-slate-600">
                  NODES
                </div>
                <div className="mt-1 text-lg font-mono font-bold text-cyan-400">
                  {sensors.length || 8}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <div className="text-[8px] font-mono text-slate-600">
                  ACTIVE
                </div>
                <div className="mt-1 text-lg font-mono font-bold text-emerald-400">
                  {activeSensors}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <div className="text-[8px] font-mono text-slate-600">
                  DETECTIONS
                </div>
                <div className="mt-1 text-lg font-mono font-bold text-purple-400">
                  {totalDetections}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {sensors.map((sensor, index) => (
                <div
                  key={sensor?.id || index}
                  className={`rounded-xl border p-3 transition-all ${
                    sensor?.active
                      ? 'border-cyan-500/40 bg-cyan-500/[0.06] shadow-[0_0_20px_rgba(34,211,238,0.05)]'
                      : 'border-slate-800 bg-slate-950/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {sensor?.id || `NODE-${index + 1}`}
                    </span>

                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        sensor?.active
                          ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                          : 'bg-slate-700'
                      }`}
                    />
                  </div>

                  <div className="mt-2 text-[8px] font-mono text-slate-600">
                    {sensor?.sensorType || 'MULTI-MODAL'}
                  </div>

                  <div
                    className={`mt-2 text-[8px] font-mono font-bold ${
                      sensor?.active
                        ? 'text-emerald-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {sensor?.active
                      ? '● DETECTING'
                      : '○ STANDBY'}
                  </div>

                  <div className="mt-1 text-[7px] font-mono text-slate-700">
                    {Number(
                      sensor?.detectionCount || 0
                    )}{' '}
                    EVENTS
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-cyan-500/10 bg-cyan-500/[0.025] p-3 text-[8px] font-mono leading-relaxed text-slate-600">
              PZT / TENG / MAG responses are simulated telemetry signals for
              prototype demonstration. No physical sensing hardware is
              connected.
            </div>
          </Section>

          <Section
            title="VEHICLE INTELLIGENCE"
            eyebrow="CLASSIFICATION MATRIX"
            icon={Car}
          >
            <div className="space-y-3">
              {vehicleDistribution.map(
                ({ type, count }) => {
                  const percentage =
                    vehicles.length > 0
                      ? Math.round(
                          (count / vehicles.length) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      key={type}
                      className="rounded-xl border border-slate-800 bg-slate-950/80 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-slate-400">
                          {type.toUpperCase()}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-mono text-slate-600">
                            {percentage}%
                          </span>

                          <span className="text-[10px] font-mono font-bold text-cyan-400">
                            {count}
                          </span>
                        </div>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                          style={{
                            width: `${Math.max(
                              count > 0 ? 3 : 0,
                              percentage
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <div className="text-[8px] font-mono text-slate-600">
                  TRACKING ENGINE
                </div>
                <div className="mt-1 text-[10px] font-mono font-bold text-emerald-400">
                  ONLINE
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <div className="text-[8px] font-mono text-slate-600">
                  CAMERA DEPENDENCY
                </div>
                <div className="mt-1 text-[10px] font-mono font-bold text-cyan-400">
                  NONE
                </div>
              </div>
            </div>
          </Section>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Section
            title="SPEED ESTIMATION"
            eyebrow="CROSS-NODE TOF"
            icon={Gauge}
          >
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[8px] font-mono text-slate-600">
                    SENSOR A
                  </div>
                  <div className="mt-1 text-sm font-mono font-bold text-cyan-400">
                    DETECT
                  </div>
                </div>

                <div className="h-px flex-1 mx-4 bg-gradient-to-r from-cyan-500/50 to-purple-500/50" />

                <div className="text-right">
                  <div className="text-[8px] font-mono text-slate-600">
                    SENSOR B
                  </div>
                  <div className="mt-1 text-sm font-mono font-bold text-purple-400">
                    DETECT
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-900 p-3">
                  <div className="text-[8px] font-mono text-slate-600">
                    NODE DISTANCE
                  </div>
                  <div className="mt-1 text-lg font-mono font-bold text-slate-200">
                    12.5 m
                  </div>
                </div>

                <div className="rounded-lg bg-slate-900 p-3">
                  <div className="text-[8px] font-mono text-slate-600">
                    LAST ESTIMATE
                  </div>
                  <div className="mt-1 text-lg font-mono font-bold text-emerald-400">
                    {simulation?.latestSpeedEvent
                      ? simulation.latestSpeedEvent.message
                          .replace(
                            'ToF Speed Estimation: ',
                            ''
                          )
                      : '--'}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section
            title="ENERGY TELEMETRY"
            eyebrow="KINETIC OUTPUT"
            icon={Zap}
          >
            <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/[0.025] p-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[8px] font-mono text-slate-600">
                    SIMULATED ENERGY GENERATED
                  </div>

                  <div className="mt-2 text-3xl font-mono font-bold text-yellow-400">
                    {Number(
                      simulation?.energyGenerated || 0
                    ).toFixed(1)}
                    <span className="ml-1 text-sm text-yellow-500/60">
                      J
                    </span>
                  </div>
                </div>

                <Zap
                  size={28}
                  className="text-yellow-400 opacity-70"
                />
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      100,
                      Number(
                        simulation?.energyGenerated || 0
                      ) / 30
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-2 text-[8px] font-mono text-slate-600">
                PZT + TENG RESPONSE MODEL
              </div>
            </div>
          </Section>

          <Section
            title="BATTERY TELEMETRY"
            eyebrow="SIMULATED STORAGE"
            icon={BatteryCharging}
          >
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[8px] font-mono text-slate-600">
                    STORAGE LEVEL
                  </div>

                  <div className="mt-2 text-3xl font-mono font-bold text-purple-400">
                    {Number(
                      simulation?.batteryLevel || 0
                    ).toFixed(1)}
                    <span className="ml-1 text-sm text-purple-500/60">
                      %
                    </span>
                  </div>
                </div>

                <BatteryCharging
                  size={28}
                  className="text-purple-400"
                />
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-purple-400 transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      100,
                      Number(
                        simulation?.batteryLevel || 0
                      )
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-2 text-[8px] font-mono text-slate-600">
                SIMULATED POWER MANAGEMENT STATE
              </div>
            </div>
          </Section>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Section
            title="LIVE EVENT FEED"
            eyebrow="EDGE PROCESSING EVENTS"
            icon={Activity}
          >
            <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
              {events.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-center text-[9px] font-mono text-slate-600">
                  WAITING FOR SIMULATION EVENTS...
                </div>
              ) : (
                events.slice(0, 14).map((event, index) => {
                  const message =
                    typeof event === 'string'
                      ? event
                      : event?.message ||
                        event?.text ||
                        'Simulation event';

                  return (
                    <div
                      key={event?.id || index}
                      className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 transition-colors hover:border-slate-700"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />

                          <div className="min-w-0">
                            <div className="text-[9px] font-mono leading-relaxed text-slate-300">
                              {message}
                            </div>

                            {event?.timestamp && (
                              <div className="mt-1 flex items-center gap-1 text-[7px] font-mono text-slate-700">
                                <Clock3 size={9} />
                                {event.timestamp}
                              </div>
                            )}
                          </div>
                        </div>

                        <EventType type={event?.type} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Section>

          <Section
            title="SYSTEM ARCHITECTURE"
            eyebrow="URBAN PULSE DATA PIPELINE"
            icon={Cpu}
          >
            <div className="space-y-2">
              {[
                {
                  number: '01',
                  title: 'SMART PAVEMENT',
                  detail: 'Kinetic interaction layer',
                },
                {
                  number: '02',
                  title: 'SIMULATED SENSORS',
                  detail: 'PZT / TENG / MAG telemetry',
                },
                {
                  number: '03',
                  title: 'EDGE PROCESSING',
                  detail: 'Detection + classification + ToF',
                },
                {
                  number: '04',
                  title: 'TRAFFIC INTELLIGENCE',
                  detail: 'Density + congestion analysis',
                },
                {
                  number: '05',
                  title: 'ADAPTIVE SIGNAL',
                  detail: 'Demand-responsive control',
                },
                {
                  number: '06',
                  title: 'CLOUD DASHBOARD',
                  detail: 'Live command-center telemetry',
                },
              ].map((stage, index) => (
                <div
                  key={stage.number}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/[0.04] text-[8px] font-mono font-bold text-cyan-400">
                    {stage.number}
                  </div>

                  <div className="min-w-0 flex-1 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
                    <div className="text-[9px] font-mono font-bold tracking-wider text-slate-300">
                      {stage.title}
                    </div>

                    <div className="mt-0.5 text-[7px] font-mono text-slate-600">
                      {stage.detail}
                    </div>
                  </div>

                  {index < 5 && (
                    <div className="hidden text-cyan-500/40 sm:block">
                      ↓
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.025] p-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="text-[8px] font-mono text-slate-500">
                PIPELINE STATUS:
              </span>
              <span className="text-[8px] font-mono font-bold text-emerald-400">
                OPERATIONAL
              </span>
            </div>
          </Section>
        </div>

        <footer className="border-t border-slate-800/80 pt-5">
          <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="text-[8px] font-mono tracking-wider text-slate-700">
              URBAN PULSE // SMART PAVEMENT TRAFFIC INTELLIGENCE PLATFORM
            </div>

            <div className="flex items-center justify-center gap-2 text-[8px] font-mono text-slate-700">
              <AlertTriangle size={10} />
              ALL TELEMETRY SIMULATED FOR PROTOTYPE DEMONSTRATION
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}