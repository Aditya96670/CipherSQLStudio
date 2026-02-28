import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.post("/execute-query", async (req, res) => {
  const { query } = req.body;

  // 1️⃣ Empty guard
  if (!query || !query.trim()) {
    return res.status(400).json({
      message: "Query cannot be empty."
    });
  }

  // 2️⃣ Only SELECT allowed
  if (!query.trim().toLowerCase().startsWith("select")) {
    return res.status(400).json({
      message: "Only SELECT queries are allowed."
    });
  }

  try {
    const result = await pool.query(query);
    res.json(result);
  } catch (error) {
    console.error("SQL Error:", error.message);

    res.status(400).json({
      message: error.message
    });
  }
});

export default router;