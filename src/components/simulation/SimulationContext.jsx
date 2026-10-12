import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { calculateSpeedFromToF } from '../../utils/speedCalculation';

const SimulationContext = createContext(null);

export const useSimulation = () => {
  const context = useContext(SimulationContext);

  if (!context) {
    throw new Error(
      'useSimulation must be used within a SimulationProvider'
    );
  }

  return context;
};

const DIRECTIONS = ['NORTH', 'SOUTH', 'EAST', 'WEST'];

const VEHICLE_TYPES = [
  'Car',
  'Two-wheeler',
  'Bus',
  'Truck',
  'Pedestrian',
];

const SENSOR_DISTANCE_METERS = 12.5;
const SIMULATION_TICK_MS = 100;
const SIGNAL_UPDATE_MS = 5000;

const INITIAL_SENSOR_NODES = [
  {
    id: 'N-A',
    label: 'Node N-A',
    direction: 'NORTH',
    sensorType: 'PZT',
    position: 15,
    active: false,
    lastDetection: null,
    detectionCount: 0,
  },
  {
    id: 'N-B',
    label: 'Node N-B',
    direction: 'NORTH',
    sensorType: 'TENG',
    position: 27.5,
    active: false,
    lastDetection: null,
    detectionCount: 0,
  },
  {
    id: 'S-A',
    label: 'Node S-A',
    direction: 'SOUTH',
    sensorType: 'PZT',
    position: 85,
    active: false,
    lastDetection: null,
    detectionCount: 0,
  },
  {
    id: 'S-B',
    label: 'Node S-B',
    direction: 'SOUTH',
    sensorType: 'TENG',
    position: 72.5,
    active: false,
    lastDetection: null,
    detectionCount: 0,
  },
  {
    id: 'E-A',
    label: 'Node E-A',
    direction: 'EAST',
    sensorType: 'MAG',
    position: 85,
    active: false,
    lastDetection: null,
    detectionCount: 0,
  },
  {
    id: 'E-B',
    label: 'Node E-B',
    direction: 'EAST',
    sensorType: 'TENG',
    position: 72.5,
    active: false,
    lastDetection: null,
    detectionCount: 0,
  },
  {
    id: 'W-A',
    label: 'Node W-A',
    direction: 'WEST',
    sensorType: 'PZT',
    position: 15,
    active: false,
    lastDetection: null,
    detectionCount: 0,
  },
  {
    id: 'W-B',
    label: 'Node W-B',
    direction: 'WEST',
    sensorType: 'TENG',
    position: 27.5,
    active: false,
    lastDetection: null,
    detectionCount: 0,
  },
];

const getStartPosition = (direction) => {
  switch (direction) {
    case 'NORTH':
      return { x: 48, y: 5 };

    case 'SOUTH':
      return { x: 52, y: 95 };

    case 'EAST':
      return { x: 95, y: 48 };

    case 'WEST':
      return { x: 5, y: 52 };

    default:
      return { x: 50, y: 50 };
  }
};

const getMovementDelta = (
  direction,
  speed,
  emergency = false
) => {
  const safeSpeed = Math.max(
    1,
    Number(speed) || (emergency ? 75 : 42)
  );

  const metersPerSecond = safeSpeed / 3.6;

  const metersPerTick =
    metersPerSecond *
    (SIMULATION_TICK_MS / 1000);

  switch (direction) {
    case 'NORTH':
      return { x: 0, y: metersPerTick };

    case 'SOUTH':
      return { x: 0, y: -metersPerTick };

    case 'EAST':
      return { x: -metersPerTick, y: 0 };

    case 'WEST':
      return { x: metersPerTick, y: 0 };

    default:
      return { x: 0, y: 0 };
  }
};

const getVehicleProgress = (vehicle) => {
  if (!vehicle?.position) return 0;

  switch (vehicle.direction) {
    case 'NORTH':
    case 'SOUTH':
      return vehicle.position.y;

    case 'EAST':
    case 'WEST':
      return vehicle.position.x;

    default:
      return 0;
  }
};

const hasCrossedSensor = (
  direction,
  previousProgress,
  currentProgress,
  sensorPosition
) => {
  if (
    !Number.isFinite(previousProgress) ||
    !Number.isFinite(currentProgress)
  ) {
    return false;
  }

  if (
    direction === 'NORTH' ||
    direction === 'WEST'
  ) {
    return (
      previousProgress < sensorPosition &&
      currentProgress >= sensorPosition
    );
  }

  return (
    previousProgress > sensorPosition &&
    currentProgress <= sensorPosition
  );
};

