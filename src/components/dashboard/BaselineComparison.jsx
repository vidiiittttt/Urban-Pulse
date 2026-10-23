
import React, { useMemo, useState } from 'react';
import {
  Activity,
  GitCompareArrows,
  RotateCcw,
  ShieldAlert,
  BarChart3,
} from 'lucide-react';

const DIRECTIONS = ['north', 'south', 'east', 'west'];
const HORIZON = 180;
const EMERGENCY_ARRIVAL = 60;

const SCENARIOS = {
  NORMAL: {
    label: 'Normal traffic',
    intervals: { north: 9, south: 12, east: 11, west: 14 },
  },
  HEAVY: {
    label: 'Heavy congestion',
    intervals: { north: 4, south: 5, east: 4, west: 6 },
  },
  EMERGENCY: {
    label: 'Emergency movement',
    intervals: { north: 5, south: 7, east: 5, west: 7 },
  },
};

const CHART_METRICS = {
  averageQueue: {
    label: 'Average queue',
    unit: 'veh',
    lowerIsBetter: true,
  },
  averageWait: {
    label: 'Mean waiting time',
    unit: 's',
    lowerIsBetter: true,
  },
  maximumQueue: {
    label: 'Maximum queue',
    unit: 'veh',
    lowerIsBetter: true,
  },
  throughput: {
    label: 'Vehicles served',
    unit: 'veh',
    lowerIsBetter: false,
  },
};

function arrivesAt(second, interval, offset) {
  return second > 0 && (second + offset) % interval === 0;
}

function runScenario(scenarioKey, adaptive) {
  const scenario = SCENARIOS[scenarioKey];

  const queues = {
    north: [],
    south: [],
    east: [],
    west: [],
  };

  let totalWait = 0;
  let totalServed = 0;
  let totalQueueOccupancy = 0;
  let maximumQueue = 0;
  let emergencyArrival = null;
  let emergencyServedAt = null;
  let adaptiveGreen = 'NS';

  for (let second = 0; second < HORIZON; second += 1) {
    DIRECTIONS.forEach((direction, index) => {
      if (arrivesAt(second, scenario.intervals[direction], index * 2)) {
        queues[direction].push({
          arrivalTime: second,
          emergency: false,
        });
      }
    });

    if (scenarioKey === 'EMERGENCY' && second === EMERGENCY_ARRIVAL) {
      emergencyArrival = second;
      queues.north.push({
        arrivalTime: second,
        emergency: true,
      });
    }

    const nsQueue = queues.north.length + queues.south.length;
    const ewQueue = queues.east.length + queues.west.length;

    if (adaptive && second % 10 === 0) {
      if (nsQueue > ewQueue) {
        adaptiveGreen = 'NS';
      } else if (ewQueue > nsQueue) {
        adaptiveGreen = 'EW';
      }
    }

    const emergencyPending =
      scenarioKey === 'EMERGENCY' &&
      queues.north.some((vehicle) => vehicle.emergency);

    const green = adaptive
      ? emergencyPending
        ? 'NS'
        : adaptiveGreen
      : second % 60 < 30
        ? 'NS'
        : 'EW';

    const greenDirections =
      green === 'NS'
        ? ['north', 'south']
        : ['east', 'west'];

    greenDirections.forEach((direction) => {
      const queue = queues[direction];

      if (queue.length === 0) return;

      let vehicleIndex = 0;

      if (
        adaptive &&
        direction === 'north' &&
        scenarioKey === 'EMERGENCY'
      ) {
        const emergencyIndex = queue.findIndex(
          (vehicle) => vehicle.emergency
        );

        if (emergencyIndex !== -1) {
          vehicleIndex = emergencyIndex;
        }
      }

      const [vehicle] = queue.splice(vehicleIndex, 1);

      totalWait += second - vehicle.arrivalTime;
      totalServed += 1;

      if (vehicle.emergency) {
        emergencyServedAt = second;
      }
    });

    const queueTotal = DIRECTIONS.reduce(
      (sum, direction) => sum + queues[direction].length,
      0
    );

    totalQueueOccupancy += queueTotal;
    maximumQueue = Math.max(maximumQueue, queueTotal);
  }

  return {
    averageWait: totalServed > 0 ? totalWait / totalServed : 0,
    averageQueue: totalQueueOccupancy / HORIZON,
    maximumQueue,
    throughput: totalServed,
    emergencyDelay:
      emergencyArrival === null
        ? null
        : emergencyServedAt === null
          ? HORIZON - emergencyArrival
          : emergencyServedAt - emergencyArrival,
  };
}

