const FLOW = ['Smart Pavement', 'Sensing', 'Edge Processing', 'Traffic Intelligence', 'Adaptive Signals'];

export default function Solution() {
  return (
    <section className="up-section">
      <p className="up-eyebrow rv">The Solution</p>
      <h2 className="rv">The road itself becomes the sensor.</h2>
      <p className="up-lead rv">A camera-less concept: sensing built into the pavement, with decisions made at the edge.</p>
      <ol className="up-flow">
        {FLOW.map((s, i) => (
          <li key={s} className="rv" style={{ '--i': i }}><span>{i + 1}</span>{s}</li>
        ))}
      </ol>
    </section>
  );
}