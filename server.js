import express from "express";
import client from "./db/client.js";
import departmentsRouter from "./api/departments.js";
import facultyRouter from "./api/faculty.js";
import authRouter from "./auth.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: /localhost/ }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/faculty", facultyRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({
    error: "Something went wrong",
    details: err.message,
  });
});

const init = async () => {
  await client.connect();
  console.log("Database connected");

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

init();
