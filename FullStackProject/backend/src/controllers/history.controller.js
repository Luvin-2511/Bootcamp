import Dataset from "../models/dataset.model.js";
import mongoose from "mongoose";

const isConnected = () => mongoose.connection.readyState === 1;

export const getAll = async (req, res) => {
  if (!isConnected()) return res.json({ success: true, datasets: [] });
  try {
    const datasets = await Dataset.find({}, "-data").sort({ createdAt: -1 });
    res.json({ success: true, datasets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOne = async (req, res) => {
  if (!isConnected()) return res.status(503).json({ error: "Database not connected" });
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) return res.status(404).json({ error: "Dataset not found" });
    res.json({ success: true, dataset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const remove = async (req, res) => {
  if (!isConnected()) return res.status(503).json({ error: "Database not connected" });
  try {
    await Dataset.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Dataset deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
