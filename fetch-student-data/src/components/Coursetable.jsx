import Table from "./Table";
import "../App.css";

export default function CourseTable({ studentName, courses, loading, selectedCourseId, onViewCourse }) {
  const columns = [
    { key: "id", label: "ID" },
    { key: "courseName", label: "Course Name" },
    { key: "courseCode", label: "Course Code" },
    {
      key: "action",
      label: "View Course",
      render: (row) => (
        <button className="btn-view-course" onClick={() => onViewCourse(row)}>
          {selectedCourseId === row.id ? "Hide" : "View"}
        </button>
      ),
    },
  ];

  const rows = (courses || []).map((c) => ({
    ...c,
    _highlight: c.id === selectedCourseId,
  }));

  return (
    <div className="section-wrapper">
      <h3 className="section-title">Courses enrolled by: {studentName}</h3>
      {loading && <p className="info-text">Loading courses...</p>}
      {!loading && courses && courses.length === 0 && (
        <p className="info-text">No courses found.</p>
      )}
      {!loading && courses && courses.length > 0 && (
        <Table columns={columns} rows={rows} highlightColor="purple" />
      )}
    </div>
  );
}
