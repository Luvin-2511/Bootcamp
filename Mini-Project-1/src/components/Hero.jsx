function FloatingNodes() {
  const nodes = Array.from({ length: 7 }, (_, i) => i);
  return (
    <div className="floating-nodes" aria-hidden="true">
      {nodes.map((n) => (
        <div key={n} className={`floating-node fn-${n}`} />
      ))}
      <svg className="floating-connections" viewBox="0 0 600 300">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F8EF7" stopOpacity="0" />
            <stop offset="50%" stopColor="#4F8EF7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 80 80 Q 200 40 320 120 T 520 100"
          stroke="url(#lineGrad)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 60 180 Q 180 220 300 160 T 540 200"
          stroke="url(#lineGrad)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero-section">
      <FloatingNodes />
      <div className="hero-content">
        <div className="hero-label">
          <span className="label-dot"></span>
          <span>AI-Powered Learning Paths</span>
        </div>

        <h1 className="hero-title">
          Master Any Skill,
          <br />
          <span className="title-gradient">Your Way</span>
        </h1>

        <p className="hero-subtitle">
          Define your learning goal and get a personalized roadmap with curated resources,
          milestones, and real career outcomes. No fluff, just the path forward.
        </p>

        <div className="hero-features">
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span>Instant Roadmaps</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span>Tailored to You</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span>Track Progress</span>
          </div>
        </div>
      </div>
    </section>
  );
}
