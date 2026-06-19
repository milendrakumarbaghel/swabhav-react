import React from 'react'

function Student() {
    const [students, setStudents] = React.useState([])

    const getStudents = async () => {
        const response = await fetch('http://localhost:8080/api/student/getAllStudents')
        const data = await response.json()
        setStudents(data)
    }

    // React.useEffect(() => {
    //     getStudents()
    // }, [])
    return (
        <div>
            {students.length > 0 ? (
                <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Age</th>
                            <th>Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={id}>
                                <td>{student.name}</td>
                                <td>{student.age}</td>
                                <td>{student.department}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No students found.</p>
            )}
            <button onClick={getStudents}>Get Students</button>
        </div>
    )
}

export default Student
