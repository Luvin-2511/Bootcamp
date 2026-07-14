import {
  generateUsers,
  generateAddresses,
  generateCompanies,
  generateProducts,
  generateOrders,
} from "../utils/faker.utils.js";
import Dataset from "../models/dataset.model.js";
import mongoose from "mongoose";

const generators = {
  users: generateUsers,
  addresses: generateAddresses,
  companies: generateCompanies,
  products: generateProducts,
  orders: generateOrders,
};

export const generate = async (req, res) => {
  try {
    const { type = "users", count = 10, locale = "en", name, save = false } = req.body;

    if (!generators[type]) {
      return res.status(400).json({ error: `Unknown type: ${type}` });
    }

    const clampedCount = Math.min(Math.max(parseInt(count) || 10, 1), 1000);
    const data = generators[type](clampedCount, locale);

    // Optionally save to DB (only if MongoDB is connected)
    if (save && name) {
      if (mongoose.connection.readyState !== 1) {
        // DB not connected — return data without saving
        return res.json({
          success: true,
          count: data.length,
          data,
          warning: "Data generated but not saved — MongoDB is not connected.",
        });
      }
      const dataset = await Dataset.create({
        name,
        type,
        count: clampedCount,
        locale,
        data,
        exportFormat: req.body.exportFormat || "json",
      });
      return res.json({ success: true, id: dataset._id, count: data.length, data });
    }

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const preview = async (req, res) => {
  try {
    const { type = "users", count = 5, locale = "en" } = req.query;
    if (!generators[type]) return res.status(400).json({ error: "Unknown type" });
    const data = generators[type](Math.min(parseInt(count) || 5, 20), locale);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
