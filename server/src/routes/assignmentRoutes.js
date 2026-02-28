import express from "express";
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


    const sampleData = {
      schema: [
        { column: "id", type: "integer" },
        { column: "name", type: "text" },
        { column: "age", type: "integer" },
        { column: "grade", type: "text" },
      ],
      rows: [
        { id: 1, name: "Aditya", age: 20, grade: "A" },
        { id: 2, name: "Neeraj", age: 21, grade: "B" },
        { id: 3, name: "Yukti", age: 19, grade: "A" },
      ],
    };

    res.json(sampleData);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/assignments/:id/hint", async (req, res) => {
  try {
    const { description } = req.body;

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
You are a SQL tutor.

Give a short hint (NOT full solution).

Question:
${description}

Rules:
- Do NOT provide full SQL query
- Only guidance
- Max 3 lines
`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini Response:", JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(500).json({ message: data.error.message });
    }

    const hint =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No hint generated.";

    res.json({ hint });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ message: "LLM error" });
  }
});

export default router;