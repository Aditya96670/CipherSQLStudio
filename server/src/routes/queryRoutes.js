import express from "express";
import { executeQuery, submitQuery } from "../controllers/queryController.js";

const router = express.Router();

router.post("/execute-query", executeQuery);
router.post("/submit/:id", submitQuery);

export default router;