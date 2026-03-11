import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

export default function requireAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).send({ error: "Missing token" });
    }

    const token = auth.slice(7);
    const payload = jwt.verify(token, JWT_SECRET);

    if (payload.role !== "admin") {
      return res.status(403).send({ error: "Admin access required" });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Invalid or expired token" });
  }
}
