import client from "./client.js";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

const seed = async () => {
  try {
    await client.connect();

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await client.query(
      `
      INSERT INTO users (email, password, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING;
      `,
      ["admin@fsu.edu", hashedPassword, "admin"],
    );

    for (let i = 0; i < 10; i++) {
      const name = faker.company.name() + " Department";
      const description = faker.lorem.sentence();
      const image = faker.image.urlPicsumPhotos();
      const email = faker.internet.email();
      const phone = faker.phone.number();
      const office = "Building " + faker.number.int({ min: 100, max: 500 });

      await client.query(
        `
    INSERT INTO departments (name, description, image_url, email, phone, office_location)
    VALUES ($1,$2,$3,$4,$5,$6)
    `,
        [name, description, image, email, phone, office],
      );
    }

    await client.query(`
      INSERT INTO departments (name, description, image_url, email, phone, office_location)
      VALUES
      (
        'Computer Science',
        'Focuses on software engineering, programming, systems, and algorithms.',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
        'cs@fsu.edu',
        '555-111-1111',
        'Tech Hall 201'
      ),
      (
        'Mathematics',
        'Offers courses and research in pure and applied mathematics.',
        'https://images.unsplash.com/photo-1509228468518-180dd4864904',
        'math@fsu.edu',
        '555-222-2222',
        'Newton Hall 101'
      ),
      (
        'Biology',
        'Studies life sciences, ecology, genetics, and lab research.',
        'https://images.unsplash.com/photo-1532187643603-ba119ca4109e',
        'biology@fsu.edu',
        '555-333-3333',
        'Science Building 305'
      );
    `);
    for (let i = 0; i < 20; i++) {
      const name = faker.person.fullName();
      const bio = faker.lorem.paragraph();
      const image = faker.image.avatar();
      const email = faker.internet.email();
      const phone = faker.phone.number();
      const title = faker.helpers.arrayElement([
        "Professor",
        "Associate Professor",
        "Assistant Professor",
      ]);

      const departmentId = faker.number.int({ min: 1, max: 3 });

      await client.query(
        `
    INSERT INTO faculty (name, bio, profile_image_url, email, phone, title, department_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    `,
        [name, bio, image, email, phone, title, departmentId],
      );
    }
    await client.query(`
      INSERT INTO faculty (name, bio, profile_image_url, email, phone, title, department_id)
      VALUES
      (
        'Dr. Sarah Chen',
        'Specializes in full-stack development and distributed systems.',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        'schen@fsu.edu',
        '555-444-1111',
        'Associate Professor',
        1
      ),
      (
        'Dr. Alex Kim',
        'Researches machine learning and database systems.',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        'akim@fsu.edu',
        '555-444-2222',
        'Professor',
        1
      ),
      (
        'Dr. Maria Lopez',
        'Focuses on statistics and applied mathematics.',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        'mlopez@fsu.edu',
        '555-555-1111',
        'Professor',
        2
      ),
      (
        'Dr. James Wilson',
        'Studies genetics and molecular biology.',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
        'jwilson@fsu.edu',
        '555-666-1111',
        'Assistant Professor',
        3
      );
    `);

    console.log("Database seeded.");
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
};

seed();
