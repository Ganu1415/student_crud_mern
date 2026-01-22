import { useEffect, useState } from "react";
import api from "../api";
import Swal from "sweetalert2";

export default function StudentList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  const load = async () => {
    const res = await api.get(`/students?page=${page}&limit=5`);
    setData(res.data.students);
  };

  useEffect(() => {
    load();
  }, [page]);

  const del = async (id) => {
    const ok = await Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (ok.isConfirmed) {
      await api.delete(`/students/${id}`);
      load();
    }
  };

  /* View code */
  const viewStudent = async (id) => {
    try {
      const res = await api.get(`/students/${id}`);
      const s = res.data;

      let marksTable = `
      <table class="table table-bordered mt-2">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
    `;

      if (s.marks.length === 0) {
        marksTable += `
        <tr>
          <td colspan="2" style="text-align:center">No Marks Found</td>
        </tr>
      `;
      } else {
        s.marks.forEach((m) => {
          marksTable += `
          <tr>
            <td>${m.subject}</td>
            <td>${m.marks}</td>
          </tr>
        `;
        });
      }

      marksTable += "</tbody></table>";

      Swal.fire({
        title: "Student Details",
        width: 600,
        html: `
        <b>ID:</b> ${s.id} <br/>
        <b>Name:</b> ${s.name} <br/>
        <b>Email:</b> ${s.email} <br/>
        <b>Age:</b> ${s.age}
        ${marksTable}
      `,
        confirmButtonText: "Close",
      });
    } catch (error) {
      Swal.fire("Error", "Unable to fetch student details", "error");
    }
  };
  /* View code */

  // Update Code
  const updateStudent = async (id) => {
    try {
      const res = await api.get(`/students/${id}`);
      const s = res.data;

      let marksInputs = "";
      s.marks.forEach((m, i) => {
        marksInputs += `
        <div class="row mb-2">
          <div class="col">
            <input id="subject_${i}" class="swal2-input" value="${m.subject}" placeholder="Subject"/>
          </div>
          <div class="col">
            <input id="marks_${i}" type="number" class="swal2-input" value="${m.marks}" placeholder="Marks"/>
          </div>
        </div>
      `;
      });

      const { value: formValues } = await Swal.fire({
        title: "Update Student",
        html: `
        <input id="name" class="swal2-input" value="${s.name}" placeholder="Name"/>
        <input id="email" class="swal2-input" value="${s.email}" placeholder="Email"/>
        <input id="age" type="number" class="swal2-input" value="${s.age}" placeholder="Age"/>
        <h6>Marks</h6>
        ${marksInputs}
      `,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
          const updatedMarks = s.marks.map((_, i) => ({
            subject: document.getElementById(`subject_${i}`).value,
            marks: document.getElementById(`marks_${i}`).value,
          }));

          return {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            age: document.getElementById("age").value,
            marks: updatedMarks,
          };
        },
      });

      if (!formValues) return;

      // 1️⃣ Update student
      await api.put(`/students/${id}`, {
        name: formValues.name,
        email: formValues.email,
        age: formValues.age,
      });

      // 2️⃣ Remove old marks
      await api.delete(`/students/${id}/marks`);

      // 3️⃣ Insert updated marks
      for (const m of formValues.marks) {
        await api.post("/students/marks", {
          student_id: id,
          subject: m.subject,
          marks: Number(m.marks),
        });
      }

      Swal.fire("Updated", "Student updated successfully", "success");
      load();
    } catch (error) {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  // Updaet Code

  return (
    <>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.age}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => del(s.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-primary btn-sm ms-3"
                  onClick={() => updateStudent(s.id)}
                >
                  Update
                </button>
                <button
                  className="btn btn-primary btn-sm ms-3"
                  onClick={() => viewStudent(s.id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="btn btn-secondary me-2"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      <button className="btn btn-secondary" onClick={() => setPage(page + 1)}>
        Next
      </button>
    </>
  );
}
