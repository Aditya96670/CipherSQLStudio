import express from "express";
import pool from "../config/db.js";
import {
  getAllAssignments,
  getAssignmentById
} from "../controllers/assignmentController.js";

const router = express.Router();
router.get("/assignments", getAllAssignments);
router.get("/assignments/:id", getAssignmentById);
router.get("/assignments/:id/sample-data", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get the target table for this assignment
    const assignmentRes = await pool.query(
      "SELECT target_table FROM assignments WHERE id = $1",
      [id]
    );

    if (assignmentRes.rows.length === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const tableName = assignmentRes.rows[0].target_table || 'students';

    // 2. Fetch schema
    const schemaRes = await pool.query(`
      SELECT column_name as column, data_type as type 
      FROM information_schema.columns 
      WHERE table_name = $1
    `, [tableName]);

    // 3. Fetch sample rows (first 3)
    const rowsRes = await pool.query(`SELECT * FROM ${tableName} LIMIT 3`);

    res.json({
      schema: schemaRes.rows,
      rows: rowsRes.rows
    });

  } catch (error) {
    console.error("Sample Data Error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/assignments/:id/hint", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    // 1. Check if hint exists in database
    const dbRes = await pool.query("SELECT hint FROM assignments WHERE id = $1", [id]);

    if (dbRes.rows[0]?.hint) {
      return res.json({ hint: dbRes.rows[0].hint });
    }

    // 2. Fallback to Gemini if no hint in DB
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are a SQL tutor. Give a short hint (NOT full solution).
Question: ${description}
Rules: Do NOT provide full SQL query. Max 3 lines.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const hint = data.candidates?.[0]?.content?.parts?.[0]?.text || "No hint generated.";
    res.json({ hint });

  } catch (error) {
    console.error("Hint Error:", error);
    res.status(500).json({ message: "Error fetching hint" });
  }
});

export default router;