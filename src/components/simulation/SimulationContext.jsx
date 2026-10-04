import React, { createContext, useContext, useState, useEffect } from 'react';

const SimulationContext = createContext();

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};

export const SimulationProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [events, setEvents] = useState([]);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [energyGenerated, setEnergyGenerated] = useState(1420); // Joules
  const [batteryLevel, setBatteryLevel] = useState(88); // Percentage
  const [trafficSignals, setTrafficSignals] = useState({
    north: 'RED',
    south: 'RED',
    east: 'GREEN',
    west: 'RED',
  });

  // Log events helper
  const addEvent = (message, type = 'INFO') => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents((prev) => [
      { id: Date.now() + Math.random(), timestamp, message, type },
      ...prev.slice(0, 40), // Keep last 40 logs
    ]);
  };

  // Initial event on mount
  useEffect(() => {
    addEvent('Smart Pavement Telemetry Engine Initialized', 'SYSTEM');
    addEvent('Piezo/TENG Energy Harvesting Array Online', 'SUCCESS');
  }, []);

  // Spawn a new vehicle
  const simulateVehicle = (vehicleType = null) => {
    const types = ['Car', 'Two-wheeler', 'Bus', 'Truck', 'Pedestrian'];
    const selectedType = vehicleType || types[Math.floor(Math.random() * types.length)];
    const id = Date.now() + Math.floor(Math.random() * 1000);

    const directions = ['NORTH', 'SOUTH', 'EAST', 'WEST'];
    const dir = directions[Math.floor(Math.random() * directions.length)];

    let startX = 50, startY = 50;
    if (dir === 'NORTH') { startX = 48; startY = 5; }
    if (dir === 'SOUTH') { startX = 52; startY = 95; }
    if (dir === 'EAST') { startX = 95; startY = 48; }
    if (dir === 'WEST') { startX = 5; startY = 52; }

    const newVehicle = {
      id,
      type: selectedType,
      direction: dir,
      position: { x: startX, y: startY },
      speed: Math.floor(Math.random() * 25) + 30, // 30 - 55 km/h
      isEmergency: false,
    };

    setVehicles((prev) => [...prev, newVehicle]);
    setEnergyGenerated((prev) => prev + Math.floor(Math.random() * 15) + 5);

    addEvent(`Node Triggered: ${selectedType} detected moving ${dir}`, 'INFO');
  };

  // Trigger Emergency Corridor Clearance
  const simulateEmergencyVehicle = () => {
    setEmergencyMode(true);
    const id = Date.now();
    
    const emergencyVehicle = {
      id,
      type: 'Ambulance',
      direction: 'NORTH',
      position: { x: 48, y: 10 },
      speed: 75,
      isEmergency: true,
    };

    setVehicles((prev) => [emergencyVehicle, ...prev]);

    // Force North-South Green Light Corridor
    setTrafficSignals({
      north: 'GREEN',
      south: 'GREEN',
      east: 'RED',
      west: 'RED',
    });

    addEvent('🚨 EMERGENCY VEHICLE DETECTED - CORRIDOR CLEARANCE OVERRIDE ACTIVATED', 'EMERGENCY');

    setTimeout(() => {
      setEmergencyMode(false);
      addEvent('Emergency Corridor Clearance Deactivated - Resuming Standard Adaptive Control', 'SYSTEM');
    }, 8000);
  };

  // Automatic Signal Rotation Cycle when not in emergency
  useEffect(() => {
    if (emergencyMode) return;

    const interval = setInterval(() => {
      setTrafficSignals((prev) => {
        if (prev.north === 'GREEN') {
          return { north: 'RED', south: 'RED', east: 'GREEN', west: 'RED' };
        } else {
          return { north: 'GREEN', south: 'GREEN', east: 'RED', west: 'RED' };
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [emergencyMode]);

  // Derived metrics
  const vehicleCount = vehicles.length;
  const averageSpeed = vehicleCount > 0 
    ? Math.round(vehicles.reduce((acc, v) => acc + v.speed, 0) / vehicleCount) 
    : 42;

  const congestion = vehicleCount > 10 ? 'CRITICAL' : vehicleCount > 6 ? 'HEAVY' : vehicleCount > 3 ? 'BUSY' : 'NORMAL';

  const density = {
    north: vehicles.filter((v) => v.direction === 'NORTH').length,
    south: vehicles.filter((v) => v.direction === 'SOUTH').length,
    east: vehicles.filter((v) => v.direction === 'EAST').length,
    west: vehicles.filter((v) => v.direction === 'WEST').length,
  };

  return (
    <SimulationContext.Provider
      value={{
        vehicles,
        events,
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