import React from 'react'
import { login } from '../services/api'
import { jwtDecode } from 'jwt-decode'

function Login() {
    // const email = 'admin@gmail.com'
    // const password = 'Password@123'

    const handleLogin = async () => {
            const response = await login({ email: "admin@gmail.com", password: "Password@123" })
            localStorage.setItem('token', response.token)
            console.log(response);
            const decoded = jwtDecode(response.token)
            const role = decoded.role
            console.log(role)
            
            if (role === 'ROLE_ADMIN') {
                window.location.href = '/admin'
            } else {
                window.location.href = '/user'
            }
    }

    return (
        <div>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login
