import { VEHICLE_PROPERTIES } from '../data/simulationData';

/**
 * Generates simulated piezoelectric, triboelectric, and magnetic signatures
 * to mimic smart pavement multi-modal pulse detection.
 */
export const generateSimulatedSensorSignature = (vehicleType) => {
  const profile = VEHICLE_PROPERTIES[vehicleType.toUpperCase()] || VEHICLE_PROPERTIES.CAR;
  
  const piezoPeak = Number((Math.random() * (profile.piezoRange[1] - profile.piezoRange[0]) + profile.piezoRange[0]).toFixed(2));
  const triboPeak = Number((Math.random() * (profile.triboRange[1] - profile.triboRange[0]) + profile.triboRange[0]).toFixed(2));
  const magPeak = Number((Math.random() * (profile.magRange[1] - profile.magRange[0]) + profile.magRange[0]).toFixed(2));

  return {
    piezoAmplitude: piezoPeak,
    piezoPeak: `${piezoPeak} V`,
    triboelectricVoltage: `${triboPeak} V`,
    magneticSignature: `${magPeak} µT`,
    waveformDuration: `${Math.floor(Math.random() * 80 + 120)} ms`,
    frequency: `${Math.floor(Math.random() * 25 + 35)} Hz`,
    energyJoules: Number(((piezoPeak + triboPeak) * 0.12 * profile.axles).toFixed(3))
  };
};

/**
 * Classifies entity based on synthetic thresholding (Simulated Model inference)
 */
export const classifyVehicleBySignature = (piezoPeak, magPeak) => {
  if (piezoPeak < 0.2) return 'Pedestrian';
  if (piezoPeak < 0.4 && magPeak < 0.3) return 'Bicycle';
  if (piezoPeak < 0.9 && magPeak < 0.7) return 'Two-wheeler';
  if (piezoPeak < 2.8 && magPeak < 2.0) return 'Car';
  if (piezoPeak < 5.8 && magPeak < 4.0) return 'Commercial vehicle';
  return 'Truck';
};