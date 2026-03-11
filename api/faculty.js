import express from "express";
import {
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "../db/queries/faculty.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const faculty = await getFaculty();
    res.send(faculty);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const professor = await getFacultyById(req.params.id);

    if (!professor) {
      return res.status(404).send({ error: "Faculty member not found" });
    }

    res.send(professor);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const professor = await createFaculty(req.body);
    res.status(201).send(professor);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updated = await updateFaculty(req.params.id, req.body);

    if (!updated) {
      return res.status(404).send({ error: "Faculty member not found" });
    }

    res.send(updated);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await deleteFaculty(req.params.id);

    if (!deleted) {
      return res.status(404).send({ error: "Faculty member not found" });
    }

    res.send(deleted);
  } catch (error) {
    next(error);
  }
});

export default router;
