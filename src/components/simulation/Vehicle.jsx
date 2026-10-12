import React from 'react';

const TYPE_STYLES = {
  Pedestrian: {
    background: '#ec4899',
    border: '#f9a8d4',
  },
  Bicycle: {
    background: '#14b8a6',
    border: '#99f6e4',
  },
  'Two-wheeler': {
    background: '#f59e0b',
    border: '#fde68a',
  },
  Car: {
    background: '#06b6d4',
    border: '#a5f3fc',
  },
  'Commercial vehicle': {
    background: '#6366f1',
    border: '#c7d2fe',
  },
  Commercial: {
    background: '#6366f1',
    border: '#c7d2fe',
  },
  Bus: {
    background: '#a855f7',
    border: '#e9d5ff',
  },
  Truck: {
    background: '#f97316',
    border: '#fed7aa',
  },
};

export const Vehicle = ({ vehicle }) => {
  if (!vehicle) {
    return null;
  }

  const direction = String(vehicle.direction || '').toUpperCase();

  const position =
    typeof vehicle.position === 'object' &&
    vehicle.position !== null
      ? vehicle.position
      : null;

  const rawPosition = position
    ? direction === 'NORTH' || direction === 'SOUTH'
      ? position.y
      : position.x
    : vehicle.position;

  const numericPosition = Number.isFinite(Number(rawPosition))
    ? Number(rawPosition)
    : 50;

  const type = vehicle.type || 'Car';

  const style =
    TYPE_STYLES[type] || {
      background: '#22d3ee',
      border: '#a5f3fc',
    };

  const isEmergency = Boolean(vehicle.isEmergency);

  const coordinates = {
    position: 'absolute',
    zIndex: 25,
    width: '18px',
    height: '28px',
    borderRadius: '5px',
    background: isEmergency ? '#ef4444' : style.background,
    border: `2px solid ${
      isEmergency ? '#ffffff' : style.border
    }`,
    boxShadow: isEmergency
      ? '0 0 18px #ef4444'
      : `0 0 10px ${style.background}`,
    transition: 'top 100ms linear, left 100ms linear',
    pointerEvents: 'none',
  };

  if (direction === 'NORTH') {
    coordinates.top = `${numericPosition}%`;
    coordinates.left = '46%';
    coordinates.transform =
      'translate(-50%, -50%) rotate(180deg)';
  } else if (direction === 'SOUTH') {
    coordinates.top = `${100 - numericPosition}%`;
    coordinates.left = '54%';
    coordinates.transform =
      'translate(-50%, -50%)';
  } else if (direction === 'EAST') {
    coordinates.left = `${100 - numericPosition}%`;
    coordinates.top = '46%';
    coordinates.transform =
      'translate(-50%, -50%) rotate(90deg)';
  } else if (direction === 'WEST') {
    coordinates.left = `${numericPosition}%`;
    coordinates.top = '54%';
    coordinates.transform =
      'translate(-50%, -50%) rotate(-90deg)';
  } else {
    coordinates.left = '50%';
    coordinates.top = '50%';
    coordinates.transform =
      'translate(-50%, -50%)';
  }

  return (
    <div style={coordinates}>
      {isEmergency && (
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            color: '#fca5a5',
            fontSize: '8px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}
        >
          🚨 PRIORITY
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: '#ffffff',
          opacity: 0.9,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '-14px',
          transform: 'translateX(-50%) rotate(0deg)',
          whiteSpace: 'nowrap',
          padding: '2px 4px',
          borderRadius: '3px',
          background: '#020617',
          border: '1px solid #334155',
          color: '#cbd5e1',
          fontSize: '7px',
          fontFamily: 'monospace',
        }}
      >
        {vehicle.speed || 0} km/h
      </div>
    </div>
  );
};

export default Vehicle;