import React from 'react'
import Child from './Child'
import { useContext } from 'react'
import { ThemeDataContext } from '../context/ThemeContext'

function Parent() {
    // const [theme, setTheme] = React.useState('light')
    const [theme, setTheme] = useContext(ThemeDataContext)
  return (
    <>
        {/* <div>Parent : {theme}</div>
        <Child theme={theme} setTheme={setTheme} > */}
            {/* <h1>Making changes in Child Component</h1> */}
        {/* </Child> */}
        <div>Parent : {theme}</div>
        <Child>
            <h1>Making changes in Child Component</h1>
        </Child>
    </>
  )
}

export default Parent
