import Table from "./Table";
import "../App.css";

export default function CourseDetail({ courseName, detail, loading }) {
  const columns = [
    { key: "id", label: "ID" },
    { key: "courseName", label: "Course Name" },
    { key: "courseCode", label: "Course Code" },
    {
      key: "fees",
      label: "Fees",
      render: (row) => `₹${row.fees}`,
    },
  ];

  return (
    <div className="section-wrapper">
      <h3 className="section-title">Course Details: {courseName}</h3>
      {loading && <p className="info-text">Loading...</p>}
      {!loading && detail && (
        <Table columns={columns} rows={[detail]} />
      )}
    </div>
  );
}
