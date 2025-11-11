import { colors } from '../config/colors'

const WeatherActivitiesModal = ({ weatherData, isOpen, onClose, isMobile }) => {
  if (!isOpen || !weatherData) return null

  // Use activities from API response, with fallback
  const activities = weatherData.activities || [
    "No activities available for this weather condition",
    "Check back later for updated suggestions"
  ]
  
  const temp = Math.round(weatherData.temp_c)

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10002,
      padding: isMobile ? '20px' : '40px'
    }}
    onClick={onClose}
    >
      <div style={{
        background: colors.background.white,
        borderRadius: '16px',
        padding: isMobile ? '24px' : '32px',
        maxWidth: isMobile ? '90vw' : '500px',
        maxHeight: isMobile ? '80vh' : '70vh',
        overflowY: 'auto',
        boxShadow: `0 8px 32px ${colors.shadow.dark}`,
        position: 'relative'
      }}
      onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: colors.text.secondary,
            transition: 'color 0.3s ease'
          }}
          onMouseOver={e => e.target.style.color = colors.text.primary}
          onMouseOut={e => e.target.style.color = colors.text.secondary}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
          paddingRight: '40px'
        }}>
          <img 
            src={weatherData.condition.icon} 
            alt={weatherData.condition.text}
            style={{
              width: '64px',
              height: '64px',
              marginBottom: '16px'
            }}
          />
          <h2 style={{
            margin: '0 0 8px 0',
            color: colors.text.primary,
            fontSize: isMobile ? '1.5rem' : '1.8rem',
            fontWeight: '700'
          }}>
            {temp}°C - {weatherData.condition.text}
          </h2>
          <p style={{
            margin: '0',
            color: colors.text.secondary,
            fontSize: isMobile ? '1rem' : '1.1rem'
          }}>
            Perfect weather for these activities:
          </p>
        </div>

        {/* Activities List */}
        <div style={{
          display: 'grid',
          gap: '12px',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)'
        }}>
          {activities.map((activity, index) => (
            <div key={index} style={{
              background: `linear-gradient(135deg, ${colors.primary.gradient.start}15, ${colors.primary.gradient.end}15)`,
              border: `1px solid ${colors.border.medium}`,
              borderRadius: '12px',
              padding: '16px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 4px 12px ${colors.shadow.light}`
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            >
              <div style={{
                color: colors.text.primary,
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: '500',
                lineHeight: '1.4'
              }}>
                {activity}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          padding: '16px',
          background: `linear-gradient(135deg, ${colors.primary.gradient.start}10, ${colors.primary.gradient.end}10)`,
          borderRadius: '12px'
        }}>
          <p style={{
            margin: '0',
            color: colors.text.tertiary,
            fontSize: isMobile ? '0.8rem' : '0.9rem'
          }}>
            💡 Tip: Always check current conditions before heading out!
          </p>
        </div>
      </div>
    </div>
  )
}

export default WeatherActivitiesModal
