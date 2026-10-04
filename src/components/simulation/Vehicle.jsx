import React from 'react';

const TYPE_COLORS = {
  Pedestrian: 'bg-pink-400 border-pink-200',
  Bicycle: 'bg-teal-400 border-teal-200',
  'Two-wheeler': 'bg-amber-400 border-amber-200',
  Car: 'bg-cyan-400 border-cyan-200',
  'Commercial vehicle': 'bg-indigo-400 border-indigo-200',
  Bus: 'bg-purple-400 border-purple-200',
  Truck: 'bg-orange-500 border-orange-200',
  Emergency: 'bg-red-600 border-white shadow-[0_0_14px_#ef4444] animate-pulse'
};

export const Vehicle = ({ vehicle }) => {
  const { type, direction, position, speed, emergency } = vehicle;

  // Transform lane traversal percentage into absolute top/left coordinates
  const getCoordinates = () => {
    switch (direction) {
      case 'north':
        return { top: `${position}%`, left: '46%', transform: 'translate(-50%, -50%) rotate(180deg)' };
      case 'south':
        return { top: `${100 - position}%`, left: '54%', transform: 'translate(-50%, -50%) rotate(0deg)' };
      case 'east':
        return { left: `${100 - position}%`, top: '46%', transform: 'translate(-50%, -50%) rotate(270deg)' };
      case 'west':
        return { left: `${position}%`, top: '54%', transform: 'translate(-50%, -50%) rotate(90deg)' };
      default:
        return { top: '50%', left: '50%' };
    }
  };

  return (
    <div 
      className={`absolute transition-all duration-100 ease-linear flex flex-col items-center z-20`}
      style={getCoordinates()}
    >
      <div className={`px-1.5 py-0.5 text-[8px] font-mono font-bold rounded border ${TYPE_COLORS[type] || 'bg-cyan-400'} text-slate-950 whitespace-nowrap shadow-md`}>
        {emergency ? '🚨 PRIORITY' : `${type} (${speed} km/h)`}
      </div>
    </div>
  );
};