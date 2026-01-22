import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="container mt-4">
      <h2 className="mb-3">🎓 Student Management</h2>
      <StudentForm refresh={() => window.location.reload()} />
      <StudentList />
    </div>
  );
}

export default App;
