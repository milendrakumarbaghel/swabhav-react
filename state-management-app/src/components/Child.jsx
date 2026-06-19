import React from 'react'
import ExChild from './ExChild'
import { useContext } from 'react'
import { ThemeDataContext } from '../context/ThemeContext'

function Child() {
    // console.log(props)
    // props.setTheme('dark')
    const [theme, setTheme] = useContext(ThemeDataContext)
  return (
    <>
        <div>Child : {theme}</div>
        {/* {children} */}
        <ExChild />
    </>

  )
}

export default Child
