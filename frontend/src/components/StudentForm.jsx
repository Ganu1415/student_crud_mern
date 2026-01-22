import { useState } from "react";
import api from "../api";
import Swal from "sweetalert2";

export default function StudentForm({ refresh }) {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    age: "",
  });

  const [subjects, setSubjects] = useState([{ subject: "", marks: "" }]);

  // Add new subject row
  const addSubject = () => {
    setSubjects([...subjects, { subject: "", marks: "" }]);
  };

  // Remove subject row
  const removeSubject = (index) => {
    const updated = subjects.filter((_, i) => i !== index);
    setSubjects(updated);
  };

  // Handle subject input
  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  //Handle Change for student info
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Create student
      const res = await api.post("/students", student);
      const studentId = res.data.id;

      // 2️⃣ Add multiple marks
      for (const sub of subjects) {
        await api.post("/students/marks", {
          student_id: studentId,
          subject: sub.subject,
          marks: Number(sub.marks),
        });
      }

      Swal.fire("Success", "Student & Marks Added", "success");

      setStudent({ name: "", email: "", age: "" });
      setSubjects([{ subject: "", marks: "" }]);
      refresh();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <form className="card p-3 mb-3" onSubmit={submit}>
      <h5>Add Student with Multiple Subjects</h5>

      {/* Student Info */}
      <input
        className="form-control mb-2"
        placeholder="Name"
        name="name"
        value={student.name}
        onChange={handleChange}
        required
      />

      <input
        className="form-control mb-2"
        placeholder="Email"
        name="email"
        value={student.email}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        className="form-control mb-3"
        placeholder="Age"
        name="age"
        value={student.age}
        onChange={handleChange}
        required
      />

      {/* Subjects Section */}
      <h6>Subjects & Marks</h6>

      {subjects.map((sub, index) => (
        <div className="row mb-2" key={index}>
          <div className="col">
            <input
              className="form-control"
              placeholder="Subject"
              value={sub.subject}
              onChange={(e) =>
                handleSubjectChange(index, "subject", e.target.value)
              }
              required
            />
          </div>

          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Marks"
              value={sub.marks}
              onChange={(e) =>
                handleSubjectChange(index, "marks", e.target.value)
              }
              required
            />
          </div>

          <div className="col-2">
            {subjects.length > 1 && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeSubject(index)}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-secondary mb-3"
        onClick={addSubject}
      >
        + Add Subject
      </button>

      <button className="btn btn-success">Add Student & Marks</button>
    </form>
  );
}
