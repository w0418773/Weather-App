import { colors } from '../config/colors'

const DevelopmentBanner = ({ showDevBanner, setShowDevBanner, isMobile }) => {
  if (!showDevBanner) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: `linear-gradient(135deg, ${colors.banner.start}, ${colors.banner.end})`,
      color: colors.text.white,
      padding: isMobile ? '4px 8px' : '8px',
      textAlign: 'center',
      fontSize: isMobile ? '0.75rem' : '0.9rem',
      fontWeight: '500',
      zIndex: 10001,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: isMobile ? '30px' : '36px'
    }}>
      <div style={{ 
        flex: 1,
        paddingRight: isMobile ? '8px' : '10px',
        lineHeight: isMobile ? '1.2' : '1.4'
      }}>
        🚧 This website is still in development - Some features may not work as expected
      </div>
      <button
        onClick={() => setShowDevBanner(false)}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: colors.text.white,
          borderRadius: '50%',
          width: isMobile ? '20px' : '24px',
          height: isMobile ? '20px' : '24px',
          cursor: 'pointer',
          fontSize: isMobile ? '12px' : '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        ✕
      </button>
    </div>
  )
}

export default DevelopmentBanner
