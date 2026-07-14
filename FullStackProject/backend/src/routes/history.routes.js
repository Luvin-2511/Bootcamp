import express from "express";
import { getAll, getOne, remove } from "../controllers/history.controller.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getOne);
router.delete("/:id", remove);

export default router;
