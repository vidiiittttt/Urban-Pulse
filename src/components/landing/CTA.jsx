import { ROUTES } from './routes';

export default function CTA() {
  return (
    <section className="up-section up-cta rv">
      <h2>Experience the Intelligent Intersection</h2>
      <p className="up-lead">Explore the simulated intersection, then watch the telemetry in the dashboard.</p>
      <div className="up-row center">
        <a className="up-btn up-btn-primary" href={ROUTES.simulation}>Launch Simulation</a>
        <a className="up-btn up-btn-ghost" href={ROUTES.dashboard}>Open Dashboard</a>
      </div>
      <footer>Urban Pulse · Simulation Prototype · No physical hardware</footer>
    </section>
  );
}