import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = ({ showDevBanner, isMobile }) => {
  const { isDark, toggleTheme, colors } = useTheme()

  return (
    <div style={{
      position: 'fixed',
      top: showDevBanner ? (isMobile ? '50px' : '60px') : (isMobile ? '10px' : '20px'),
      right: isMobile ? '10px' : '20px',
      zIndex: 1000
    }}>
      <button
        onClick={toggleTheme}
        style={{
          background: colors.primary.base,
          color: colors.text.white,
          border: 'none',
          borderRadius: '50%',
          width: isMobile ? '35px' : '40px',
          height: isMobile ? '35px' : '40px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: `0 4px 12px ${colors.shadow.medium}`
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = colors.primary.hover
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = colors.primary.base
          e.currentTarget.style.transform = 'scale(1)'
        }}
        title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      >
        <FontAwesomeIcon 
          icon={isDark ? faSun : faMoon} 
          style={{ fontSize: isMobile ? '16px' : '18px' }} 
        />
      </button>
    </div>
  )
}

export default ThemeToggle
