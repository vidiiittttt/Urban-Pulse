import { SENSOR_CONFIG } from '../data/simulationData';

/**
 * Calculates vehicle speed using the simulated
 * cross-node Time-of-Flight measurement.
 *
 * @param {number} timeA - Node A detection timestamp in milliseconds
 * @param {number} timeB - Node B detection timestamp in milliseconds
 * @param {number} customDistanceMeters - Optional node spacing override
 * @returns {{speedMps: number, speedKmh: number, timeDifferenceMs: number}}
 */
export const calculateSpeedFromToF = (
  timeA,
  timeB,
  customDistanceMeters = SENSOR_CONFIG.NODE_DISTANCE_METERS
) => {
  if (
    typeof timeA !== 'number' ||
    typeof timeB !== 'number' ||
    !Number.isFinite(timeA) ||
    !Number.isFinite(timeB) ||
    timeB <= timeA ||
    customDistanceMeters <= 0
  ) {
    return {
      speedMps: 0,
      speedKmh: 0,
      timeDifferenceMs: 0,
    };
  }

  const timeDifferenceMs = timeB - timeA;
  const timeDifferenceSeconds = timeDifferenceMs / 1000;

  const speedMps =
    customDistanceMeters / timeDifferenceSeconds;

  const speedKmh =
    Math.round(speedMps * 3.6 * 10) / 10;

  return {
    speedMps: Number(speedMps.toFixed(3)),
    speedKmh,
    timeDifferenceMs,
  };
};