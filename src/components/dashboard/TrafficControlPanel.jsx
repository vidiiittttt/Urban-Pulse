// src/components/dashboard/TrafficControlPanel.jsx

import React from 'react';
import { useSimulation } from '../simulation/SimulationContext';

const signalColors = {
  RED: {
    background: '#450a0a',
    border: '#7f1d1d',
    text: '#f87171',
  },
  YELLOW: {
    background: '#451a03',
    border: '#92400e',
    text: '#fbbf24',
  },
  GREEN: {
    background: '#052e16',
    border: '#166534',
    text: '#4ade80',
  },
};

export default function TrafficControlPanel() {
  const {
    trafficSignals,
    emergencyMode,
    simulateVehicle,
    simulateEmergencyVehicle,
    congestion,
    energyGenerated,
    batteryLevel,
  } = useSimulation();

  const directions = [
    ['NORTH', trafficSignals.north],
    ['SOUTH', trafficSignals.south],
    ['EAST', trafficSignals.east],
    ['WEST', trafficSignals.west],
  ];

  const vehicleTypes = [
    'Car',
    'Two-wheeler',
    'Bus',
    'Truck',
    'Pedestrian',
  ];

  const getCongestionColor = () => {
    if (congestion === 'CRITICAL') return '#f87171';
    if (congestion === 'HEAVY') return '#fb923c';
    if (congestion === 'BUSY') return '#fbbf24';
    return '#4ade80';
  };

  return (
    <section
      style={{
        background: '#0b1120',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '18px',
        }}
      >
        <div>
          <div
            style={{
              color: '#64748b',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '1.5px',
            }}
          >
            ADAPTIVE TRAFFIC CONTROL
          </div>

          <h2
            style={{
              margin: '6px 0 0',
              fontSize: '18px',
              color: '#f8fafc',
            }}
          >
            Signal Status
          </h2>
        </div>

        <div
          style={{
            padding: '6px 9px',
            borderRadius: '7px',
            border: `1px solid ${getCongestionColor()}`,
            color: getCongestionColor(),
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '0.7px',
          }}
        >
          {congestion}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '10px',
        }}
      >
        {directions.map(([direction, state]) => {
          const colors = signalColors[state] || signalColors.RED;

          return (
            <div
              key={direction}
              style={{
                padding: '14px',
                borderRadius: '12px',
                border: `1px solid ${colors.border}`,
                background: colors.background,
              }}
            >
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                }}
              >
                {direction}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  marginTop: '9px',
                }}
              >
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    flexShrink: 0,
                    borderRadius: '50%',
                    background: colors.text,
                    boxShadow: `0 0 10px ${colors.text}`,
                  }}
                />

                <span
                  style={{
                    color: colors.text,
                    fontSize: '13px',
                    fontWeight: 800,
                  }}
                >
                  {state}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          height: '1px',
          background: '#1e293b',
          margin: '18px 0',
        }}
      />

      <div
        style={{
          color: '#64748b',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '1.3px',
          marginBottom: '10px',
        }}
      >
        SIMULATION INPUT
      </div>

      <button
        type="button"
        onClick={() => simulateVehicle()}
        style={{
          width: '100%',
          padding: '11px 12px',
          borderRadius: '9px',
          border: '1px solid #155e75',
          background: '#083344',
          color: '#67e8f9',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: 800,
          marginBottom: '9px',
        }}
      >
        + SPAWN RANDOM VEHICLE
      </button>

      <button
        type="button"
        onClick={simulateEmergencyVehicle}
        disabled={emergencyMode}
        style={{
          width: '100%',
          padding: '11px 12px',
          borderRadius: '9px',
          border: `1px solid ${emergencyMode ? '#7f1d1d' : '#dc2626'}`,
          background: emergencyMode ? '#450a0a' : '#7f1d1d',
          color: '#fecaca',
          cursor: emergencyMode ? 'not-allowed' : 'pointer',
          fontSize: '11px',
          fontWeight: 800,
          opacity: emergencyMode ? 0.7 : 1,
          marginBottom: '12px',
        }}
      >
        {emergencyMode
          ? '🚨 EMERGENCY PRIORITY ACTIVE'
          : '🚨 SIMULATE EMERGENCY VEHICLE'}
      </button>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        {vehicleTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => simulateVehicle(type)}
            style={{
              flex: '1 1 calc(50% - 6px)',
              minWidth: '90px',
              padding: '7px 6px',
              borderRadius: '7px',
              border: '1px solid #334155',
              background: '#111827',
              color: '#cbd5e1',
              cursor: 'pointer',
              fontSize: '9px',
              fontWeight: 700,
            }}
          >
            + {type}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '9px',
          marginTop: '14px',
        }}
      >
        <div
          style={{
            padding: '11px',
            borderRadius: '9px',
            border: '1px solid #1e293b',
            background: '#111827',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '8px',
              fontWeight: 700,
              letterSpacing: '0.8px',
            }}
          >
            ENERGY TELEMETRY
          </div>

          <div
            style={{
              color: '#fbbf24',
              fontSize: '16px',
              fontWeight: 800,
              marginTop: '6px',
            }}
          >
            {energyGenerated} J
          </div>

          <div
            style={{
              color: '#475569',
              fontSize: '8px',
              marginTop: '3px',
            }}
          >
            SIMULATED
          </div>
        </div>

        <div
          style={{
            padding: '11px',
            borderRadius: '9px',
            border: '1px solid #1e293b',
            background: '#111827',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '8px',
              fontWeight: 700,
              letterSpacing: '0.8px',
            }}
          >
            BATTERY LEVEL
          </div>

          <div
            style={{
              color: '#4ade80',
              fontSize: '16px',
              fontWeight: 800,
              marginTop: '6px',
            }}
          >
            {batteryLevel}%
          </div>

          <div
            style={{
              marginTop: '7px',
              height: '4px',
              borderRadius: '999px',
              background: '#1e293b',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.max(0, Math.min(100, batteryLevel))}%`,
                height: '100%',
                background: '#4ade80',
                borderRadius: '999px',
                transition: 'width 300ms ease',
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '14px',
          padding: '10px 12px',
          borderRadius: '9px',
          background: emergencyMode ? '#450a0a' : '#111827',
          border: `1px solid ${
            emergencyMode ? '#7f1d1d' : '#1e293b'
          }`,
          color: emergencyMode ? '#f87171' : '#64748b',
          fontSize: '9px',
          fontWeight: 700,
          textAlign: 'center',
          letterSpacing: '0.5px',
        }}
      >
        {emergencyMode
          ? 'EMERGENCY CORRIDOR CLEARANCE ACTIVE'
          : 'ADAPTIVE SIGNAL CONTROL ACTIVE'}
      </div>
    </section>
  );
}