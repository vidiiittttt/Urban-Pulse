import { SENSOR_CONFIG } from '../data/simulationData';

/**
 * Calculates vehicle speed based on Cross-Node Time-of-Flight (ToF).
 * @param {number} timeA - Timestamp at Node A (milliseconds)
 * @param {number} timeB - Timestamp at Node B (milliseconds)
 * @param {number} customDistanceMeters - Optional override for node spacing
 * @returns {object} { speedMps, speedKmh }
 */
export const calculateSpeedFromToF = (timeA, timeB, customDistanceMeters = SENSOR_CONFIG.NODE_DISTANCE_METERS) => {
  if (!timeA || !timeB || timeB <= timeA) {
    return { speedMps: 0, speedKmh: 0 };
  }

  const timeDifferenceSeconds = (timeB - timeA) / 1000;
  const speedMps = customDistanceMeters / timeDifferenceSeconds;
  const speedKmh = Math.round(speedMps * 3.6 * 10) / 10;

  return { speedMps, speedKmh };
};