import { NavLink } from "react-router-dom";

const NAV = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/generator", label: "Generator", icon: "⚡" },
  { to: "/export", label: "Export", icon: "📤" },
  { to: "/history", label: "History", icon: "🕓" },
];

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-logo">
      <h2>FakeGen</h2>
      <span>Fake Data Generator</span>
    </div>
    <nav className="sidebar-nav">
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.to === "/"}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <span className="nav-icon">{n.icon}</span>
          {n.label}
        </NavLink>
      ))}
    </nav>
    <div style={{ padding: "0 20px", color: "var(--text-subtle)", fontSize: 11 }}>
      Powered by Faker.js
    </div>
  </aside>
);

export default Sidebar;
