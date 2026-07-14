import express from "express";
import { generate, preview } from "../controllers/generator.controller.js";

const router = express.Router();

router.post("/", generate);
router.get("/preview", preview);

export default router;
