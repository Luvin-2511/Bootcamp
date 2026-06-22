import { useState, useRef, useEffect } from "react";

const POPULAR_SKILLS = [
  { label: "React Developer", icon: "⚛️", color: "#61DAFB" },
  { label: "Machine Learning", icon: "🤖", color: "#FF6B6B" },
  { label: "DevOps Engineer", icon: "🔧", color: "#F59E0B" },
  { label: "iOS Development", icon: "📱", color: "#007AFF" },
  { label: "Data Science", icon: "📊", color: "#10D9A4" },
  { label: "Blockchain", icon: "⛓️", color: "#7C3AED" },
  { label: "Rust Programming", icon: "🦀", color: "#CE422B" },
  { label: "Cloud Architecture", icon: "☁️", color: "#4F8EF7" },
];

const EXPERIENCE_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    desc: "Little to no experience",
    icon: "🌱",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    desc: "Some foundational knowledge",
    icon: "🚀",
  },
  {
    value: "advanced",
    label: "Advanced",
    desc: "Solid understanding, want depth",
    icon: "⚡",
  },
];

const LEARNING_GOALS = [
  { value: "job", label: "Get a Job", icon: "💼" },
  { value: "project", label: "Build a Project", icon: "🛠️" },
  { value: "academic", label: "Academic / Research", icon: "🎓" },
  { value: "hobby", label: "Personal Interest", icon: "❤️" },
];

export default function RoadmapForm({ onSubmit, loading }) {
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState("beginner");
  const [goal, setGoal] = useState("job");
  const [timeframe, setTimeframe] = useState("3");
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    setCharCount(skillInput.length);
  }, [skillInput]);

  const handleQuickSelect = (skillLabel) => {
    setSkillInput(skillLabel);
    inputRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!skillInput.trim()) {
      setError("Please enter a skill or technology to learn.");
      inputRef.current?.focus();
      return;
    }
    if (skillInput.trim().length < 2) {
      setError("Please be a bit more specific.");
      return;
    }

    setError("");
    onSubmit({
      skillInput,
      experience,
      goal,
      timeframe,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <section className="form-section">
      <div className="form-container">
        <div className="form-header">
          <h2>Start Learning Today</h2>
          <p>Tell us what you want to master and we'll map the journey</p>
        </div>

        <div className="form-card">
          <div className="form-body">
            {/* Skill Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="skill-input">
                What skill do you want to learn?
                <span className="label-required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🎯</span>
                <input
                  ref={inputRef}
                  id="skill-input"
                  className={`skill-input ${error ? "input-error" : ""}`}
                  type="text"
                  placeholder="e.g. React, Machine Learning, DevOps..."
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  maxLength={80}
                  disabled={loading}
                />
                <span className="char-count">{charCount}/80</span>
              </div>
              {error && (
                <p className="error-msg" role="alert">
                  {error}
                </p>
              )}
            </div>

            {/* Quick Select */}
            <div className="quick-select">
              <span className="quick-label">Popular choices:</span>
              <div className="quick-chips">
                {POPULAR_SKILLS.map((s) => (
                  <button
                    key={s.label}
                    className="quick-chip"
                    onClick={() => handleQuickSelect(s.label)}
                    style={{ "--chip-color": s.color }}
                    disabled={loading}
                  >
                    <span>{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              {/* Experience Level */}
              <div className="form-group form-group-half">
                <label className="form-label">Your level</label>
                <div className="option-group">
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <button
                      key={lvl.value}
                      className={`option-btn ${experience === lvl.value ? "option-active" : ""}`}
                      onClick={() => setExperience(lvl.value)}
                      disabled={loading}
                    >
                      <span className="option-icon">{lvl.icon}</span>
                      <span className="option-label">{lvl.label}</span>
                      <span className="option-desc">{lvl.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Goal */}
              <div className="form-group form-group-half">
                <label className="form-label">Your goal</label>
                <div className="goal-group">
                  {LEARNING_GOALS.map((g) => (
                    <button
                      key={g.value}
                      className={`goal-btn ${goal === g.value ? "goal-active" : ""}`}
                      onClick={() => setGoal(g.value)}
                      disabled={loading}
                    >
                      <span>{g.icon}</span>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeframe */}
            <div className="form-group">
              <label className="form-label">
                Available timeframe:{" "}
                <span className="timeframe-val">{timeframe} months</span>
              </label>
              <div className="slider-wrapper">
                <span className="slider-label">1 mo</span>
                <input
                  type="range"
                  className="timeframe-slider"
                  min="1"
                  max="18"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  disabled={loading}
                />
                <span className="slider-label">18 mo</span>
              </div>
              <div className="slider-ticks">
                {[1, 3, 6, 9, 12, 18].map((v) => (
                  <button
                    key={v}
                    className={`tick-btn ${timeframe == v ? "tick-active" : ""}`}
                    onClick={() => setTimeframe(String(v))}
                    disabled={loading}
                  >
                    {v}m
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              className={`generate-btn ${loading ? "btn-loading" : ""}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  <span>Creating your path...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  <span>Generate Roadmap</span>
                  <span className="btn-shortcut">⌘↵</span>
                </>
              )}
            </button>

            {loading && (
              <div className="loading-state">
                <div className="loading-bar">
                  <div className="loading-fill" />
                </div>
                <p className="loading-text">
                  Crafting your personalized learning path...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
