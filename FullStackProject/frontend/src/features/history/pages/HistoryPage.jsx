import useHistory from "../hooks/useHistory";
import useExport from "../../export/hooks/useExport";
import Skeleton from "../../../components/Skeleton";

const TYPE_ICONS = { users: "👤", addresses: "📍", companies: "🏢", products: "📦", orders: "🛒" };

/**
 * History Feature — Pages Layer
 * Only imports from sibling hooks/ (and cross-feature export/hooks/).
 */
const HistoryPage = () => {
  const { datasets, selected, selectedColumns, isListLoading, isDetailLoading, error, refresh, viewDataset, removeDataset, downloadDataset } = useHistory({ autoFetch: true });
  const { isLoading: isExporting } = useExport();

  return (
    <div>
      <div className="page-header">
        <h1>History</h1>
        <p>Browse and manage your saved datasets</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid-sidebar" style={{ alignItems: "start" }}>
        {/* List */}
        <div className="card">
          <div className="flex-between mb-4">
            <div className="card-title" style={{ margin: 0 }}>Saved Datasets ({datasets.length})</div>
            <button className="btn btn-secondary btn-sm" onClick={refresh} disabled={isListLoading}>🔄 Refresh</button>
          </div>

          {isListLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
               <Skeleton type="box" style={{ height: 80 }} count={4} />
            </div>
          ) : datasets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🕐</div>
              <p>No saved datasets found.</p>
              <p>Use the Generator and check "Save to History".</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {datasets.map((d) => (
                <div
                  key={d._id}
                  onClick={() => viewDataset(d._id)}
                  style={{ padding: "16px", background: selected?._id === d._id ? "rgba(0,229,255,0.15)" : "var(--background)", borderRadius: "var(--radius)", border: selected?._id === d._id ? "3px solid var(--accent)" : "3px solid var(--border)", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", gap: 6, color: "var(--accent)", wordBreak: "break-all" }}>{TYPE_ICONS[d.type] || "📄"} {d.name}</div>
                      <div className="text-muted text-sm" style={{ marginTop: 3 }}>{d.count} records · {d.type} · {d.locale}</div>
                      <div className="text-sm" style={{ marginTop: 2, color: "var(--text)" }}>{new Date(d.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button className="btn btn-secondary btn-sm" disabled={isExporting} onClick={(e) => { e.stopPropagation(); downloadDataset(d, "json"); }}>JSON</button>
                      <button className="btn btn-secondary btn-sm" disabled={isExporting} onClick={(e) => { e.stopPropagation(); downloadDataset(d, "csv"); }}>CSV</button>
                      <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); removeDataset(d._id); }}>✕ Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="card">
          <div className="card-title">Dataset Preview</div>
          {isDetailLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
               <Skeleton type="title" />
               <Skeleton type="box" style={{ height: 300 }} />
            </div>
          ) : !selected ? (
            <div className="empty-state"><div className="empty-icon">👈</div><p>Click a dataset to preview its data.</p></div>
          ) : (
            <>
              <div style={{ marginBottom: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span className="badge badge-blue">{selected.type}</span>
                <span className="badge badge-gray">{selected.count} records</span>
                <span className="badge badge-gray">{selected.locale}</span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                  {["json", "csv", "excel"].map((f) => (
                    <button key={f} className="btn btn-secondary btn-sm" disabled={isExporting} onClick={() => downloadDataset(selected, f)}>{f.toUpperCase()}</button>
                  ))}
                </div>
              </div>
              <div className="table-wrap" style={{ maxHeight: 420, overflowY: "auto" }}>
                <table>
                  <thead><tr>{selectedColumns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
                  <tbody>
                    {selected.data.slice(0, 50).map((row, i) => (
                      <tr key={i}>{selectedColumns.map((c) => <td key={c} title={String(row[c] ?? "")}>{String(row[c] ?? "")}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selected.data.length > 50 && (
                <div className="text-muted text-sm mt-4" style={{ textAlign: "center" }}>Showing 50 of {selected.data.length} records. Export to see all.</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
