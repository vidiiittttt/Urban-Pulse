const STEPS = ['Vehicle', 'Smart Pavement', 'Simulated Sensors', 'Signal Processing', 'Vehicle Classification',
  'Speed Estimation', 'Traffic Density', 'Congestion Detection', 'Adaptive Traffic Signal'];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="up-section">
      <p className="up-eyebrow rv">How It Works</p>
      <h2 className="rv">From wheel to signal, in nine steps.</h2>
      <ol className="up-pipe">
        {STEPS.map((s, i) => (
          <li key={s} style={{ '--i': i }}><span className="dot">{i + 1}</span><span className="lbl">{s}</span></li>
        ))}
      </ol>
    </section>
  );
}