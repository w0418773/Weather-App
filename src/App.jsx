import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [location, setLocation] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [bgUrl, setBgUrl] = useState('')
  const [imageInfo, setImageInfo] = useState(null)
  const [showInfoCard, setShowInfoCard] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const BaseURLDev = 'http://localhost:8000'
  const BaseURLProd = 'https://weather-api-py.vercel.app'

  useEffect(() => {
    if (bgUrl) {
      document.body.style.background = `linear-gradient(rgba(234, 246, 251, 0.25), rgba(234, 246, 251, 0.25)), url(${bgUrl}) center/cover no-repeat`
    } else {
      document.body.style.background = '#eaf6fb'
    }
    // Clean up on unmount
    return () => {
      document.body.style.background = '#eaf6fb'
    }
  }, [bgUrl])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleGetWeather = async () => {
    setError('')
    setWeather(null)
    setBgUrl('')
    setImageInfo(null)
    if (!location.trim()) {
      setError('Please enter a location.')
      return
    }
    try {
      const currentWeather = await fetch(
        BaseURLProd + `/weather/${location}`
      )
      if (!currentWeather.ok) {
        setError('Could not fetch weather. Try another location.')
        return
      }
      const weatherJSON = await currentWeather.json()
      if (weatherJSON.error) {
        setError(weatherJSON.error.message)
        return
      }

      setWeather(weatherJSON.weather)
      setBgUrl(weatherJSON.image.url)
      setImageInfo(weatherJSON.image)
      
    } catch (err) {
      setError('Error fetching weather data.')
      console.error(err)
    }
  }

  return (
    <>
      {/* Info Card */}
      <div style={{
        position: 'fixed',
        top: isMobile ? '10px' : '20px',
        left: isMobile ? '10px' : '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setShowInfoCard(!showInfoCard)}
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
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
            gap: '3px'
          }}
        >
          <div style={{ width: isMobile ? '15px' : '18px', height: '2px', backgroundColor: '#fff' }}></div>
          <div style={{ width: isMobile ? '15px' : '18px', height: '2px', backgroundColor: '#fff' }}></div>
          <div style={{ width: isMobile ? '15px' : '18px', height: '2px', backgroundColor: '#fff' }}></div>
        </button>
        
        {showInfoCard && (
          <div style={{
            position: 'absolute',
            top: isMobile ? '40px' : '50px',
            left: '0',
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            padding: isMobile ? '12px' : '16px',
            borderRadius: '8px',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            width: isMobile ? '180px' : '200px',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '1rem' : '1.1rem' }}>Site Information</h3>
            <div style={{ marginBottom: '10px', lineHeight: '1.4' }}>
              <div>• Weather : WeatherAPI</div>
              <div>• Images: Unsplash API</div>
              <div>• Backend: Custom Python API</div>
            </div>
            
            <div style={{ borderTop: '1px solid #444', paddingTop: '10px' }}>
              <div style={{ marginBottom: '6px', fontSize: isMobile ? '0.9rem' : '1rem', fontWeight: '500' }}>
                Created by Nathan Snook
              </div>
              <div style={{ display: 'flex', gap: isMobile ? '8px' : '12px', justifyContent: 'center' }}>
                <a
                  href="https://w0418773.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#87ceeb', textDecoration: 'none' }}
                >
                  Portfolio
                </a>
                <a
                  href="https://github.com/w0418773/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#87ceeb', textDecoration: 'none' }}
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="weather-container"
        style={{
          maxWidth: isMobile ? '95vw' : 600,
          margin: isMobile ? '20px auto' : '40px auto',
          padding: isMobile ? 16 : 24,
          background: 'rgba(255, 255, 255, 0.5)',
          color: '#222',
          borderRadius: 12,
          border: '1.5px solid #bbb',
          boxShadow: '0 4px 24px #0002',
          transition: 'background-image 0.8s'
        }}
      >
        <h1 style={{textAlign: 'center', marginBottom: 20, color: '#222', fontSize: isMobile ? '1.5rem' : '2rem'}}>Weather Wise</h1>
        <div style={{
          marginBottom: 18, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '8px',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Enter your location"
            style={{
              padding: '8px', 
              fontSize: '1rem', 
              width: isMobile ? '100%' : '300px',
              borderRadius: 6, 
              border: '1px solid #bbb',
              marginBottom: isMobile ? '8px' : '0'
            }}
          />
          <button
            style={{
              padding: '8px 16px',
              fontSize: '1rem',
              borderRadius: 6,
              background: '#4a90e2',
              color: '#fff',
              border: 'none',
              height: '40px',
              minWidth: isMobile ? '100%' : '140px',
              whiteSpace: 'nowrap'
            }}
            onClick={handleGetWeather}
          >
            Current Forecast
          </button>
        </div>
        {error && (
          <div style={{color: '#d00', marginBottom: 16, textAlign: 'center', fontSize: isMobile ? '0.9rem' : '1rem'}}>{error}</div>
        )}
        {weather && (
          <div style={{textAlign: 'center', marginTop: 24, color: '#222'}}>
            <h2 style={{marginBottom: 8, fontSize: isMobile ? '1.2rem' : '1.5rem'}}>{weather.location.name}, {weather.location.region ? weather.location.region + ', ' : ''}{weather.location.country}</h2>
            <img src={weather.current.condition.icon} alt={weather.current.condition.text} style={{verticalAlign: 'middle'}} />
            <div style={{fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 600, margin: '8px 0'}}>{weather.current.temp_c}°C</div>
            <div style={{fontSize: isMobile ? '1rem' : '1.1rem', color: '#333'}}>{weather.current.condition.text}</div>
            <div style={{marginTop: 10, fontSize: isMobile ? '0.85rem' : '0.95rem', color: '#444'}}>
              Feels like: {weather.current.feelslike_c}°C<br />
              Humidity: {weather.current.humidity}%<br />
              Wind: {weather.current.wind_kph} kph
            </div>
            <button
              style={{
                marginTop: 20,
                padding: isMobile ? '8px 16px' : '10px 20px',
                fontSize: isMobile ? '0.9rem' : '1rem',
                borderRadius: 6,
                background: '#28a745',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                width: isMobile ? '100%' : 'auto'
              }}
              onClick={() => {
                // TODO: Implement weekly forecast functionality
                console.log('Weekly Forecast clicked');
              }}
              onMouseOver={e => e.target.style.background = '#218838'}
              onMouseOut={e => e.target.style.background = '#28a745'}
            >
              Weekly Forecast
            </button>
          </div>
        )}
        {imageInfo && (
          <div style={{
            position: 'fixed',
            bottom: isMobile ? '10px' : '20px',
            right: isMobile ? '10px' : '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            padding: isMobile ? '8px 10px' : '10px 12px',
            borderRadius: '8px',
            fontSize: isMobile ? '0.75rem' : '0.85rem',
            maxWidth: isMobile ? '200px' : '250px',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            zIndex: 1000
          }}>
            <div style={{ marginBottom: '4px', fontWeight: '500' }}>
              Photo by{' '}
              <a 
                href={imageInfo.photographer.link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#87ceeb', textDecoration: 'none' }}
              >
                {imageInfo.photographer.name}
              </a>
            </div>
            <div style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#ccc' }}>
              <div>📍 {imageInfo.location || 'Unknown location'}</div>
              <div style={{ marginTop: '2px' }}>
                <a 
                  href={imageInfo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#87ceeb', textDecoration: 'none' }}
                >
                  {imageInfo.name || 'View Image'}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