function improvement(baseline, adaptive, lowerIsBetter = true) {
  if (baseline === 0) return null;

  return lowerIsBetter
    ? ((baseline - adaptive) / baseline) * 100
    : ((adaptive - baseline) / baseline) * 100;
}

function Metric({
  label,
  baseline,
  adaptive,
  unit = '',
  lowerIsBetter = true,
}) {
  const delta = improvement(baseline, adaptive, lowerIsBetter);
  const positive = delta !== null && delta >= 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="text-[9px] font-mono tracking-wider text-slate-500">
        {label}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <div className="text-[8px] font-mono text-slate-600">
            FIXED-TIME
          </div>
          <div className="mt-1 text-lg font-mono font-bold text-slate-300">
            {baseline.toFixed(1)}{unit}
          </div>
        </div>

        <div>
          <div className="text-[8px] font-mono text-slate-600">
            ADAPTIVE
          </div>
          <div className="mt-1 text-lg font-mono font-bold text-cyan-400">
            {adaptive.toFixed(1)}{unit}
          </div>
        </div>
      </div>

      {delta !== null && (
        <div
          className={`mt-3 text-[9px] font-mono font-bold ${
            positive ? 'text-emerald-400' : 'text-amber-400'
          }`}
        >
          {delta >= 0 ? '↓' : '↑'} {Math.abs(delta).toFixed(1)}%{' '}
          {delta >= 0 ? 'improvement' : 'regression'}
        </div>
      )}
    </div>
  );
}

