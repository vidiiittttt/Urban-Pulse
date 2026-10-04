const FEATURES = [
  'Camera-less concept', 'Vehicle classification', 'Speed estimation', 'Traffic density',
  'Congestion detection', 'Adaptive signal control', 'Emergency vehicle priority', 'Cloud / dashboard telemetry concept',
];

export default function Features() {
  return (
    <section className="up-section">
      <p className="up-eyebrow rv">Features</p>
      <h2 className="rv">What the prototype demonstrates</h2>
      <ul className="up-feats">
        {FEATURES.map((f, i) => <li key={f} className="rv" style={{ '--i': i % 4 }}><i />{f}</li>)}
      </ul>
    </section>
  );
}