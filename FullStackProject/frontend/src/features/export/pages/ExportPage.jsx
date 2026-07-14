import useExport from "../hooks/useExport";

const TYPES   = ["users", "addresses", "companies", "products", "orders"];
const FORMATS = ["json", "csv", "excel"];
const LOCALES = [
  { value: "en", label: "English" }, { value: "de", label: "German" },
  { value: "fr", label: "French" },  { value: "es", label: "Spanish" },
  { value: "ja", label: "Japanese" },{ value: "zh_CN", label: "Chinese" },
  { value: "pt_BR", label: "Portuguese (BR)" }, { value: "ru", label: "Russian" },
];
const FORMAT_INFO = {
  json:  { icon: "📄", desc: "JavaScript Object Notation — great for APIs and developers." },
  csv:   { icon: "📊", desc: "Comma-separated values — works with Excel, Google Sheets." },
  excel: { icon: "📗", desc: "Microsoft Excel format (.xlsx) — native spreadsheet support." },
};

/**
 * Export Feature — Pages Layer
 * Only imports from sibling hooks/.
 */
const ExportPage = () => {
  const { form, isLoading, isSucceeded, error, lastExport, handleChange, doExport } = useExport();

  return (
    <div>
      <div className="page-header">
        <h1>Export</h1>
        <p>Download generated data in your preferred format</p>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          <div className="card-title">Export Configuration</div>

          <div className="form-group">
            <label className="form-label">Data Type</label>
            <select name="type" className="form-control" value={form.type} onChange={handleChange}>
              {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Number of Records</label>
            <input name="count" type="number" min={1} max={1000} className="form-control" value={form.count} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Locale</label>
            <select name="locale" className="form-control" value={form.locale} onChange={handleChange}>
              {LOCALES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Export Format</label>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              {FORMATS.map((f) => (
                <label key={f} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 8px", borderRadius: "var(--radius)", border: `2px solid ${form.format === f ? "var(--primary)" : "var(--border)"}`, cursor: "pointer", background: form.format === f ? "rgba(79,110,247,0.08)" : "var(--surface2)", transition: "all 0.15s", fontSize: 12, fontWeight: 600, color: form.format === f ? "var(--primary)" : "var(--text-muted)" }}>
                  <input type="radio" name="format" value={f} checked={form.format === f} onChange={handleChange} style={{ display: "none" }} />
                  <span style={{ fontSize: 22 }}>{FORMAT_INFO[f].icon}</span>
                  {f.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          {error      && <div className="alert alert-error">{error}</div>}
          {isSucceeded && lastExport && <div className="alert alert-success">✅ Downloaded {form.count} {form.type} as .{lastExport.format === "excel" ? "xlsx" : lastExport.format}</div>}

          <button className="btn btn-success w-full" onClick={doExport} disabled={isLoading}>
            {isLoading ? "Exporting..." : `📤 Export as ${form.format.toUpperCase()}`}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-title">Selected Format</div>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{FORMAT_INFO[form.format].icon}</div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, textTransform: "uppercase" }}>{form.format}</div>
            <p className="text-muted text-sm" style={{ lineHeight: 1.7 }}>{FORMAT_INFO[form.format].desc}</p>
          </div>
          <div className="card">
            <div className="card-title">Export Summary</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[{ label: "Type", value: form.type }, { label: "Records", value: form.count }, { label: "Locale", value: form.locale }, { label: "Format", value: form.format.toUpperCase() }].map((item) => (
                <div key={item.label} className="flex-between" style={{ fontSize: 13 }}><span className="text-muted">{item.label}</span><span style={{ fontWeight: 600 }}>{item.value}</span></div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-title">All Formats</div>
            {FORMATS.map((f) => <div key={f} className="flex-between" style={{ marginBottom: 10, fontSize: 13 }}><span>{FORMAT_INFO[f].icon} {f.toUpperCase()}</span><span className="text-muted text-sm">{FORMAT_INFO[f].desc.slice(0, 36)}…</span></div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
