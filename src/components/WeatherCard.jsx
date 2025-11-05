import { colors } from '../config/colors'

const WeatherCard = ({ title, weatherData, isMobile }) => {
  return (
    <div style={{
      background: colors.background.cardSolid,
      border: `1px solid ${colors.border.medium}`,
      borderRadius: '16px',
      padding: isMobile ? '16px' : '16px',
      minWidth: isMobile ? '280px' : '160px',
      flex: isMobile ? 'none' : '1 1 0',
      maxWidth: isMobile ? '320px' : '180px',
      width: isMobile ? '90%' : 'auto',
      boxShadow: `0 4px 12px ${colors.shadow.medium}`,
      transition: 'transform 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0px)'}
    >
      <div style={{
        fontSize: isMobile ? '1.2rem' : '1.2rem',
        fontWeight: '600',
        color: colors.text.secondary,
        marginBottom: '8px'
      }}>
        {title}
      </div>
      <img 
        src={weatherData.condition.icon} 
        alt={weatherData.condition.text}
        style={{
          width: isMobile ? '64px' : '64px',
          height: isMobile ? '64px' : '64px',
          marginBottom: '8px'
        }}
      />
      <div style={{
        fontSize: isMobile ? '1.8rem' : '1.8rem',
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: '6px'
      }}>
        {Math.round(weatherData.temp_c)}°C
      </div>
      <div style={{
        fontSize: isMobile ? '1.0rem' : '1.0rem',
        color: colors.text.secondary,
        marginBottom: '6px'
      }}>
        {weatherData.condition.text}
      </div>
      <div style={{
        fontSize: isMobile ? '0.9rem' : '0.9rem',
        color: colors.text.tertiary,
        lineHeight: '1.2'
      }}>
        Feels like {Math.round(weatherData.feelslike_c)}°C<br />
        Humidity: {weatherData.humidity}%<br />
        Wind: {weatherData.wind_kph} km/h
      </div>
    </div>
  )
}

export default WeatherCard
