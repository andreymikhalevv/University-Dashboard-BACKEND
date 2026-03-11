DROP TABLE IF EXISTS faculty;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  office_location VARCHAR(255)
);

CREATE TABLE faculty (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  bio TEXT NOT NULL,
  profile_image_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  title VARCHAR(100),
  department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user'
);