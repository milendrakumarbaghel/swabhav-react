import axios from 'axios';

export const readData = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/student/getAllStudents');
        console.log(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
