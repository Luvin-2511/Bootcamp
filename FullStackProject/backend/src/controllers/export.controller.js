import Dataset from "../models/dataset.model.js";
import * as XLSX from "xlsx";
import {
  generateUsers,
  generateAddresses,
  generateCompanies,
  generateProducts,
  generateOrders,
} from "../utils/faker.utils.js";

const generators = {
  users: generateUsers,
  addresses: generateAddresses,
  companies: generateCompanies,
  products: generateProducts,
  orders: generateOrders,
};

const flattenData = (data) =>
  data.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([k, v]) => [k, typeof v === "object" && v !== null ? JSON.stringify(v) : v])
    )
  );

export const exportData = async (req, res) => {
  try {
    const { format = "json", type = "users", count = 10, locale = "en", datasetId } = req.body;

    let data;

    // Export from saved dataset or generate fresh
    if (datasetId) {
      const dataset = await Dataset.findById(datasetId);
      if (!dataset) return res.status(404).json({ error: "Dataset not found" });
      data = dataset.data;
    } else {
      if (!generators[type]) return res.status(400).json({ error: "Unknown type" });
      data = generators[type](Math.min(parseInt(count) || 10, 1000), locale);
    }

    const flat = flattenData(data);

    if (format === "json") {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="${type}_data.json"`);
      return res.send(JSON.stringify(data, null, 2));
    }

    if (format === "csv") {
      if (!flat.length) return res.status(400).json({ error: "No data" });
      const headers = Object.keys(flat[0]);
      const rows = flat.map((row) => headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","));
      const csv = [headers.join(","), ...rows].join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${type}_data.csv"`);
      return res.send(csv);
    }

    if (format === "excel") {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(flat);
      XLSX.utils.book_append_sheet(wb, ws, type);
      const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${type}_data.xlsx"`);
      return res.send(buffer);
    }

    res.status(400).json({ error: "Invalid format. Use json, csv, or excel" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
