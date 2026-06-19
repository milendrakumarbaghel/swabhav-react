import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Data from './components/Data'
import Student from './components/Student'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Data /> */}
      <Student />
    </>
  )
}

export default App
