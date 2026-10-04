import { ROUTES } from './routes';

const CARS = [
  { cls: 'h', top: '44%', d: '0s', dur: '7s' },
  { cls: 'h r', top: '53%', d: '2s', dur: '9s' },
  { cls: 'v', left: '47%', d: '1s', dur: '8s' },
  { cls: 'v r', left: '54%', d: '3.5s', dur: '10s' },
];

export default function Hero() {
  return (
    <section id="top" className="up-hero">
      <div className="up-hero-copy">
        <span className="up-badge"><i /> Simulation Prototype</span>
        <h1>Turning Every Road Into <span className="up-grad">Intelligent Infrastructure</span></h1>
        <p>
          Urban Pulse uses smart pavement sensing and simulated edge intelligence to understand
          traffic as it happens, then dynamically respond with adaptive signals.
        </p>
        <div className="up-row">
          <a className="up-btn up-btn-primary" href={ROUTES.simulation}>View Live Simulation</a>
          <a className="up-btn up-btn-ghost" href={ROUTES.dashboard}>Explore Dashboard</a>
        </div>
        <small className="up-note">All sensor readings and traffic data are simulated. No physical hardware is connected.</small>
      </div>
      <div className="up-hero-visual" aria-hidden="true">
        <div className="up-junction">
          <div className="road road-h" /><div className="road road-v" />
          <div className="up-tiles">
            {Array.from({ length: 36 }, (_, i) => <span key={i} style={{ '--d': `${(i % 6) * 0.25 + Math.floor(i / 6) * 0.2}s` }} />)}
          </div>
          {CARS.map((c, i) => (
            <span key={i} className={`car ${c.cls}`} style={{ top: c.top, left: c.left, animationDelay: c.d, animationDuration: c.dur }} />
          ))}
          <span className="ring" />
        </div>
      </div>
    </section>
  );
}