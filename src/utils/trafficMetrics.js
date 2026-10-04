/**
 * Computes live traffic metrics and assigns congestion state based on active density.
 */
export const updateTrafficMetrics = (vehicles, currentEvents) => {
  const directionCounts = { north: 0, south: 0, east: 0, west: 0 };
  let totalSpeed = 0;

  vehicles.forEach(v => {
    if (directionCounts[v.direction] !== undefined) {
      directionCounts[v.direction]++;
    }
    totalSpeed += v.speed || 0;
  });

  const totalCount = vehicles.length;
  const averageSpeed = totalCount > 0 ? Math.round(totalSpeed / totalCount) : 0;

  // Maximum density threshold per lane segment before congestion escalates
  const totalDensity = Object.values(directionCounts).reduce((a, b) => a + b, 0);

  let congestion = "NORMAL";
  if (totalDensity > 14) {
    congestion = "CRITICAL";
  } else if (totalDensity > 9) {
    congestion = "HEAVY";
  } else if (totalDensity > 5) {
    congestion = "BUSY";
  }

  return {
    vehicleCount: totalCount,
    averageSpeed,
    density: directionCounts,
    congestion
  };
};