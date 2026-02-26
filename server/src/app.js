import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import queryRoutes from "./routes/queryRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api", queryRoutes);

app.use("/api", assignmentRoutes);

export default app;