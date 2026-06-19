import React from 'react'
import { useContext } from 'react'
import { ThemeDataContext } from '../context/ThemeContext'

function ExChild() {
    const [theme, setTheme] = useContext(ThemeDataContext)
    setTheme('dark')
  return (
    <div>ExChild : {theme}</div>
  )
}

export default ExChild
