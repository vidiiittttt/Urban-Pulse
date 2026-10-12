import React from 'react';

export const SensorNode = ({
  label,
  active = false,
  sensorType = 'PZT / TENG / MAG',
  detection = null,
}) => {
  return (
    <div className="relative flex items-center justify-center group cursor-pointer">
      <div
        className={`relative w-3.5 h-3.5 rounded-sm rotate-45 transition-all duration-200 border ${
          active
            ? 'bg-cyan-400 border-cyan-200 shadow-[0_0_14px_#22d3ee]'
            : 'bg-slate-800 border-slate-600'
        }`}
      >
        {active && (
          <>
            <span className="absolute inset-0 rounded-sm bg-cyan-300 animate-ping opacity-60" />
            <span className="absolute inset-0 rounded-sm bg-cyan-200 opacity-30" />
          </>
        )}
      </div>

      <div
        className={`absolute bottom-5 hidden group-hover:flex flex-col items-center bg-slate-900 text-[10px] font-mono px-2 py-1 rounded border whitespace-nowrap z-30 shadow-xl ${
          active
            ? 'text-cyan-300 border-cyan-500/40'
            : 'text-slate-300 border-slate-700'
        }`}
      >
        <span>{label}</span>

        <span className="text-[8px] text-slate-500">
          {sensorType}
        </span>

        {active && (
          <span className="mt-0.5 text-[8px] text-emerald-400 font-bold">
            ● VEHICLE DETECTED
          </span>
        )}

        {detection && (
          <span className="mt-0.5 text-[8px] text-slate-400">
            {detection}
          </span>
        )}
      </div>
    </div>
  );
};

export default SensorNode;