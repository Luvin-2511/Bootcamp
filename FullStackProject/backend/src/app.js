import express from "express";
import cors from "cors";
import helmet from "helmet";
import { generalLimiter, generateLimiter, exportLimiter } from "./middlewares/rateLimiter.js";
import generatorRoutes from "./routes/generator.routes.js";
import historyRoutes from "./routes/history.routes.js";
import exportRoutes from "./routes/export.routes.js";

const app = express();

// ── Security ───────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // relax for dev; enable in prod
  })
);

// ── CORS ───────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ── Body Parsing ───────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));

// ── Rate Limiting ──────────────────────────────────────────────────
app.use("/api", generalLimiter);

// ── Routes ─────────────────────────────────────────────────────────
app.use("/api/generate", generateLimiter, generatorRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/export", exportLimiter, exportRoutes);

// ── Health check ───────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "FakeGen API running ✅", version: "1.0.0" }));
app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// ── 404 handler ────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.path} not found` }));

// ── Global error handler ───────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

export default app;