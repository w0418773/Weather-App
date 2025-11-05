import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowRight, faCircleArrowDown } from '@fortawesome/free-solid-svg-icons'
import { colors } from '../config/colors'
import futureFeatures from '../assets/futureFeatures.json'

const InfoCard = ({ showDevBanner, isMobile }) => {
  const [showInfoCard, setShowInfoCard] = useState(false)
  const [showFutureFeatures, setShowFutureFeatures] = useState(false)

  return (
    <div style={{
      position: 'fixed',
      top: showDevBanner ? (isMobile ? '50px' : '60px') : (isMobile ? '10px' : '20px'),
      left: isMobile ? '10px' : '20px',
      zIndex: 1000
    }}>
      <button
        onClick={() => setShowInfoCard(!showInfoCard)}
        style={{
          background: colors.primary.base,
          color: colors.text.white,
          border: 'none',
          borderRadius: '50%',
          width: isMobile ? '35px' : '40px',
          height: isMobile ? '35px' : '40px',
          cursor: 'pointer',
          fontSize: isMobile ? '16px' : '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '3px',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = colors.primary.hover
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = colors.primary.base
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        <div style={{ width: isMobile ? '15px' : '18px', height: '2px', backgroundColor: '#fff', pointerEvents: 'none' }}></div>
        <div style={{ width: isMobile ? '15px' : '18px', height: '2px', backgroundColor: '#fff', pointerEvents: 'none' }}></div>
        <div style={{ width: isMobile ? '15px' : '18px', height: '2px', backgroundColor: '#fff', pointerEvents: 'none' }}></div>
      </button>
      
      {showInfoCard && (
        <div style={{
          position: 'absolute',
          top: isMobile ? '40px' : '50px',
          left: '0',
          background: colors.background.cardGlass,
          color: colors.text.white,
          padding: isMobile ? '12px' : '16px',
          borderRadius: '8px',
          fontSize: isMobile ? '0.8rem' : '0.9rem',
          width: isMobile ? '200px' : '240px',
          maxHeight: isMobile ? '70vh' : '80vh',
          overflowY: 'auto',
          backdropFilter: 'blur(5px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '1rem' : '1.1rem' }}>Site Information</h3>
          <div style={{ marginBottom: '10px', lineHeight: '1.4', textAlign: 'left' }}>
            <div>• Weather : WeatherAPI</div>
            <div>• Images: Unsplash API</div>
            <div>• Backend: <a 
              href="https://github.com/w0418773/Weather_API_py_PUBLIC" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: colors.accent.base, textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseOver={e => e.target.style.color = colors.accent.hover}
              onMouseOut={e => e.target.style.color = colors.accent.base}
            >
              Custom Python API
            </a></div>
          </div>
          
          <div style={{ borderTop: '1px solid #ffffffff', paddingTop: '10px', marginBottom: '10px' }}>
            <button
              onClick={() => setShowFutureFeatures(!showFutureFeatures)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                width: '100%',
                marginBottom: '8px',
                transition: 'background 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={e => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseOut={e => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              <FontAwesomeIcon 
                icon={showFutureFeatures ? faCircleArrowDown : faCircleArrowRight} 
                style={{color: "#764ba2"}} 
              />
              Future Features
            </button>
            
            {showFutureFeatures && (
              <div style={{
                textAlign: 'left',
                fontSize: isMobile ? '0.7rem' : '0.8rem',
                lineHeight: '1.3',
                maxHeight: '200px',
                overflowY: 'auto',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
                padding: '8px',
                marginBottom: '8px'
              }}>
                {futureFeatures.futureFeatures.map((feature, index) => (
                  <div key={index} style={{ marginBottom: '4px' }}>
                    • {feature}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ borderTop: '1px solid #ffffffff', paddingTop: '10px' }}>
            <div style={{ marginBottom: '6px', fontSize: isMobile ? '0.9rem' : '1rem', fontWeight: '500' }}>
              Created by Nathan Snook
            </div>
            <div style={{ display: 'flex', gap: isMobile ? '8px' : '12px', justifyContent: 'center' }}>
              <a
                href="https://w0418773.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: colors.accent.base, textDecoration: 'none', transition: 'color 0.3s ease' }}
                onMouseOver={e => e.target.style.color = colors.accent.hover}
                onMouseOut={e => e.target.style.color = colors.accent.base}
              >
                Portfolio
              </a>
              <a
                href="https://github.com/w0418773/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: colors.accent.base, textDecoration: 'none', transition: 'color 0.3s ease' }}
                onMouseOver={e => e.target.style.color = colors.accent.hover}
                onMouseOut={e => e.target.style.color = colors.accent.base}
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InfoCard
