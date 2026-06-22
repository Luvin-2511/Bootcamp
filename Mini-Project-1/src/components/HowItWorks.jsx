export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Enter Your Skill",
      desc: "Type any technology, language, or domain you want to master.",
      icon: "📝",
      color: "#4F8EF7",
    },
    {
      step: "02",
      title: "Customize Your Path",
      desc: "Set your level, goal, and how much time you have to commit.",
      icon: "⚙️",
      color: "#7C3AED",
    },
    {
      step: "03",
      title: "Get Your Roadmap",
      desc: "Receive a detailed, personalized learning path with resources.",
      icon: "🗺️",
      color: "#10D9A4",
    },
    {
      step: "04",
      title: "Track & Learn",
      desc: "Mark progress, explore resources, and stay motivated.",
      icon: "🏁",
      color: "#F59E0B",
    },
  ];

  return (
    <section className="how-section">
      <div className="how-container">
        <div className="how-header">
          <h2>How It Works</h2>
          <p>From idea to mastery in 4 simple steps</p>
        </div>
        <div className="steps-grid">
          {steps.map((s, idx) => (
            <div
              key={s.step}
              className="step-card"
              style={{
                "--step-delay": `${idx * 0.1}s`,
                "--step-color": s.color,
              }}
            >
              <div className="step-number">{s.step}</div>
              <div className="step-icon">{s.icon}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
