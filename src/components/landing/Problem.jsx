const ITEMS = [
  ['01', 'Camera dependence', 'Conventional monitoring leans on cameras and heavy roadside infrastructure.'],
  ['02', 'Power & maintenance', 'Constant power draw and upkeep make large-scale coverage costly.'],
  ['03', 'Limited adaptability', 'Fixed-timing signals cannot react to real-time conditions.'],
  ['04', 'Emergency delays', 'Prioritizing ambulances and fire trucks through congestion is still difficult.'],
];

export default function Problem() {
  return (
    <section id="overview" className="up-section">
      <p className="up-eyebrow rv">The Problem</p>
      <h2 className="rv">Roads are busy. Our understanding of them isn't.</h2>
      <div className="up-grid g4">
        {ITEMS.map(([n, t, d], i) => (
          <article key={n} className="up-card rv" style={{ '--i': i }}>
            <span className="up-num">{n}</span><h3>{t}</h3><p>{d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}