import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useGenerator from "../hooks/useGenerator";

const TYPES   = ["users", "addresses", "companies", "products", "orders"];
const LOCALES = [
  { value: "en",    label: "English" },
  { value: "de",    label: "German" },
  { value: "fr",    label: "French" },
  { value: "es",    label: "Spanish" },
  { value: "ja",    label: "Japanese" },
  { value: "zh_CN", label: "Chinese" },
  { value: "pt_BR", label: "Portuguese (BR)" },
  { value: "ru",    label: "Russian" },
];
const TYPE_INFO = {
  users:     "Generates realistic user profiles including name, email, phone, username, job title, and birthdate.",
  addresses: "Generates street addresses, cities, states, zip codes, countries, and geo-coordinates.",
  companies: "Generates company names, catch phrases, industry, contact details, employee count, and founding year.",
  products:  "Generates product names, descriptions, SKUs, prices, stock levels, categories, and ratings.",
  orders:    "Generates order records with order IDs, customers, products, totals, status, and dates.",
};

/**
 * Generator Feature — Pages Layer
 * Only imports from sibling hooks/. No direct Redux or API access.
 */
const GeneratorPage = () => {
  const [searchParams] = useSearchParams();
  const { form, records, columns, isLoading, error, savedId, warning, handleChange, updateField, generate } = useGenerator();

  useEffect(() => {
    const t = searchParams.get("type");
    if (t && TYPES.includes(t)) updateField("type", t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Generator</h1>
        <p>Configure and generate fake data records</p>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          <div className="card-title">Configuration</div>

          <div className="form-group">
            <label className="form-label">Data Type</label>
            <select name="type" className="form-control" value={form.type} onChange={handleChange}>
              {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Number of Records</label>
            <input name="count" type="number" min={1} max={1000} className="form-control" value={form.count} onChange={handleChange} />
            <span className="text-muted text-sm" style={{ marginTop: 4, display: "block" }}>Max 1,000 records</span>
          </div>

          <div className="form-group">
            <label className="form-label">Locale / Language</label>
            <select name="locale" className="form-control" value={form.locale} onChange={handleChange}>
              {LOCALES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Dataset Name (for saving)</label>
            <input name="name" type="text" className="form-control" placeholder={`e.g. ${form.type}_test_set`} value={form.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--text-muted)" }}>
              <input name="save" type="checkbox" checked={form.save} onChange={handleChange} style={{ width: 15, height: 15 }} />
              Save to History (requires MongoDB)
            </label>
          </div>

          {error   && <div className="alert alert-error">{error}</div>}
          {warning && <div className="alert alert-error">⚠️ {warning}</div>}
          {savedId && <div className="alert alert-success">✅ Dataset saved to history!</div>}

          <button className="btn btn-primary w-full" onClick={generate} disabled={isLoading}>
            {isLoading ? "Generating..." : "⚡ Generate Data"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-title">About {form.type}</div>
            <p className="text-muted text-sm" style={{ lineHeight: 1.7 }}>{TYPE_INFO[form.type]}</p>
          </div>
          <div className="card">
            <div className="card-title">Record Count</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "var(--primary)" }}>{records.length > 0 ? records.length : form.count}</div>
            <div className="text-muted text-sm" style={{ marginTop: 4 }}>{records.length > 0 ? "Generated records" : "Will be generated"}</div>
          </div>
        </div>
      </div>

      {records.length > 0 && (
        <div className="card mt-6">
          <div className="flex-between mb-4">
            <div className="card-title" style={{ margin: 0 }}>Results — {records.length} {form.type}</div>
            <span className="badge badge-blue">{form.locale}</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>
                {records.map((row, i) => (
                  <tr key={i}>{columns.map((c) => <td key={c} title={String(row[c] ?? "")}>{String(row[c] ?? "")}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratorPage;
