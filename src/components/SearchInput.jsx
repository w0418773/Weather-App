import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { colors } from '../config/colors'

const SearchInput = ({ 
  location, 
  setLocation, 
  onGetWeather, 
  onGetLocation, 
  isLoading, 
  isGettingLocation, 
  isMobile 
}) => {
  return (
    <div style={{
      marginBottom: 18, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      gap: '8px',
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: isMobile ? '100%' : 'auto'
      }}>
        <button
          onClick={onGetLocation}
          disabled={isGettingLocation}
          style={{
            background: isGettingLocation ? colors.status.disabled : colors.primary.base,
            border: 'none',
            borderRadius: '6px',
            padding: '8px',
            cursor: isGettingLocation ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            height: '40px',
            minWidth: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseOver={e => {
            if (!isGettingLocation) {
              e.target.style.background = colors.primary.hover
            }
          }}
          onMouseOut={e => {
            if (!isGettingLocation) {
              e.target.style.background = colors.primary.base
            }
          }}
        >
          {isGettingLocation ? (
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid transparent',
              borderTop: `2px solid ${colors.text.white}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          ) : (
            <FontAwesomeIcon icon={faLocationDot} style={{color: colors.text.white, fontSize: '16px'}} />
          )}
        </button>
        
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading) {
              onGetWeather()
            }
          }}
          placeholder="Checking the weather for…?"
          style={{
            padding: '8px', 
            fontSize: '1rem', 
            width: isMobile ? 'calc(100% - 56px)' : '300px',
            borderRadius: 6, 
            background: colors.background.white,
            color: colors.text.primary,
            border: `1px solid ${colors.border.light}`,
            height: '40px',
            boxSizing: 'border-box'
          }}
        />
      </div>
      
      <button
        style={{
          padding: '8px 16px',
          fontSize: '1rem',
          borderRadius: 6,
          background: isLoading ? colors.status.disabled : `linear-gradient(135deg, ${colors.primary.gradient.start} 0%, ${colors.primary.gradient.end} 100%)`,
          color: colors.text.white,
          border: 'none',
          height: '40px',
          minWidth: isMobile ? '100%' : '140px',
          whiteSpace: 'nowrap',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: isLoading ? 0.7 : 1,
          transform: isLoading ? 'scale(0.98)' : 'scale(1)',
          marginTop: isMobile ? '8px' : '0'
        }}
        onClick={onGetWeather}
        disabled={isLoading}
        onMouseOver={e => {
          if (!isLoading) {
            e.target.style.background = `linear-gradient(135deg, ${colors.primary.hover} 0%, ${colors.primary.dark} 100%)`
          }
        }}
        onMouseOut={e => {
          if (!isLoading) {
            e.target.style.background = `linear-gradient(135deg, ${colors.primary.gradient.start} 0%, ${colors.primary.gradient.end} 100%)`
          }
        }}
      >
        {isLoading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid transparent',
              borderTop: `2px solid ${colors.text.white}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Loading...
          </span>
        ) : (
          'Current Forecast'
        )}
      </button>
    </div>
  )
}

export default SearchInput
