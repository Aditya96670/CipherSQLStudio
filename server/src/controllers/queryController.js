import pool from "../config/db.js";
import { validateQuery } from "../utils/validateQuery.js";

export const executeQuery = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const validation = validateQuery(query);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const result = await pool.query(query);

    res.json({
      rows: result.rows,
      rowCount: result.rowCount,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const submitQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const validation = validateQuery(query);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    // 1. Get the ground truth (sample_query)
    const assignmentRes = await pool.query(
      "SELECT sample_query FROM assignments WHERE id = $1",
      [id]
    );

    if (assignmentRes.rows.length === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const expectedQuery = assignmentRes.rows[0].sample_query;

    // 2. Execute both
    const userRes = await pool.query(query);
    const expectedRes = await pool.query(expectedQuery);

    // 3. Compare JSON representation
    const isCorrect = JSON.stringify(userRes.rows) === JSON.stringify(expectedRes.rows);

    res.json({
      success: isCorrect,
      rows: userRes.rows,
      rowCount: userRes.rowCount,
      message: isCorrect ? "Congratulations! Your query is correct." : "Query executed, but result set doesn't match the expected output."
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};