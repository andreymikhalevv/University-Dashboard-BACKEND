import client from "../client.js";

export const getFaculty = async () => {
  const { rows } = await client.query(`
    SELECT faculty.*, departments.name AS department_name
    FROM faculty
    LEFT JOIN departments
      ON faculty.department_id = departments.id
    ORDER BY faculty.id;
  `);

  return rows;
};

export const getFacultyById = async (id) => {
  const { rows } = await client.query(
    `
    SELECT faculty.*, departments.name AS department_name
    FROM faculty
    LEFT JOIN departments
      ON faculty.department_id = departments.id
    WHERE faculty.id = $1;
  `,
    [id],
  );

  return rows[0] || null;
};

export const createFaculty = async ({
  name,
  bio,
  profile_image_url,
  email,
  phone,
  title,
  department_id,
}) => {
  const { rows } = await client.query(
    `
    INSERT INTO faculty (name, bio, profile_image_url, email, phone, title, department_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `,
    [name, bio, profile_image_url, email, phone, title, department_id],
  );

  return rows[0];
};

export const updateFaculty = async (id, fields) => {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const setString = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = keys.map((key) => fields[key]);

  const { rows } = await client.query(
    `
    UPDATE faculty
    SET ${setString}
    WHERE id = $${keys.length + 1}
    RETURNING *;
  `,
    [...values, id],
  );

  return rows[0];
};

export const deleteFaculty = async (id) => {
  const { rows } = await client.query(
    `
    DELETE FROM faculty
    WHERE id = $1
    RETURNING *;
  `,
    [id],
  );

  return rows[0];
};
