import express from "express";
import { exportData } from "../controllers/export.controller.js";

const router = express.Router();

router.post("/", exportData);

export default router;
