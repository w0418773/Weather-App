import { createContext, useContext, useState, useEffect } from 'react'
import { lightTheme, darkTheme, generateCSSVariables } from '../config/colors'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('weatherapp-theme')
    return saved ? JSON.parse(saved) : false
  })

  const currentTheme = isDark ? darkTheme : lightTheme

  const toggleTheme = () => {
    setIsDark(prev => {
      const newTheme = !prev
      localStorage.setItem('weatherapp-theme', JSON.stringify(newTheme))
      return newTheme
    })
  }

  useEffect(() => {
    // Update CSS variables when theme changes
    const existingStyle = document.getElementById('theme-variables')
    if (existingStyle) {
      existingStyle.remove()
    }

    const styleElement = document.createElement('style')
    styleElement.id = 'theme-variables'
    styleElement.textContent = generateCSSVariables(currentTheme)
    document.head.appendChild(styleElement)

    return () => {
      const style = document.getElementById('theme-variables')
      if (style) {
        style.remove()
      }
    }
  }, [currentTheme])

  return (
    <ThemeContext.Provider value={{ 
      isDark, 
      toggleTheme, 
      colors: currentTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}
