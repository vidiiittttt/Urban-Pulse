const TECH = [
  ['Piezoelectric sensing', 'Pressure-based detection concept for vehicle presence and load.'],
  ['Triboelectric sensing', 'Contact-driven signal concept, also a possible energy source.'],
  ['Magnetic sensing', 'Magnetic-signature concept for identifying vehicle types.'],
  ['Edge processing', 'Simulated on-tile logic that avoids round trips to the cloud.'],
  ['Sensor fusion', 'Combining multiple signals for a more reliable reading.'],
  ['Speed estimation', 'Timing across sensor nodes to estimate vehicle speed.'],
  ['Traffic intelligence', 'Turning counts and speeds into density and congestion states.'],
  ['Adaptive signals', 'Signal timing that responds to the current traffic state.'],
];

export default function Technology() {
  return (
    <section id="technology" className="up-section">
      <p className="up-eyebrow rv">Technology</p>
      <h2 className="rv">The building blocks</h2>
      <div className="up-grid g4">
        {TECH.map(([t, d], i) => (
          <article key={t} className="up-card up-glow rv" style={{ '--i': i % 4 }}>
            <span className="up-icon" /><h3>{t}</h3><p>{d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}