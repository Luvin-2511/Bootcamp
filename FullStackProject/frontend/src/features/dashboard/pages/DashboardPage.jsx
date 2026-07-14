import { Link } from "react-router-dom";
import useHistory from "../../history/hooks/useHistory";
import Skeleton from "../../../components/Skeleton";

const TYPE_ICONS = { users: "👤", addresses: "📍", companies: "🏢", products: "📦", orders: "🛒" };

/**
 * Dashboard Feature — Pages Layer
 * Only imports from history hooks/ (cross-feature read-only).
 */
const DashboardPage = () => {
  const { datasets, isListLoading, totalRecords, uniqueTypes, typeCounts } = useHistory({ autoFetch: true });

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your generated datasets</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🗄️</div>
          <div className="stat-label">Total Datasets</div>
          <div className="stat-value">{isListLoading ? "—" : datasets.length}</div>
          <div className="stat-sub">Saved in DB</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-label">Total Records</div>
          <div className="stat-value">{isListLoading ? "—" : totalRecords.toLocaleString()}</div>
          <div className="stat-sub">Across all datasets</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔖</div>
          <div className="stat-label">Data Types</div>
          <div className="stat-value">{isListLoading ? "—" : uniqueTypes.length}</div>
          <div className="stat-sub">Unique types used</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Type Breakdown</div>
          {isListLoading ? <Skeleton type="text" count={4} />
            : Object.keys(typeCounts).length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📂</div><p>No datasets saved yet. Go to Generator to create one.</p></div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(typeCounts).map(([type, count]) => (
                  <div key={type} className="flex-between" style={{ padding: "8px 12px", background: "var(--surface2)", borderRadius: "var(--radius)" }}>
                    <span>{TYPE_ICONS[type] || "📄"} {type}</span>
                    <span className="badge badge-blue">{count} dataset{count > 1 ? "s" : ""}</span>
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="card">
          <div className="card-title">Recent Datasets</div>
          {isListLoading ? <Skeleton type="text" count={4} />
            : datasets.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🕐</div><p>No history yet.</p></div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {datasets.slice(0, 5).map((d) => (
                  <div key={d._id} className="flex-between" style={{ padding: "8px 12px", background: "var(--surface2)", borderRadius: "var(--radius)" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{d.name}</div>
                      <div className="text-muted text-sm">{d.count} records · {d.type}</div>
                    </div>
                    <span className="badge badge-gray">{d.exportFormat}</span>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-title">Quick Start</div>
        <div className="grid-3" style={{ marginTop: 8 }}>
          {Object.keys(TYPE_ICONS).map((type) => (
            <Link key={type} to={`/generator?type=${type}`} style={{ textDecoration: "none" }}>
              <div className="stat-card" style={{ cursor: "pointer", transition: "border-color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}>
                <div className="stat-icon">{TYPE_ICONS[type]}</div>
                <div style={{ fontWeight: 600, fontSize: 13, marginTop: 4, textTransform: "capitalize" }}>{type}</div>
                <div className="text-muted text-sm" style={{ marginTop: 2 }}>Generate {type}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
