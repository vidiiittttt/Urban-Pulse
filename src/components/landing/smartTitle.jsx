import { useState } from 'react';

const LAYERS = [
  ['Road surface', 'Durable wear layer that carries vehicle load into the tile.', '#94a3b8'],
  ['Piezoelectric sensing', 'Concept: pressure from wheels produces a signal used to detect axle load.', '#22d3ee'],
  ['Triboelectric layer', 'Concept: contact and separation generates a signal and harvestable charge.', '#34d399'],
  ['Magnetic sensing', 'Concept: detects the magnetic disturbance of a passing metal body.', '#8b5cf6'],
  ['Signal processing', 'Conditions and filters raw sensor signals before analysis.', '#f472b6'],
  ['Energy storage', 'Concept: stores harvested energy to run the tile electronics.', '#fbbf24'],
  ['Edge controller', 'Runs classification and speed estimation logic locally.', '#fb7185'],
];

export default function SmartTile() {
  const [active, setActive] = useState(1);
  const [title, text] = LAYERS[active];
  return (
    <section className="up-section">
      <p className="up-eyebrow rv">Smart Tile</p>
      <h2 className="rv">Inside a pavement tile</h2>
      <p className="up-lead rv">Visual concept only. This website is not connected to real hardware.</p>
      <div className="up-tile-wrap rv">
        <div className="up-stack" role="img" aria-label="Exploded view of the smart tile layers">
          {LAYERS.map(([n, , c], i) => (
            <button key={n} className={`layer ${i === active ? 'on' : ''}`}
              style={{ '--i': i, '--c': c }} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} aria-label={n}>
              <span>{n}</span>
            </button>
          ))}
        </div>
        <div className="up-panel">
          <ul>
            {LAYERS.map(([n, , c], i) => (
              <li key={n}><button className={i === active ? 'on' : ''} style={{ '--c': c }} onClick={() => setActive(i)}>
                <i />{n}</button></li>
            ))}
          </ul>
          <div className="up-detail" style={{ '--c': LAYERS[active][2] }}>
            <h3>{title}</h3><p>{text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}