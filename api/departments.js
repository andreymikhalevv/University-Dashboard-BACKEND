import express from "express";
import requireAdmin from "../middleware/requireAdmin.js";
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../db/queries/departments.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const departments = await getDepartments();
    res.send(departments);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const department = await getDepartmentById(req.params.id);

    if (!department) {
      return res.status(404).send({ error: "Department not found" });
    }

    res.send(department);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const department = await createDepartment(req.body);
    res.status(201).send(department);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updated = await updateDepartment(req.params.id, req.body);

    if (!updated) {
      return res.status(404).send({ error: "Department not found" });
    }

    res.send(updated);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await deleteDepartment(req.params.id);

    if (!deleted) {
      return res.status(404).send({ error: "Department not found" });
    }

    res.send(deleted);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const department = await createDepartment(req.body);
    res.status(201).send(department);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const department = await updateDepartment(req.params.id, req.body);
    res.send(department);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await deleteDepartment(req.params.id);
    res.send(deleted);
  } catch (error) {
    next(error);
  }
});
export default router;
