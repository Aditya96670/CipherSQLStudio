import express from "express";
import {
  getAllAssignments,
  getAssignmentById
} from "../controllers/assignmentController.js";

const router = express.Router();

router.get("/assignments", getAllAssignments);
router.get("/assignments/:id", getAssignmentById);

export default router;