import React from 'react';
import { useSimulation } from '../simulation/SimulationContext';

const VEHICLE_TYPES = [
  'Car',
  'Two-wheeler',
  'Bus',
  'Truck',
  'Pedestrian',
];

export default function VehicleIntelligence() {
  const { vehicles, vehicleCount, averageSpeed } = useSimulation();

  const counts = VEHICLE_TYPES.reduce((result, type) => {
    result[type] = vehicles.filter((vehicle) => vehicle.type === type).length;
    return result;
  }, {});

  const latestVehicle = vehicles.length > 0 ? vehicles[vehicles.length - 1] : null;

  const speed = latestVehicle?.speed ?? averageSpeed;

  return (
    <section
      style={{
        marginTop: '18px',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        background: '#0b1120',
      }}
    >
      <div
        style={{
          color: '#64748b',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '1.5px',
        }}
      >
        VEHICLE INTELLIGENCE
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '20px',
          marginBottom: '18px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2
            style={{
              margin: '6px 0 0',
              fontSize: '18px',
            }}
          >
            Classification & Speed Estimation
          </h2>

          <p
            style={{
              margin: '6px 0 0',
              color: '#64748b',
              fontSize: '11px',
            }}
          >
            Simulated edge classification and multi-node speed estimation
          </p>
        </div>

        <div
          style={{
            padding: '7px 10px',
            borderRadius: '8px',
            border: '1px solid #164e63',
            background: '#082f49',
            color: '#67e8f9',
            fontSize: '9px',
            fontWeight: 800,
          }}
        >
          SIMULATED ANALYTICS
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)',
          gap: '14px',
        }}
      >
        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: '#111827',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '1px',
              marginBottom: '12px',
            }}
          >
            VEHICLE CLASS DISTRIBUTION
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '9px',
            }}
          >
            {VEHICLE_TYPES.map((type) => {
              const count = counts[type];
              const percentage =
                vehicleCount > 0 ? (count / vehicleCount) * 100 : 0;

              return (
                <div
                  key={type}
                  style={{
                    padding: '11px',
                    borderRadius: '9px',
                    background: '#0b1120',
                    border: '1px solid #1e293b',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        color: '#94a3b8',
                        fontSize: '9px',
                        fontWeight: 700,
                      }}
                    >
                      {type}
                    </span>

                    <span
                      style={{
                        color: '#22d3ee',
                        fontSize: '12px',
                        fontWeight: 800,
                      }}
                    >
                      {count}
                    </span>
                  </div>

                  <div
                    style={{
                      height: '4px',
                      marginTop: '9px',
                      borderRadius: '999px',
                      background: '#1e293b',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        borderRadius: '999px',
                        background: '#22d3ee',
                        transition: 'width 300ms ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: '#111827',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '1px',
              marginBottom: '14px',
            }}
          >
            SPEED ESTIMATION
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '15px',
            }}
          >
            <div
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '8px',
                background: '#0b1120',
                border: '1px solid #164e63',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  color: '#64748b',
                  fontSize: '8px',
                }}
              >
                SENSOR A
              </div>

              <div
                style={{
                  marginTop: '5px',
                  color: '#22d3ee',
                  fontSize: '13px',
                  fontWeight: 800,
                }}
              >
                DETECTED
              </div>
            </div>

            <div
              style={{
                color: '#475569',
                fontSize: '15px',
              }}
            >
              →
            </div>

            <div
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '8px',
                background: '#0b1120',
                border: '1px solid #164e63',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  color: '#64748b',
                  fontSize: '8px',
                }}
              >
                SENSOR B
              </div>

              <div
                style={{
                  marginTop: '5px',
                  color: '#34d399',
                  fontSize: '13px',
                  fontWeight: 800,
                }}
              >
                DETECTED
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: '#0b1120',
              border: '1px solid #1e293b',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                color: '#64748b',
                fontSize: '8px',
                letterSpacing: '1px',
              }}
            >
              ESTIMATED VEHICLE SPEED
            </div>

            <div
              style={{
                marginTop: '6px',
                color: '#34d399',
                fontSize: '27px',
                fontWeight: 800,
              }}
            >
              {speed} km/h
            </div>

            <div
              style={{
                marginTop: '4px',
                color: '#475569',
                fontSize: '8px',
              }}
            >
              VIRTUAL SENSOR DISTANCE: 12.5 m
            </div>
          </div>

          <div
            style={{
              marginTop: '10px',
              color: '#475569',
              fontSize: '8px',
              lineHeight: 1.5,
            }}
          >
            Speed is estimated from simulated detection timing between two
            virtual sensing nodes.
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '12px',
          padding: '10px 12px',
          borderRadius: '8px',
          background: '#111827',
          border: '1px solid #1e293b',
          color: '#475569',
          fontSize: '9px',
        }}
      >
        {latestVehicle
          ? `LATEST CLASSIFICATION: ${latestVehicle.type.toUpperCase()} • ${latestVehicle.direction} • ${latestVehicle.speed} KM/H`
          : 'WAITING FOR SIMULATED VEHICLE DETECTION'}
      </div>
    </section>
  );
}