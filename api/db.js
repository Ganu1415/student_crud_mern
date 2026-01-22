import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "student_db",
  password: "system",
  port: 5432,
});

export default pool;
