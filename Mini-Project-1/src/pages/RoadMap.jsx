import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/roadmap.css";

/* ─── Helpers ───────────────────────────────────────── */
const NODE_TYPE_META = {
  core: { label: "Core", color: "#4F8EF7", icon: "◆" },
  optional: { label: "Optional", color: "#94a3b8", icon: "◇" },
  project: { label: "Project", color: "#10D9A4", icon: "⬡" },
  milestone: { label: "Milestone", color: "#F59E0B", icon: "★" },
};

const RESOURCE_ICONS = {
  video: "▶",
  article: "📄",
  book: "📚",
  course: "🎓",
  docs: "📖",
};

const STATUS_META = {
  done: { label: "Completed", color: "#10D9A4", icon: "✓" },
  "in-progress": { label: "In Progress", color: "#4F8EF7", icon: "◉" },
  available: { label: "Available", color: "#F59E0B", icon: "○" },
  locked: { label: "Locked", color: "#4a5568", icon: "🔒" },
};

function useNodeStatuses(initialPhases) {
  const [statuses, setStatuses] = useState(() => {
    const map = {};
    initialPhases?.forEach((phase) => {
      phase.nodes?.forEach((node) => {
        map[node.id] = node.status || "locked";
      });
    });
    return map;
  });

  const advance = useCallback((nodeId) => {
    setStatuses((prev) => {
      const curr = prev[nodeId];
      const next =
        curr === "available"
          ? "in-progress"
          : curr === "in-progress"
            ? "done"
            : curr === "done"
              ? "available"
              : curr;
      return { ...prev, [nodeId]: next };
    });
  }, []);

  return [statuses, advance];
}

/* ─── Progress Bar ─────────────────────────────────── */
function ProgressRing({ pct, size = 56, stroke = 5 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="progress-ring">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--bg-surface)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--mint-success)"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--text-primary)"
        fontSize="13"
        fontWeight="700"
        fontFamily="var(--font-display)"
      >
        {pct}%
      </text>
    </svg>
  );
}

