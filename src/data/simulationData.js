/**
 * URBAN PULSE - SIMULATION DATA & CONSTANTS
 * NOTE: All sensor values, waveforms, and metrics are SIMULATED for prototype demonstration.
 */

export const SENSOR_CONFIG = {
  NODE_DISTANCE_METERS: 12.5, // Known distance between Node A and Node B
  HARVEST_PIEZO_JOULES_PER_AXLE: 0.85,
  HARVEST_TRIBO_JOULES_PER_AXLE: 0.35,
};

export const VEHICLE_PROPERTIES = {
  PEDESTRIAN: { axles: 0, weightClass: 'nano', piezoRange: [0.05, 0.15], triboRange: [0.1, 0.3], magRange: [0.0, 0.05], speedLimit: 5 },
  BICYCLE: { axles: 2, weightClass: 'micro', piezoRange: [0.15, 0.35], triboRange: [0.2, 0.5], magRange: [0.1, 0.25], speedLimit: 20 },
  TWO_WHEELER: { axles: 2, weightClass: 'light', piezoRange: [0.4, 0.8], triboRange: [0.5, 0.9], magRange: [0.3, 0.6], speedLimit: 45 },
  CAR: { axles: 2, weightClass: 'medium', piezoRange: [1.2, 2.5], triboRange: [1.0, 2.2], magRange: [0.8, 1.8], speedLimit: 60 },
  COMMERCIAL: { axles: 3, weightClass: 'heavy', piezoRange: [3.0, 5.5], triboRange: [2.5, 4.5], magRange: [2.0, 3.8], speedLimit: 50 },
  BUS: { axles: 2, weightClass: 'heavy', piezoRange: [3.5, 6.0], triboRange: [2.8, 4.8], magRange: [2.5, 4.2], speedLimit: 40 },
  TRUCK: { axles: 5, weightClass: 'super_heavy', piezoRange: [5.0, 9.5], triboRange: [4.0, 7.5], magRange: [3.5, 6.0], speedLimit: 45 },
  EMERGENCY: { axles: 2, weightClass: 'medium', piezoRange: [1.8, 3.2], triboRange: [1.5, 2.8], magRange: [1.2, 2.2], speedLimit: 80 }
};

export const INITIAL_SIMULATION_STATE = {
  vehicles: [],
  vehicleCount: 0,
  averageSpeed: 0,
  density: {
    north: 0,
    south: 0,
    east: 0,
    west: 0
  },
  congestion: "NORMAL", // "NORMAL" | "BUSY" | "HEAVY" | "CRITICAL"
  sensorNodes: [
    { id: 'node-N-A', direction: 'north', nodeType: 'A', position: 15 },
    { id: 'node-N-B', direction: 'north', nodeType: 'B', position: 27.5 },
    { id: 'node-S-A', direction: 'south', nodeType: 'A', position: 15 },
    { id: 'node-S-B', direction: 'south', nodeType: 'B', position: 27.5 },
    { id: 'node-E-A', direction: 'east',  nodeType: 'A', position: 15 },
    { id: 'node-E-B', direction: 'east',  nodeType: 'B', position: 27.5 },
    { id: 'node-W-A', direction: 'west',  nodeType: 'A', position: 15 },
    { id: 'node-W-B', direction: 'west',  nodeType: 'B', position: 27.5 }
  ],
  energyGenerated: 142.50, // Cumulative simulated Joules
  batteryLevel: 78,        // Direct-current storage %
  emergencyMode: false,
  trafficSignals: {
    north: 'RED',
    south: 'RED',
    east: 'GREEN',
    west: 'GREEN'
  },
  events: [
    { id: 1, timestamp: new Date().toLocaleTimeString(), message: "Urban Pulse Virtual Simulation Engine initialized.", type: "INFO" }
  ]
};