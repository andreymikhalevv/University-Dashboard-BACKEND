import client from "../client.js";

export const getDepartments = async () => {
  const { rows } = await client.query(`
    SELECT * FROM departments
    ORDER BY id;
  `);
  return rows;
};

export const getDepartmentById = async (id) => {
  const { rows } = await client.query(
    `
    SELECT * FROM departments
    WHERE id = $1;
  `,
    [id],
  );

  const department = rows[0];
  if (!department) return null;

  const facultyResult = await client.query(
    `
    SELECT id, name, title, email, phone, profile_image_url
    FROM faculty
    WHERE department_id = $1
    ORDER BY id;
  `,
    [id],
  );

  department.faculty = facultyResult.rows;
  return department;
};

export const createDepartment = async ({
  name,
  description,
  image_url,
  email,
  phone,
  office_location,
}) => {
  const { rows } = await client.query(
    `
    INSERT INTO departments (name, description, image_url, email, phone, office_location)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `,
    [name, description, image_url, email, phone, office_location],
  );

  return rows[0];
};

export const updateDepartment = async (id, fields) => {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const setString = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = keys.map((key) => fields[key]);

  const { rows } = await client.query(
    `
    UPDATE departments
    SET ${setString}
    WHERE id = $${keys.length + 1}
    RETURNING *;
  `,
    [...values, id],
  );

  return rows[0];
};

export const deleteDepartment = async (id) => {
  const { rows } = await client.query(
    `
    DELETE FROM departments
    WHERE id = $1
    RETURNING *;
  `,
    [id],
  );

  return rows[0];
};
