import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { calculateSpeedFromToF } from '../../utils/speedCalculation';

const SimulationContext = createContext();

export const useSimulation = () => {
  const context = useContext(SimulationContext);

  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
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

const getMovementDelta = (direction, emergency = false) => {
  const base = emergency ? 0.95 : 0.45;

  switch (direction) {
    case 'NORTH':
      return { x: 0, y: base };

    case 'SOUTH':
      return { x: 0, y: -base };

    case 'EAST':
      return { x: -base, y: 0 };

    case 'WEST':
      return { x: base, y: 0 };

    default:
      return { x: 0, y: 0 };
  }
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

const getVehicleProgress = (vehicle) => {
  if (!vehicle?.position) return 0;

  switch (vehicle.direction) {
    case 'NORTH':
      return vehicle.position.y;

    case 'SOUTH':
      return vehicle.position.y;

    case 'EAST':
      return vehicle.position.x;

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

  if (direction === 'NORTH' || direction === 'WEST') {
    return (
      previousProgress < sensorPosition &&
      currentProgress >= sensorPosition
    );
  }

  if (direction === 'SOUTH' || direction === 'EAST') {
    return (
      previousProgress > sensorPosition &&
      currentProgress <= sensorPosition
    );
  }

  return false;
};

export const SimulationProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [events, setEvents] = useState([]);
  const [sensorNodes, setSensorNodes] = useState(INITIAL_SENSOR_NODES);

  const [emergencyMode, setEmergencyMode] = useState(false);

  const [energyGenerated, setEnergyGenerated] = useState(1420);
  const [batteryLevel, setBatteryLevel] = useState(88);

  const [trafficSignals, setTrafficSignals] = useState({
    north: 'RED',
    south: 'RED',
    east: 'GREEN',
    west: 'RED',
  });

  const sensorMemoryRef = useRef(new Map());
  const emergencyTimeoutRef = useRef(null);

  const addEvent = (message, type = 'INFO') => {
    const timestamp = new Date().toLocaleTimeString();

    setEvents((previous) => [
      {
        id: Date.now() + Math.random(),
        timestamp,
        message,
        type,
      },
      ...previous.slice(0, 40),
    ]);
  };

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
        clearTimeout(emergencyTimeoutRef.current);
      }
    };
  }, []);

  /*
   * Continuous virtual vehicle movement + sensor detection.
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
          const previousProgress = getVehicleProgress(vehicle);

          const delta = getMovementDelta(
            vehicle.direction,
            vehicle.isEmergency
          );

          const currentPosition = vehicle.position || {
            ...getStartPosition(vehicle.direction),
          };

          const nextPosition = {
            x: currentPosition.x + delta.x,
            y: currentPosition.y + delta.y,
          };

          const updatedVehicle = {
            ...vehicle,
            position: nextPosition,
          };

          const currentProgress =
            getVehicleProgress(updatedVehicle);

          /*
           * Create memory for this vehicle's sensor journey.
           */
          if (!sensorMemoryRef.current.has(vehicle.id)) {
            sensorMemoryRef.current.set(vehicle.id, {
              A: null,
              B: null,
            });
          }

          const vehicleSensorMemory =
            sensorMemoryRef.current.get(vehicle.id);

          /*
           * Find the two sensors belonging to this vehicle's
           * travel direction.
           */
          const directionSensors =
            INITIAL_SENSOR_NODES.filter(
              (node) => node.direction === vehicle.direction
            );

          directionSensors.forEach((sensor) => {
            const crossed = hasCrossedSensor(
              vehicle.direction,
              previousProgress,
              currentProgress,
              sensor.position
            );

            if (!crossed) return;

            const isNodeA = sensor.id.endsWith('-A');
            const isNodeB = sensor.id.endsWith('-B');

            const timestamp = now;

            /*
             * Prevent duplicate detection events.
             */
            if (isNodeA && !vehicleSensorMemory.A) {
              vehicleSensorMemory.A = timestamp;

              setSensorNodes((previousNodes) =>
                previousNodes.map((node) =>
                  node.id === sensor.id
                    ? {
                        ...node,
                        active: true,
                        lastDetection: timestamp,
                        detectionCount:
                          node.detectionCount + 1,
                      }
                    : node
                )
              );

              setEnergyGenerated(
                (previous) => previous + 0.85
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

            /*
             * Node B completes the ToF measurement.
             */
            if (
              isNodeB &&
              !vehicleSensorMemory.B &&
              vehicleSensorMemory.A
            ) {
              vehicleSensorMemory.B = timestamp;

              setSensorNodes((previousNodes) =>
                previousNodes.map((node) =>
                  node.id === sensor.id
                    ? {
                        ...node,
                        active: true,
                        lastDetection: timestamp,
                        detectionCount:
                          node.detectionCount + 1,
                      }
                    : node
                )
              );

              const speedResult =
                calculateSpeedFromToF(
                  vehicleSensorMemory.A,
                  vehicleSensorMemory.B,
                  SENSOR_DISTANCE_METERS
                );

              setEnergyGenerated(
                (previous) => previous + 0.35
              );

              addEvent(
                `${sensor.label}: ${vehicle.type} detected at second measurement node`,
                'SENSOR'
              );

              if (speedResult.speedKmh > 0) {
                addEvent(
                  `ToF Speed Estimation: ${speedResult.speedKmh} km/h over ${SENSOR_DISTANCE_METERS} m`,
                  'SUCCESS'
                );
              }
            }
          });

          /*
           * Vehicle leaves the virtual road.
           */
          if (isVehicleFinished(updatedVehicle)) {
            addEvent(
              `${vehicle.type} cleared ${vehicle.direction} corridor`,
              'SUCCESS'
            );

            sensorMemoryRef.current.delete(vehicle.id);

            return;
          }

          updatedVehicles.push(updatedVehicle);
        });

        return updatedVehicles;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  /*
   * Automatically deactivate sensor visual activity after
   * a short period so the intersection behaves like live telemetry.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();

      setSensorNodes((previousNodes) =>
        previousNodes.map((node) => ({
          ...node,
          active:
            node.lastDetection &&
            currentTime - node.lastDetection < 700,
        }))
      );
    }, 250);

    return () => clearInterval(interval);
  }, []);

  /*
   * Simulated energy generation from active traffic.
   */
  useEffect(() => {
    if (vehicles.length === 0) return;

    const interval = setInterval(() => {
      const generated = Math.max(
        1,
        Math.round(vehicles.length * 0.35)
      );

      setEnergyGenerated(
        (previous) => previous + generated
      );

      setBatteryLevel((previous) => {
        const chargeRate =
          vehicles.length >= 6 ? 0.08 : 0.04;

        return Math.min(
          100,
          Number((previous + chargeRate).toFixed(2))
        );
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [vehicles.length]);

  /*
   * Background battery consumption when traffic is inactive.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((previous) => {
        if (vehicles.length > 0) {
          return previous;
        }

        return Math.max(
          0,
          Number((previous - 0.02).toFixed(2))
        );
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [vehicles.length]);

  /*
   * Spawn a normal simulated vehicle.
   */
  const simulateVehicle = (vehicleType = null) => {
    const selectedType =
      vehicleType ||
      VEHICLE_TYPES[
        Math.floor(
          Math.random() * VEHICLE_TYPES.length
        )
      ];

    const id =
      Date.now() +
      Math.floor(Math.random() * 1000);

    const direction =
      DIRECTIONS[
        Math.floor(
          Math.random() * DIRECTIONS.length
        )
      ];

    const position = getStartPosition(direction);

    const speed =
      Math.floor(Math.random() * 25) + 30;

    const newVehicle = {
      id,
      type: selectedType,
      direction,
      position,
      speed,
      isEmergency: false,
    };

    sensorMemoryRef.current.set(id, {
      A: null,
      B: null,
    });

    setVehicles((previous) => [
      ...previous,
      newVehicle,
    ]);

    setEnergyGenerated(
      (previous) =>
        previous +
        Math.floor(Math.random() * 15) +
        5
    );

    addEvent(
      `Vehicle injected: ${selectedType} entering ${direction} corridor`,
      'INFO'
    );

    addEvent(
      `Sensor network awaiting ${selectedType} detection`,
      'SENSOR'
    );
  };

  /*
   * Emergency vehicle simulation.
   */
  const simulateEmergencyVehicle = () => {
    if (emergencyTimeoutRef.current) {
      clearTimeout(emergencyTimeoutRef.current);
    }

    setEmergencyMode(true);

    const id = Date.now();

    const emergencyVehicle = {
      id,
      type: 'Ambulance',
      direction: 'NORTH',
      position: {
        x: 48,
        y: 5,
      },
      speed: 75,
      isEmergency: true,
    };

    sensorMemoryRef.current.set(id, {
      A: null,
      B: null,
    });

    setVehicles((previous) => [
      emergencyVehicle,
      ...previous,
    ]);

    setTrafficSignals({
      north: 'GREEN',
      south: 'GREEN',
      east: 'RED',
      west: 'RED',
    });

    setEnergyGenerated(
      (previous) => previous + 20
    );

    addEvent(
      '🚨 EMERGENCY VEHICLE DETECTED - CORRIDOR CLEARANCE OVERRIDE ACTIVATED',
      'EMERGENCY'
    );

    addEvent(
      'North-South adaptive signal corridor switched to priority mode',
      'EMERGENCY'
    );

    emergencyTimeoutRef.current = setTimeout(() => {
      setEmergencyMode(false);

      setTrafficSignals({
        north: 'GREEN',
        south: 'GREEN',
        east: 'RED',
        west: 'RED',
      });

      addEvent(
        'Emergency Corridor Clearance Deactivated - Resuming Standard Adaptive Control',
        'SYSTEM'
      );
    }, 8000);
  };

  /*
   * Automatic adaptive signal cycle.
   */
  useEffect(() => {
    if (emergencyMode) return;

    const interval = setInterval(() => {
      setTrafficSignals((previous) => {
        if (
          previous.north === 'GREEN' ||
          previous.south === 'GREEN'
        ) {
          addEvent(
            'Adaptive signal timing updated - East/West corridor prioritized',
            'SYSTEM'
          );

          return {
            north: 'RED',
            south: 'RED',
            east: 'GREEN',
            west: 'GREEN',
          };
        }

        addEvent(
          'Adaptive signal timing updated - North/South corridor prioritized',
          'SYSTEM'
        );

        return {
          north: 'GREEN',
          south: 'GREEN',
          east: 'RED',
          west: 'RED',
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [emergencyMode]);

  /*
   * Derived traffic metrics.
   */
  const vehicleCount = vehicles.length;

  const averageSpeed =
    vehicleCount > 0
      ? Math.round(
          vehicles.reduce(
            (total, vehicle) =>
              total + Number(vehicle.speed || 0),
            0
          ) / vehicleCount
        )
      : 42;

  const congestion =
    vehicleCount > 10
      ? 'CRITICAL'
      : vehicleCount > 6
        ? 'HEAVY'
        : vehicleCount > 3
          ? 'BUSY'
          : 'NORMAL';

  const density = {
    north: vehicles.filter(
      (vehicle) =>
        vehicle.direction === 'NORTH'
    ).length,

    south: vehicles.filter(
      (vehicle) =>
        vehicle.direction === 'SOUTH'
    ).length,

    east: vehicles.filter(
      (vehicle) =>
        vehicle.direction === 'EAST'
    ).length,

    west: vehicles.filter(
      (vehicle) =>
        vehicle.direction === 'WEST'
    ).length,
  };

  /*
   * Latest ToF result available from the event stream.
   */
  const speedEvents = events.filter(
    (event) =>
      event.message?.startsWith(
        'ToF Speed Estimation:'
      )
  );

  const latestSpeedEvent =
    speedEvents.length > 0
      ? speedEvents[0]
      : null;

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