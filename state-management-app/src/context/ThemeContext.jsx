import React from 'react'
import { createContext, useContext } from 'react'

export const ThemeDataContext = createContext()

function ThemeContext(props) {
    const [theme, setTheme] = React.useState('light')
  return (
    <>
    <ThemeDataContext.Provider value={[theme, setTheme]}>
    {props.children}
    </ThemeDataContext.Provider>
    </>
  )
}

export default ThemeContext
