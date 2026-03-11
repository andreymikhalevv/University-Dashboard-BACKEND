import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import client from "./db/client.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "Email and password are required" });
    }

    const existingUser = await client.query(
      `SELECT * FROM users WHERE email = $1;`,
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).send({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await client.query(
      `
      INSERT INTO users (email, password, role)
      VALUES ($1, $2, 'user')
      RETURNING id, email, role;
      `,
      [email, hashedPassword],
    );

    res.status(201).send(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { rows } = await client.query(
      `SELECT * FROM users WHERE email = $1;`,
      [email],
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).send({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.send({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
