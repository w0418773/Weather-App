import { useTheme } from '../contexts/ThemeContext'

const ImageAttribution = ({ imageInfo, isMobile }) => {
  const { colors } = useTheme()
  
  if (!imageInfo) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: isMobile ? '8px' : '20px',
      right: isMobile ? '8px' : '20px',
      left: isMobile ? '8px' : 'auto',
      background: colors.background.cardGlass,
      color: colors.text.white,
      padding: isMobile ? '6px 8px' : '10px 12px',
      borderRadius: '6px',
      fontSize: isMobile ? '0.7rem' : '0.85rem',
      maxWidth: isMobile ? 'none' : '250px',
      backdropFilter: 'blur(5px)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
      zIndex: 1000
    }}>
      <div style={{ 
        marginBottom: '2px', 
        fontWeight: '500',
        lineHeight: isMobile ? '1.2' : '1.4'
      }}>
        Photo by{' '}
        <a 
          href={imageInfo.photographer.link} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: colors.accent.base, 
            textDecoration: 'none', 
            transition: 'color 0.3s ease' 
          }}
          onMouseOver={e => e.target.style.color = colors.accent.hover}
          onMouseOut={e => e.target.style.color = colors.accent.base}
        >
          {imageInfo.photographer.name}
        </a>
      </div>
      <div style={{ 
        fontSize: isMobile ? '0.65rem' : '0.8rem', 
        color: colors.text.light,
        lineHeight: isMobile ? '1.2' : '1.4'
      }}>
        <div>📍 {imageInfo.location || 'Unknown location'}</div>
        <div style={{ marginTop: '2px' }}>
          <a 
            href={imageInfo.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: colors.accent.base, 
              textDecoration: 'none', 
              transition: 'color 0.3s ease' 
            }}
            onMouseOver={e => e.target.style.color = colors.accent.hover}
            onMouseOut={e => e.target.style.color = colors.accent.base}
          >
            {imageInfo.name || 'View Image'}
          </a>
        </div>
      </div>
    </div>
  )
}

export default ImageAttribution
