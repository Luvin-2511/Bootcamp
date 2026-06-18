import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

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

function AnimatedBackground() {
  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="grid-overlay" />
    </div>
  );
}

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

export default function Home() {
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState("beginner");
  const [goal, setGoal] = useState("job");
  const [timeframe, setTimeframe] = useState("3");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    const systemPrompt = `You are an expert learning path architect. Your job is to generate comprehensive, structured learning roadmaps for technologies and skills. Always respond with valid JSON only, no markdown fences, no extra text.

The JSON structure must be:
{
  "title": "Complete title for the roadmap",
  "skill": "skill name",
  "description": "2-3 sentence overview of what this roadmap covers",
  "totalDuration": "estimated total time (e.g., '6 months')",
  "difficulty": "beginner|intermediate|advanced",
  "tags": ["tag1", "tag2", "tag3"],
  "phases": [
    {
      "id": "phase-1",
      "title": "Phase title",
      "duration": "X weeks",
      "description": "What this phase covers",
      "color": "#hexcolor",
      "nodes": [
        {
          "id": "node-1-1",
          "title": "Topic title",
          "type": "core|optional|project|milestone",
          "status": "locked|available|in-progress|done",
          "duration": "X hours",
          "description": "Brief description",
          "resources": [
            { "type": "video|article|book|course|docs", "title": "Resource title", "url": "#" }
          ],
          "skills": ["skill1", "skill2"],
          "prerequisites": []
        }
      ]
    }
  ],
  "careerOutcomes": ["Outcome 1", "Outcome 2", "Outcome 3"],
  "nextSteps": ["Next step 1", "Next step 2"]
}

Generate 3-5 phases, each with 3-6 nodes. Make it specific, practical, and actionable.`;

    const userPrompt = `Create a detailed learning roadmap for:
- Skill/Technology: ${skillInput}
- Current Experience Level: ${experience}
- Learning Goal: ${goal}
- Available Timeframe: ${timeframe} months

Make the phases flow logically from foundations to advanced topics. Use varied node types (core, optional, project, milestone). For the color field in each phase, use distinct hex colors that progress from cool (blues/purples) to warm (greens/amber) across phases. The first node in phase 1 should have status "available", all others "locked".`;

    const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;
    
    console.log(import.meta.env.VITE_MISTRAL_API_KEY);
    try {
      const response = await fetch(
        "https://api.mistral.ai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${MISTRAL_API_KEY}`,
          },
          body: JSON.stringify({
            model: "mistral-large-latest",
            temperature: 0.7,
            response_format: {
              type: "json_object",
            },
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: userPrompt,
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(
          errBody?.message ||
            errBody?.error?.message ||
            `API Error: ${response.status}`,
        );
      }

      const data = await response.json();

      const content = data.choices?.[0]?.message?.content;

      const parsed =
        typeof content === "string" ? JSON.parse(content) : content;

      navigate("/roadmap", {
        state: {
          ...parsed,
          experience,
          goal,
          timeframe,
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error(err);

      setError(
        err.message?.includes("401")
          ? "Invalid Mistral API key."
          : "Failed to generate roadmap. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="home-page">
      <AnimatedBackground />

      <header className="home-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">PathForge</span>
          </div>
          <nav className="header-nav">
            <a href="#how" className="nav-link">
              How it works
            </a>
            <a href="#examples" className="nav-link">
              Examples
            </a>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <FloatingNodes />
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" />
              AI-Powered Learning Paths
            </div>
            <h1 className="hero-title">
              Build your path to
              <span className="title-highlight"> mastery</span>
            </h1>
            <p className="hero-subtitle">
              Enter any skill or technology and get a personalized, step-by-step
              learning roadmap — complete with resources, milestones, and career
              outcomes.
            </p>
          </div>
        </section>

        <section className="builder-section" id="builder">
          <div className="builder-card">
            <div className="builder-header">
              <h2 className="builder-title">Create Your Roadmap</h2>
              <p className="builder-desc">
                Tell us what you want to learn and we'll build the path.
              </p>
            </div>

            <div className="form-body">
              {/* Skill Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="skill-input">
                  What do you want to learn?
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
                <span className="quick-label">Popular:</span>
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
                  <label className="form-label">Your experience level</label>
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
                  <label className="form-label">Learning goal</label>
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
                    <span>Forging your path...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">◈</span>
                    <span>Generate Learning Roadmap</span>
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
                    Analyzing skill tree and building your personalized path...
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="how-section" id="how">
          <h2 className="section-title">How PathForge works</h2>
          <div className="steps-grid">
            {[
              {
                step: "01",
                title: "Enter your skill",
                desc: "Type any technology, language, framework, or domain you want to master.",
                icon: "🎯",
              },
              {
                step: "02",
                title: "Set your context",
                desc: "Tell us your current level, your goal, and how much time you have.",
                icon: "⚙️",
              },
              {
                step: "03",
                title: "Get your roadmap",
                desc: "AI generates a personalized, phase-by-phase path with curated resources.",
                icon: "🗺️",
              },
              {
                step: "04",
                title: "Track progress",
                desc: "Mark topics complete, explore resources, and stay on track.",
                icon: "📈",
              },
            ].map((s) => (
              <div className="step-card" key={s.step}>
                <div className="step-number">{s.step}</div>
                <div className="step-icon">{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>
          Built with PathForge · Powered by Claude · Your data stays with you
        </p>
      </footer>
    </div>
  );
}
