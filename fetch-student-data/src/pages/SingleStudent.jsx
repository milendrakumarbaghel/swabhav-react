import React from 'react'

function SingleStudent() {
    const [student, setStudent] = React.useState({});
    const readStudent = async () => {
        const response = await axios.get(`http://localhost:8080/api/students/1`);
        const data = await response.data;
        setStudent(data);
        console.log(data);
    }

    readStudent();
  return (
    <div>

    </div>
  )
}

export default SingleStudent
