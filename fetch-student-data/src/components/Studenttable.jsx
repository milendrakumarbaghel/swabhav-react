import Table from "./Table";
import "../App.css";

export default function StudentTable({ students, selectedStudentId, onViewCourses }) {
  const columns = [
    { key: "id", label: "ID" },
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "age", label: "Age" },
    {
      key: "action",
      label: "View Courses",
      render: (row) => (
        <button className="btn-view-courses" onClick={() => onViewCourses(row)}>
          {selectedStudentId === row.id ? "Hide" : "View"}
        </button>
      ),
    },
  ];

  const rows = students.map((s) => ({
    ...s,
    _highlight: s.id === selectedStudentId,
  }));

  return (
    <div className="section-wrapper">
      <h3 className="section-title">Students</h3>
      <Table columns={columns} rows={rows} highlightColor="blue" />
    </div>
  );
}
