import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["users", "addresses", "companies", "products", "orders"],
      required: true,
    },
    count: { type: Number, required: true },
    locale: { type: String, default: "en" },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    exportFormat: { type: String, enum: ["json", "csv", "excel"], default: "json" },
  },
  { timestamps: true }
);

export default mongoose.model("Dataset", datasetSchema);
