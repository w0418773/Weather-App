import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'

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
            background: isGettingLocation ? '#9ca3af' : '#764ba2',
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
              e.target.style.background = '#6b46c1'
            }
          }}
          onMouseOut={e => {
            if (!isGettingLocation) {
              e.target.style.background = '#764ba2'
            }
          }}
        >
          {isGettingLocation ? (
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid transparent',
              borderTop: '2px solid #fff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          ) : (
            <FontAwesomeIcon icon={faLocationDot} style={{color: "#ffffffff", fontSize: '16px'}} />
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
            background: '#ffffffff',
            color: '#222',
            border: '1px solid #bbb',
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
          background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffffff',
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
            e.target.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
          }
        }}
        onMouseOut={e => {
          if (!isLoading) {
            e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }
        }}
      >
        {isLoading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid transparent',
              borderTop: '2px solid #fff',
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
