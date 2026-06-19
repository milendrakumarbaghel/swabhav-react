import { useState } from "react";
import { fetchAllStudents, fetchStudentCourses, fetchCourseDetail } from "../services/api";
import StudentTable from "../components/Studenttable";
import CourseTable from "../components/Coursetable";
import CourseDetail from "../components/Coursedetail";
import "../App.css";

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courses, setCourses] = useState(null);
  const [coursesLoading, setCoursesLoading] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetail, setCourseDetail] = useState(null);
  const [courseDetailLoading, setCourseDetailLoading] = useState(false);

  const handleFetchStudents = async () => {
    setLoading(true);
    setError(null);
    setSelectedStudent(null);
    setCourses(null);
    setSelectedCourse(null);
    setCourseDetail(null);
    try {
      const data = await fetchAllStudents();
      setStudents(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourses = async (student) => {
    if (selectedStudent?.id === student.id) {
      setSelectedStudent(null);
      setCourses(null);
      setSelectedCourse(null);
      setCourseDetail(null);
      return;
    }
    setSelectedStudent(student);
    setCourses(null);
    setSelectedCourse(null);
    setCourseDetail(null);
    setCoursesLoading(true);
    try {
      const data = await fetchStudentCourses(student.id);
      setCourses(data);
    } catch (e) {
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleViewCourse = async (course) => {
    if (selectedCourse?.id === course.id) {
      setSelectedCourse(null);
      setCourseDetail(null);
      return;
    }
    setSelectedCourse(course);
    setCourseDetail(null);
    setCourseDetailLoading(true);
    try {
      const data = await fetchCourseDetail(course.id);
      setCourseDetail(data);
    } catch (e) {
      setCourseDetail(null);
    } finally {
      setCourseDetailLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="page-title">Student Management</h2>

      <button className="btn-fetch" onClick={handleFetchStudents} disabled={loading}>
        {loading ? "Loading..." : "Fetch Students"}
      </button>

      {error && <p className="error-text">{error}</p>}

      {students.length > 0 && (
        <StudentTable
          students={students}
          selectedStudentId={selectedStudent?.id}
          onViewCourses={handleViewCourses}
        />
      )}

      {selectedStudent && (
        <CourseTable
          studentName={selectedStudent.fullName}
          courses={courses}
          loading={coursesLoading}
          selectedCourseId={selectedCourse?.id}
          onViewCourse={handleViewCourse}
        />
      )}

      {selectedCourse && (
        <CourseDetail
          courseName={selectedCourse.courseName}
          detail={courseDetail}
          loading={courseDetailLoading}
        />
      )}
    </div>
  );
}