const isVehicleFinished = (vehicle) => {
  const { direction, position } = vehicle;

  if (!position) return true;

  switch (direction) {
    case 'NORTH':
      return position.y >= 105;

    case 'SOUTH':
      return position.y <= -5;

    case 'EAST':
      return position.x <= -5;

    case 'WEST':
      return position.x >= 105;

    default:
      return true;
  }
};

export const SimulationProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [events, setEvents] = useState([]);
  const [sensorNodes, setSensorNodes] = useState(
    INITIAL_SENSOR_NODES
  );

  const [emergencyMode, setEmergencyMode] =
    useState(false);

  const [energyGenerated, setEnergyGenerated] =
    useState(1420);

  const [batteryLevel, setBatteryLevel] =
    useState(88);

  const [trafficSignals, setTrafficSignals] =
    useState({
      north: 'RED',
      south: 'RED',
      east: 'GREEN',
      west: 'RED',
    });

  const sensorMemoryRef = useRef(new Map());
  const emergencyTimeoutRef = useRef(null);

  const addEvent = (
    message,
    type = 'INFO'
  ) => {
    setEvents((previous) => [
      {
        id:
          Date.now() +
          Math.random(),

        timestamp:
          new Date().toLocaleTimeString(),

        message,
        type,
      },
      ...previous.slice(0, 40),
    ]);
  };

  /*
   * Initial system events.
   */
  useEffect(() => {
    addEvent(
      'Smart Pavement Telemetry Engine Initialized',
      'SYSTEM'
    );

    addEvent(
      'Piezo/TENG/Magnetic Sensor Network Online',
      'SUCCESS'
    );

    addEvent(
      'Cross-Node Time-of-Flight Speed Estimation Ready',
      'SUCCESS'
    );

    return () => {
      if (emergencyTimeoutRef.current) {
        clearTimeout(
          emergencyTimeoutRef.current
        );
      }
    };
  }, []);

  /*
   * Vehicle movement and sensor detection.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((previousVehicles) => {
        if (previousVehicles.length === 0) {
          return previousVehicles;
        }

        const now = Date.now();
        const updatedVehicles = [];

        previousVehicles.forEach((vehicle) => {
          const previousProgress =
            getVehicleProgress(vehicle);

          const delta = getMovementDelta(
            vehicle.direction,
            vehicle.speed,
            vehicle.isEmergency
          );

          const currentPosition =
            vehicle.position ||
            getStartPosition(
              vehicle.direction
            );

          const nextPosition = {
            x:
              currentPosition.x +
              delta.x,

            y:
              currentPosition.y +
              delta.y,
          };

          const updatedVehicle = {
            ...vehicle,
            position: nextPosition,
          };

          const currentProgress =
            getVehicleProgress(
              updatedVehicle
            );

          if (
            !sensorMemoryRef.current.has(
              vehicle.id
            )
          ) {
            sensorMemoryRef.current.set(
              vehicle.id,
              {
                A: null,
                B: null,
              }
            );
          }

          const memory =
            sensorMemoryRef.current.get(
              vehicle.id
            );

          const directionSensors =
            INITIAL_SENSOR_NODES.filter(
              (node) =>
                node.direction ===
                vehicle.direction
            );

          directionSensors.forEach(
            (sensor) => {
              const crossed =
                hasCrossedSensor(
                  vehicle.direction,
                  previousProgress,
                  currentProgress,
                  sensor.position
                );

              if (!crossed) return;

              const timestamp = now;

              if (
                sensor.id.endsWith('-A') &&
                !memory.A
              ) {
                memory.A = timestamp;

                setSensorNodes(
                  (previousNodes) =>
                    previousNodes.map(
                      (node) =>
                        node.id ===
                        sensor.id
                          ? {
                              ...node,
                              active: true,
                              lastDetection:
                                timestamp,
                              detectionCount:
                                node.detectionCount +
                                1,
                            }
                          : node
                    )
                );

                setEnergyGenerated(
                  (previous) =>
                    previous + 0.85
                );

                addEvent(
                  `${sensor.label}: ${vehicle.type} detected moving ${vehicle.direction}`,
                  'SENSOR'
                );

                addEvent(
                  `${sensor.label}: Simulated ${sensor.sensorType} response recorded`,
                  'SENSOR'
                );
              }

              if (
                sensor.id.endsWith('-B') &&
                !memory.B &&
                memory.A
              ) {
                memory.B = timestamp;

                setSensorNodes(
                  (previousNodes) =>
                    previousNodes.map(
                      (node) =>
                        node.id ===
                        sensor.id
                          ? {
                              ...node,
                              active: true,
                              lastDetection:
                                timestamp,
                              detectionCount:
                                node.detectionCount +
                                1,
                            }
                          : node
                    )
                );

                const result =
                  calculateSpeedFromToF(
                    memory.A,
                    memory.B,
                    SENSOR_DISTANCE_METERS
                  );

                setEnergyGenerated(
                  (previous) =>
                    previous + 0.35
                );

                addEvent(
                  `${sensor.label}: ${vehicle.type} detected at second measurement node`,
                  'SENSOR'
                );

                if (result.speedKmh > 0) {
                  addEvent(
                    `ToF Speed Estimation: ${result.speedKmh} km/h over ${SENSOR_DISTANCE_METERS} m`,
                    'SUCCESS'
                  );
                }
              }
            }
          );

          if (
            isVehicleFinished(
              updatedVehicle
            )
          ) {
            addEvent(
              `${vehicle.type} cleared ${vehicle.direction} corridor`,
              'SUCCESS'
            );

            sensorMemoryRef.current.delete(
              vehicle.id
            );

            return;
          }

          updatedVehicles.push(
            updatedVehicle
          );
        });

        return updatedVehicles;
      });
    }, SIMULATION_TICK_MS);

    return () =>
      clearInterval(interval);
  }, []);

  /*
   * Sensor active-state timeout.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setSensorNodes(
        (previousNodes) =>
          previousNodes.map((node) => ({
            ...node,
            active:
              Boolean(
                node.lastDetection
              ) &&
              now -
                node.lastDetection <
                700,
          }))
      );
    }, 250);

    return () =>
      clearInterval(interval);
  }, []);

  /*
   * Simulated energy generation.
   */
  useEffect(() => {
    if (vehicles.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setEnergyGenerated(
        (previous) =>
          previous +
          Math.max(
            1,
            Math.round(
              vehicles.length * 0.35
            )
          )
      );

      setBatteryLevel((previous) =>
        Math.min(
          100,
          Number(
            (
              previous +
              (vehicles.length >= 6
                ? 0.08
                : 0.04)
            ).toFixed(2)
          )
        )
      );
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [vehicles.length]);

  /*
   * Battery standby drain.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((previous) => {
        if (vehicles.length > 0) {
          return previous;
        }

        return Math.max(
          0,
          Number(
            (previous - 0.02).toFixed(2)
          )
        );
      });
    }, 3000);

    return () =>
      clearInterval(interval);
  }, [vehicles.length]);

  /*
   * Inject normal vehicle.
   */
  const simulateVehicle = (
    vehicleType = null
  ) => {
    const type =
      vehicleType ||
      VEHICLE_TYPES[
        Math.floor(
          Math.random() *
            VEHICLE_TYPES.length
        )
      ];

    const id =
      Date.now() +
      Math.floor(
        Math.random() * 1000
      );

    const direction =
      DIRECTIONS[
        Math.floor(
          Math.random() *
            DIRECTIONS.length
        )
      ];

    const speed =
      Math.floor(
        Math.random() * 25
      ) + 30;

    const vehicle = {
      id,
      type,
      direction,
      speed,
      position:
        getStartPosition(direction),
      isEmergency: false,
    };

    sensorMemoryRef.current.set(
      id,
      {
        A: null,
        B: null,
      }
    );

    setVehicles((previous) => [
      ...previous,
      vehicle,
    ]);

    setEnergyGenerated(
      (previous) =>
        previous +
        Math.floor(
          Math.random() * 15
        ) +
        5
    );

    addEvent(
      `Vehicle injected: ${type} entering ${direction} corridor`,
      'INFO'
    );

    addEvent(
      `Sensor network awaiting ${type} detection`,
      'SENSOR'
    );
  };

  /*
   * Emergency vehicle.
   */
  const simulateEmergencyVehicle =
    () => {
      if (
        emergencyTimeoutRef.current
      ) {
        clearTimeout(
          emergencyTimeoutRef.current
        );
      }

      const id = Date.now();

      const vehicle = {
        id,
        type: 'Ambulance',
        direction: 'NORTH',
        speed: 75,
        position: {
          x: 48,
          y: 5,
        },
        isEmergency: true,
      };

      sensorMemoryRef.current.set(
        id,
        {
          A: null,
          B: null,
        }
      );

      setEmergencyMode(true);

      setVehicles((previous) => [
        vehicle,
        ...previous,
      ]);

      setTrafficSignals({
        north: 'GREEN',
        south: 'GREEN',
        east: 'RED',
        west: 'RED',
      });

      setEnergyGenerated(
        (previous) =>
          previous + 20
      );

      addEvent(
        '🚨 EMERGENCY VEHICLE DETECTED - CORRIDOR CLEARANCE OVERRIDE ACTIVATED',
        'EMERGENCY'
      );

      addEvent(
        'North-South adaptive signal corridor switched to priority mode',
        'EMERGENCY'
      );

      emergencyTimeoutRef.current =
        setTimeout(() => {
          setEmergencyMode(false);

          addEvent(
            'Emergency Corridor Clearance Deactivated - Resuming Adaptive Traffic Control',
            'SYSTEM'
          );
        }, 8000);
    };

  /*
   * Automatic traffic generation.
   *
   * SimulationContext is the single source of truth
   * for automatic vehicle creation.
   */
  const simulateVehicleRef = useRef(simulateVehicle);

  useEffect(() => {
    simulateVehicleRef.current = simulateVehicle;
  }, [simulateVehicle]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (
        typeof simulateVehicleRef.current ===
        'function'
      ) {
        simulateVehicleRef.current();
      }
    }, 1800);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /*
   * Derived traffic metrics.
   */
  const vehicleCount =
    vehicles.length;

  const averageSpeed =
    vehicleCount > 0
      ? Math.round(
          vehicles.reduce(
            (total, vehicle) =>
              total +
              Number(
                vehicle.speed || 0
              ),
            0
          ) / vehicleCount
        )
      : 42;

  const density = {
    north: vehicles.filter(
      (vehicle) =>
        vehicle.direction ===
        'NORTH'
    ).length,

    south: vehicles.filter(
      (vehicle) =>
        vehicle.direction ===
        'SOUTH'
    ).length,

    east: vehicles.filter(
      (vehicle) =>
        vehicle.direction ===
        'EAST'
    ).length,

    west: vehicles.filter(
      (vehicle) =>
        vehicle.direction ===
        'WEST'
    ).length,
  };

  const congestion =
    vehicleCount > 10
      ? 'CRITICAL'
      : vehicleCount > 6
        ? 'HEAVY'
        : vehicleCount > 3
          ? 'BUSY'
          : 'NORMAL';

  /*
   * Adaptive traffic signals.
   */
  useEffect(() => {
    if (emergencyMode) {
      return;
    }

    const interval = setInterval(() => {
      const ns =
        density.north +
        density.south;

      const ew =
        density.east +
        density.west;

      setTrafficSignals(
        (previous) => {
          let useNorthSouth;

          if (ns > ew) {
            useNorthSouth = true;
          } else if (ew > ns) {
            useNorthSouth = false;
          } else {
            useNorthSouth =
              previous.north ===
                'GREEN' ||
              previous.south ===
                'GREEN';
          }

          const next =
            useNorthSouth
              ? {
                  north: 'GREEN',
                  south: 'GREEN',
                  east: 'RED',
                  west: 'RED',
                }
              : {
                  north: 'RED',
                  south: 'RED',
                  east: 'GREEN',
                  west: 'GREEN',
                };

          const changed =
            previous.north !==
              next.north ||
            previous.south !==
              next.south ||
            previous.east !==
              next.east ||
            previous.west !==
              next.west;

          if (changed) {
            addEvent(
              `Adaptive signal control: ${
                useNorthSouth
                  ? 'North/South'
                  : 'East/West'
              } corridor prioritized (${Math.max(
                ns,
                ew
              )} vehicles)`,
              'SYSTEM'
            );
          }

          return next;
        }
      );
    }, SIGNAL_UPDATE_MS);

    return () =>
      clearInterval(interval);
  }, [
    emergencyMode,
    density.north,
    density.south,
    density.east,
    density.west,
  ]);

  const latestSpeedEvent =
    [...events]
      .reverse()
      .find((event) =>
        event.message?.startsWith(
          'ToF Speed Estimation:'
        )
      ) || null;

  return (
    <SimulationContext.Provider
      value={{
        vehicles,
        events,

        sensorNodes,
        latestSpeedEvent,

        emergencyMode,
        trafficSignals,

        energyGenerated,
        batteryLevel,

        vehicleCount,
        averageSpeed,
        congestion,
        density,

        simulateVehicle,
        simulateEmergencyVehicle,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};