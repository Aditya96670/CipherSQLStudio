import pool from "../config/db.js";
import { validateQuery } from "../utils/validateQuery.js";

export const executeQuery = async (req, res) => {
  try {
    const { query } = req.body;

    // 1️⃣ Query exist karti hai ya nahi
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // 2️⃣ Validation call kar rahe hain
    const validation = validateQuery(query);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    // 3️⃣ Safe query hi database me jayegi
    const result = await pool.query(query);

    res.json({
      rows: result.rows,
      rowCount: result.rowCount,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};