function PerformanceChart({ results }) {
  const [metricKey, setMetricKey] = useState('averageQueue');
  const metric = CHART_METRICS[metricKey];

  const maxValue = Math.max(
    1,
    ...results.flatMap((item) => [
      item.fixed[metricKey],
      item.adaptive[metricKey],
    ])
  );

  return (
    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={15} className="text-cyan-400" />
          <div>
            <div className="text-[10px] font-mono font-bold tracking-wider text-slate-300">
              SCENARIO PERFORMANCE OVERVIEW
            </div>
            <div className="mt-1 text-[8px] font-mono text-slate-600">
              Compare control policies across three scenarios
            </div>
          </div>
        </div>

        <select
          value={metricKey}
          onChange={(event) => setMetricKey(event.target.value)}
          aria-label="Select chart metric"
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[10px] text-slate-200 outline-none focus:border-cyan-500"
        >
          {Object.entries(CHART_METRICS).map(([key, item]) => (
            <option key={key} value={key}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-[8px] font-mono">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="h-2 w-2 rounded-sm bg-slate-500" />
          FIXED-TIME
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400">
          <span className="h-2 w-2 rounded-sm bg-cyan-400" />
          ADAPTIVE
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {results.map((item) => {
          const fixedValue = item.fixed[metricKey];
          const adaptiveValue = item.adaptive[metricKey];
          const delta = improvement(
            fixedValue,
            adaptiveValue,
            metric.lowerIsBetter
          );

          return (
            <div key={item.key}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[9px] font-mono text-slate-300">
                  {item.label}
                </span>
                <span className="text-[8px] font-mono text-slate-500">
                  {fixedValue.toFixed(1)} vs {adaptiveValue.toFixed(1)}{' '}
                  {metric.unit}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 shrink-0 text-[8px] font-mono text-slate-600">
                    FIX
                  </span>
                  <div
                    className="h-3 flex-1 overflow-hidden rounded-sm bg-slate-800"
                    role="img"
                    aria-label={`Fixed-time ${metric.label}: ${fixedValue.toFixed(1)} ${metric.unit}`}
                  >
                    <div
                      className="h-full rounded-sm bg-slate-500 transition-all duration-300"
                      style={{
                        width: `${(fixedValue / maxValue) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-7 shrink-0 text-[8px] font-mono text-cyan-500">
                    ADP
                  </span>
                  <div
                    className="h-3 flex-1 overflow-hidden rounded-sm bg-slate-800"
                    role="img"
                    aria-label={`Adaptive ${metric.label}: ${adaptiveValue.toFixed(1)} ${metric.unit}`}
                  >
                    <div
                      className="h-full rounded-sm bg-cyan-400 transition-all duration-300"
                      style={{
                        width: `${(adaptiveValue / maxValue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`mt-2 text-right text-[8px] font-mono ${
                  delta !== null && delta >= 0
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {delta === null
                  ? 'Percentage change unavailable'
                  : `${Math.abs(delta).toFixed(1)}% ${
                      delta >= 0 ? 'improvement' : 'regression'
                    }`}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 border-t border-slate-800 pt-3 text-[8px] font-mono leading-relaxed text-slate-600">
        All results come from the same deterministic, simulated arrival
        patterns. They are not live traffic measurements or real-world
        performance guarantees.
      </p>
    </div>
  );
}

export default function BaselineComparison() {
  const [scenario, setScenario] = useState('HEAVY');
  const [runId, setRunId] = useState(0);

  const results = useMemo(
    () => ({
      fixed: runScenario(scenario, false),
      adaptive: runScenario(scenario, true),
    }),
    [scenario, runId]
  );

  const { fixed, adaptive } = results;

  const allScenarioResults = useMemo(
    () =>
      Object.entries(SCENARIOS).map(([key, item]) => ({
        key,
        label: item.label,
        fixed: runScenario(key, false),
        adaptive: runScenario(key, true),
      })),
    [runId]
  );

  const recommendation =
    scenario === 'EMERGENCY'
      ? 'Adaptive control gives the northbound emergency vehicle priority, while fixed-time control follows its regular signal schedule.'
      : adaptive.averageQueue < fixed.averageQueue
        ? 'Adaptive control produces a lower average queue in this simulated scenario by adjusting green time to traffic demand.'
        : adaptive.averageQueue > fixed.averageQueue
          ? 'Adaptive control produces a higher average queue in this scenario. Review the signal policy and test additional traffic patterns.'
          : 'Both approaches produce the same average queue in this scenario. Test additional traffic patterns to compare their performance.';

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06] p-2 text-cyan-400">
            <GitCompareArrows size={17} />
          </div>

          <div>
            <div className="text-[8px] font-mono tracking-[0.2em] text-cyan-500/70">
              SC-01 · TRAFFIC THAT THINKS
            </div>
            <h2 className="mt-1 text-[11px] font-mono font-bold tracking-[0.15em] text-slate-300">
              FIXED-TIME VS ADAPTIVE CONTROL
            </h2>
          </div>
        </div>

        <button
          onClick={() => setRunId((value) => value + 1)}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[9px] font-mono text-slate-300 hover:border-cyan-500/40"
        >
          <RotateCcw size={12} />
          RE-RUN SAME SCENARIO
        </button>
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[9px] font-mono text-slate-500">
              REPEATABLE TEST SCENARIO
            </div>
            <div className="mt-1 text-[8px] font-mono text-slate-600">
              Same deterministic arrivals · {HORIZON}s simulated duration
            </div>
          </div>

          <select
            value={scenario}
            onChange={(event) => setScenario(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
          >
            {Object.entries(SCENARIOS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="AVERAGE QUEUE"
            baseline={fixed.averageQueue}
            adaptive={adaptive.averageQueue}
            unit=" veh"
          />

          <Metric
            label="MEAN WAITING TIME"
            baseline={fixed.averageWait}
            adaptive={adaptive.averageWait}
            unit=" s"
          />

          <Metric
            label="MAXIMUM QUEUE"
            baseline={fixed.maximumQueue}
            adaptive={adaptive.maximumQueue}
            unit=" veh"
          />

          <Metric
            label="VEHICLES SERVED"
            baseline={fixed.throughput}
            adaptive={adaptive.throughput}
            lowerIsBetter={false}
          />
        </div>

        <PerformanceChart results={allScenarioResults} />

        {scenario === 'EMERGENCY' && (
          <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4">
            <div className="flex items-center gap-2 text-red-400">
              <ShieldAlert size={15} />
              <span className="text-[9px] font-mono font-bold tracking-wider">
                EMERGENCY RESPONSE COMPARISON
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="text-[8px] font-mono text-slate-500">
                  FIXED-TIME DELAY
                </div>
                <div className="mt-1 text-xl font-mono font-bold text-slate-300">
                  {fixed.emergencyDelay ?? '—'} s
                </div>
              </div>

              <div>
                <div className="text-[8px] font-mono text-slate-500">
                  ADAPTIVE DELAY
                </div>
                <div className="mt-1 text-xl font-mono font-bold text-cyan-400">
                  {adaptive.emergencyDelay ?? '—'} s
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-cyan-500/15 bg-cyan-500/[0.03] p-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Activity size={14} />
            <span className="text-[9px] font-mono font-bold tracking-wider">
              DECISION EXPLANATION
            </span>
          </div>

          <p className="mt-2 text-[11px] leading-relaxed text-slate-300">
            {recommendation}
          </p>

          <p className="mt-2 text-[8px] font-mono leading-relaxed text-slate-600">
            All values are generated by an isolated deterministic simulation,
            not measured from a live intersection. Mean waiting time is
            calculated for vehicles served within the 180-second test. The
            model uses simplified signal phases and does not simulate yellow
            lights, all-red clearance, pedestrian crossings, or real-world
            traffic conditions.
          </p>
        </div>
      </div>
    </section>
  );
}
