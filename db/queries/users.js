import client from "../client.js";

export async function getUserByEmail(email) {
  const { rows } = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return rows[0];
}

export async function createUser({ email, password, role = "user" }) {
  const { rows } = await client.query(
    `
    INSERT INTO users (email, password, role)
    VALUES ($1,$2,$3)
    RETURNING id,email,role
    `,
    [email, password, role],
  );

  return rows[0];
}
