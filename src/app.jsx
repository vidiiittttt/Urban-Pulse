import LandingPage from './pages/landingpage';
import { UrbanPulseSimulationView } from './components/simulation/UrbanPulseSimulation';
import DashboardPage from './pages/dashboard';
import { SimulationProvider } from './components/simulation/SimulationContext';

export default function App() {
  const path = window.location.pathname;

  return (
    <SimulationProvider>
      {path === '/simulation' ? (
        <UrbanPulseSimulationView />
      ) : path === '/dashboard' ? (
        <DashboardPage />
      ) : (
        <LandingPage />
      )}
    </SimulationProvider>
  );
}