/* ─── Node Card ─────────────────────────────────────── */
function NodeCard({ node, status, onStatusChange, phaseColor }) {
  const [expanded, setExpanded] = useState(false);
  const meta = NODE_TYPE_META[node.type] || NODE_TYPE_META.core;
  const statusMeta = STATUS_META[status] || STATUS_META.locked;
  const isLocked = status === "locked";

  return (
    <div
      className={`node-card node-status-${status}`}
      style={{ "--phase-color": phaseColor, "--node-color": meta.color }}
    >
      <div
        className="node-header"
        onClick={() => !isLocked && setExpanded((e) => !e)}
        role="button"
        tabIndex={isLocked ? -1 : 0}
        onKeyDown={(e) => {
          if (!isLocked && (e.key === "Enter" || e.key === " "))
            setExpanded((v) => !v);
        }}
        aria-expanded={expanded}
      >
        <div className="node-header-left">
          <span className="node-type-badge" style={{ color: meta.color }}>
            {meta.icon}
          </span>
          <div className="node-title-group">
            <h4 className="node-title">{node.title}</h4>
            <div className="node-meta-row">
              <span className="node-type-label" style={{ color: meta.color }}>
                {meta.label}
              </span>
              {node.duration && (
                <>
                  <span className="meta-dot">·</span>
                  <span className="node-duration">⏱ {node.duration}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="node-header-right">
          <button
            className="status-pill"
            style={{
              "--s-color": statusMeta.color,
              "--s-bg": `${statusMeta.color}18`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isLocked) onStatusChange(node.id);
            }}
            disabled={isLocked}
            title={isLocked ? "Complete prerequisites first" : "Update status"}
          >
            <span>{statusMeta.icon}</span>
            {statusMeta.label}
          </button>
          {!isLocked && (
            <span
              className={`expand-arrow ${expanded ? "expanded" : ""}`}
              aria-hidden="true"
            >
              ›
            </span>
          )}
        </div>
      </div>

      {expanded && !isLocked && (
        <div className="node-body">
          {node.description && (
            <p className="node-description">{node.description}</p>
          )}

          {node.skills && node.skills.length > 0 && (
            <div className="node-skills">
              {node.skills.map((s) => (
                <span key={s} className="skill-tag">
                  {s}
                </span>
              ))}
            </div>
          )}

          {node.resources && node.resources.length > 0 && (
            <div className="node-resources">
              <h5 className="resources-title">Resources</h5>
              <div className="resources-list">
                {node.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url || "#"}
                    className="resource-item"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => r.url === "#" && e.preventDefault()}
                  >
                    <span className="resource-icon">
                      {RESOURCE_ICONS[r.type] || "🔗"}
                    </span>
                    <div className="resource-info">
                      <span className="resource-title">{r.title}</span>
                      <span className="resource-type">{r.type}</span>
                    </div>
                    <span className="resource-arrow">→</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Phase Section ─────────────────────────────────── */
function PhaseSection({ phase, index, statuses, onStatusChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const nodes = phase.nodes || [];
  const done = nodes.filter((n) => statuses[n.id] === "done").length;
  const phasePct = nodes.length > 0 ? Math.round((done / nodes.length) * 100) : 0;

  return (
    <section
      className={`phase-section phase-index-${index}`}
      style={{ "--phase-color": phase.color || "#4F8EF7" }}
    >
      <div
        className="phase-header"
        onClick={() => setCollapsed((c) => !c)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setCollapsed((c) => !c);
        }}
      >
        <div className="phase-header-left">
          <div className="phase-marker">
            <span className="phase-num">{index + 1}</span>
          </div>
          <div>
            <h3 className="phase-title">{phase.title}</h3>
            <div className="phase-meta">
              {phase.duration && (
                <span className="phase-duration">⏱ {phase.duration}</span>
              )}
              <span className="phase-node-count">
                {nodes.length} topics · {done} done
              </span>
            </div>
          </div>
        </div>

        <div className="phase-header-right">
          <div className="phase-progress-bar">
            <div
              className="phase-progress-fill"
              style={{ width: `${phasePct}%` }}
            />
          </div>
          <span className="phase-pct">{phasePct}%</span>
          <span
            className={`phase-chevron ${collapsed ? "phase-collapsed" : ""}`}
          >
            ›
          </span>
        </div>
      </div>

      {phase.description && !collapsed && (
        <p className="phase-description">{phase.description}</p>
      )}

      {!collapsed && (
        <div className="nodes-grid">
          {nodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              status={statuses[node.id] || node.status || "locked"}
              onStatusChange={onStatusChange}
              phaseColor={phase.color || "#4F8EF7"}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Roadmap Summary ───────────────────────────────── */
function RoadmapSummary({ data, statuses }) {
  const allNodes = data.phases?.flatMap((p) => p.nodes || []) || [];
  const totalNodes = allNodes.length;
  const doneNodes = allNodes.filter((n) => statuses[n.id] === "done").length;
  const inProgressNodes = allNodes.filter(
    (n) => statuses[n.id] === "in-progress"
  ).length;
  const overallPct =
    totalNodes > 0 ? Math.round((doneNodes / totalNodes) * 100) : 0;

  return (
    <div className="roadmap-summary">
      <div className="summary-progress">
        <ProgressRing pct={overallPct} size={68} stroke={6} />
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-val" style={{ color: "var(--mint-success)" }}>
              {doneNodes}
            </span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-val" style={{ color: "var(--blue-primary)" }}>
              {inProgressNodes}
            </span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-item">
            <span className="stat-val" style={{ color: "var(--text-secondary)" }}>
              {totalNodes - doneNodes - inProgressNodes}
            </span>
            <span className="stat-label">Remaining</span>
          </div>
        </div>
      </div>

      <div className="summary-meta">
        <div className="meta-item">
          <span className="meta-icon">📅</span>
          <div>
            <span className="meta-label">Duration</span>
            <span className="meta-value">{data.totalDuration || "—"}</span>
          </div>
        </div>
        <div className="meta-item">
          <span className="meta-icon">🎯</span>
          <div>
            <span className="meta-label">Difficulty</span>
            <span className="meta-value" style={{ textTransform: "capitalize" }}>
              {data.difficulty || "—"}
            </span>
          </div>
        </div>
        <div className="meta-item">
          <span className="meta-icon">📚</span>
          <div>
            <span className="meta-label">Phases</span>
            <span className="meta-value">{data.phases?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Tags ──────────────────────────────────────────── */
function TagList({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="tag-list">
      {tags.map((t) => (
        <span key={t} className="tag">
          #{t}
        </span>
      ))}
    </div>
  );
}

/* ─── Career Outcomes ───────────────────────────────── */
function CareerOutcomes({ outcomes, nextSteps }) {
  if (!outcomes?.length && !nextSteps?.length) return null;
  return (
    <div className="outcomes-section">
      {outcomes?.length > 0 && (
        <div className="outcomes-card">
          <h3 className="outcomes-title">
            <span>💼</span> Career Outcomes
          </h3>
          <ul className="outcomes-list">
            {outcomes.map((o, i) => (
              <li key={i} className="outcome-item">
                <span className="outcome-dot" />
                {o}
              </li>
            ))}
          </ul>
        </div>
      )}
      {nextSteps?.length > 0 && (
        <div className="outcomes-card">
          <h3 className="outcomes-title">
            <span>🚀</span> What's Next
          </h3>
          <ul className="outcomes-list">
            {nextSteps.map((s, i) => (
              <li key={i} className="outcome-item">
                <span className="outcome-dot outcome-dot-purple" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─── Stars Background ───────────────────────────────── */
function RoadmapStars() {
  const stars = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      dur: `${2 + Math.random() * 4}s`,
      delay: `${Math.random() * 5}s`,
      size: Math.random() > 0.7 ? 3 : 2,
    })), []);
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }} aria-hidden="true">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="grid-overlay" />
      {stars.map(s => (
        <div key={s.id} className="star" style={{ top:s.top, left:s.left, width:s.size, height:s.size, '--dur':s.dur, '--delay':s.delay }} />
      ))}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────── */
export default function RoadMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  const [statuses, advanceStatus] = useNodeStatuses(data?.phases);
  const [activePhase, setActivePhase] = useState(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!data) navigate("/", { replace: true });
  }, [data, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Auto-highlight tab as user scrolls
  useEffect(() => {
    if (!data?.phases) return;
    const observers = [];
    data.phases.forEach((_, i) => {
      const el = document.getElementById(`phase-${i}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActivePhase(i); },
        { threshold: 0.25, rootMargin: '-80px 0px 0px 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [data]);

  if (!data) return null;

  const allNodes = data.phases?.flatMap((p) => p.nodes || []) || [];
  const totalNodes = allNodes.length;
  const doneNodes = allNodes.filter((n) => statuses[n.id] === "done").length;
  const overallPct = totalNodes > 0 ? Math.round((doneNodes / totalNodes) * 100) : 0;

  const scrollToPhase = (idx) => {
    const el = document.getElementById(`phase-${idx}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setActivePhase(idx);
  };

  return (
    <div className="roadmap-page" style={{ position: 'relative' }}>
      <RoadmapStars />
      {/* Sticky header */}
      <header className="roadmap-header" ref={headerRef}>
        <div className="roadmap-header-inner">
          <div className="roadmap-header-left">
            <button className="back-btn" onClick={() => navigate("/")} title="Back to home">
              ← Back
            </button>
            <div className="header-title-group">
              <span className="logo-icon-sm">◈</span>
              <span className="header-skill-name">{data.skill || data.title}</span>
            </div>
          </div>

          <div className="roadmap-header-right">
            <div className="header-progress">
              <div className="header-progress-bar">
                <div
                  className="header-progress-fill"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              <span className="header-progress-text">{overallPct}%</span>
            </div>
          </div>
        </div>

        {/* Phase nav tabs */}
        {data.phases?.length > 0 && (
          <div className="phase-tabs">
            {data.phases.map((phase, i) => (
              <button
                key={phase.id || i}
                className={`phase-tab ${activePhase === i ? "phase-tab-active" : ""}`}
                onClick={() => scrollToPhase(i)}
                style={{ "--tab-color": phase.color || "#4F8EF7" }}
              >
                <span className="tab-num">{i + 1}</span>
                {phase.title}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="roadmap-main">
        {/* Hero section */}
        <section className="roadmap-hero">
          <div className="roadmap-hero-inner">
            <div className="roadmap-hero-text">
              <h1 className="roadmap-title">{data.title || `${data.skill} Roadmap`}</h1>
              <p className="roadmap-description">{data.description}</p>
              <TagList tags={data.tags} />
            </div>
            <RoadmapSummary data={data} statuses={statuses} />
          </div>
        </section>

        {/* Legend */}
        <div className="legend-bar">
          <span className="legend-label">Node types:</span>
          {Object.entries(NODE_TYPE_META).map(([key, val]) => (
            <span key={key} className="legend-item" style={{ color: val.color }}>
              {val.icon} {val.label}
            </span>
          ))}
          <span className="legend-sep" />
          <span className="legend-label">Click nodes to expand · Click status to update</span>
        </div>

        {/* Phases */}
        <div className="phases-container">
          {data.phases?.map((phase, i) => (
            <div key={phase.id || i} id={`phase-${i}`}>
              <PhaseSection
                phase={phase}
                index={i}
                statuses={statuses}
                onStatusChange={advanceStatus}
              />
            </div>
          ))}
        </div>

        {/* Career outcomes */}
        <CareerOutcomes
          outcomes={data.careerOutcomes}
          nextSteps={data.nextSteps}
        />

        {/* Actions */}
        <div className="roadmap-actions">
          <button className="action-btn action-secondary" onClick={() => navigate("/")}>
            ← Build Another Roadmap
          </button>
          <button
            className="action-btn action-primary"
            onClick={() => window.print()}
          >
            🖨 Export Roadmap
          </button>
        </div>
      </main>
    </div>
  );
}