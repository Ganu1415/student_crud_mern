import pool from "../../db.js";

/* CREATE STUDENT */
export const createStudent = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const result = await pool.query(
      "INSERT INTO students(name,email,age) VALUES($1,$2,$3) RETURNING *",
      [name, email, age]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET STUDENTS WITH PAGINATION */
export const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const data = await pool.query(
      "SELECT * FROM students ORDER BY id DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const total = await pool.query("SELECT COUNT(*) FROM students");

    res.json({
      students: data.rows,
      total: parseInt(total.rows[0].count),
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET STUDENT BY ID WITH MARKS */
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await pool.query("SELECT * FROM students WHERE id=$1", [
      id,
    ]);

    if (student.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const marks = await pool.query(
      "SELECT subject, marks FROM marks WHERE student_id=$1",
      [id]
    );

    res.json({ ...student.rows[0], marks: marks.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE STUDENT */
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    const result = await pool.query(
      "UPDATE students SET name=$1,email=$2,age=$3 WHERE id=$4 RETURNING *",
      [name, email, age, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE STUDENT */
export const deleteStudent = async (req, res) => {
  try {
    await pool.query("DELETE FROM students WHERE id=$1", [req.params.id]);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ADD MARKS */
export const addMarks = async (req, res) => {
  try {
    const { student_id, subject, marks } = req.body;

    const result = await pool.query(
      "INSERT INTO marks(student_id,subject,marks) VALUES($1,$2,$3) RETURNING *",
      [student_id, subject, marks]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE MARKS
export const deleteMarksByStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM marks WHERE student_id=$1", [id]);
    res.json({ message: "Marks deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
