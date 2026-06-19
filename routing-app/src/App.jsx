import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import ProfileDetails from './components/ProfileDetails'
import Careers from './components/Careers'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import CustomerDashboard from './pages/CustomerDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />}>
          {/* nested route */}
          <Route path="careers" element={<Careers />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />

        <Route path="/profile/:id" element={<ProfileDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<CustomerDashboard />} />
      </Routes>
    </>
  )
}

export default App
