import rateLimit from "express-rate-limit";

// General API limiter — 100 requests per 15 minutes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Strict limiter for data generation — 30 requests per minute
export const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many generate requests. Please slow down (max 30/min).",
  },
});

// Export limiter — 20 downloads per minute
export const exportLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many export requests. Please slow down (max 20/min).",
  },
});
