import express from "express";

import departmentsRouter from "./api/departments.js";
import facultyRouter from "./api/faculty.js";

const app = express();

app.use(express.json());

// mount routers
app.use("/departments", departmentsRouter);
app.use("/faculty", facultyRouter);

// error handlers
app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      return res.status(400).send(err.message);

    case "23505":
    case "23503":
      return res.status(400).send(err.detail);

    default:
      return next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).send("Sorry! Something went wrong.");
});

export default app;
