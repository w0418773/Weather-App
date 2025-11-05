import { useState, useEffect } from 'react'
import InfoCard from './components/InfoCard'
import WeatherCard from './components/WeatherCard'
import SearchInput from './components/SearchInput'
import DevelopmentBanner from './components/DevelopmentBanner'
import './styles/theme.css'
import './App.css'

function App() {
  const [location, setLocation] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [bgUrl, setBgUrl] = useState('')
  const [imageInfo, setImageInfo] = useState(null)
  const [showInfoCard, setShowInfoCard] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [showDevBanner, setShowDevBanner] = useState(true) // Set to false to hide banner
  const [isLoading, setIsLoading] = useState(false)
  const [showRainAnimation, setShowRainAnimation] = useState(true)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showFutureFeatures, setShowFutureFeatures] = useState(false)
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
    setIsLoading(true)
    setShowRainAnimation(false) // Hide rain animation when user clicks
    if (!location.trim()) {
      setError('Please enter a location.')
      setIsLoading(false)
      return
    }
    try {
      const currentWeather = await fetch(
        BaseURLProd + `/hourly/${location}`
      )
      if (!currentWeather.ok) {
        setError('Could not fetch weather. Try another location.')
        setIsLoading(false)
        return
      }
      const weatherJSON = await currentWeather.json()
      if (weatherJSON.error) {
        setError(weatherJSON.error.message)
        setIsLoading(false)
        return
      }
      console.log('Weather Data:', weatherJSON) 
      setWeather(weatherJSON)
      setBgUrl(weatherJSON.image.url)
      setImageInfo(weatherJSON.image)
      
    } catch (err) {
      setError('Error fetching weather data.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetLocation = async () => {
    setIsGettingLocation(true)
    setError('')
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          // Use reverse geocoding to get city name
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          const data = await response.json()
          
          console.log('Reverse Geocoding Data:', data) // Debugging log
          if (data.locality || data.city) {
            setLocation(data.locality + ", " + data.countryName || data.city + ", " + data.countryName)
          } else {
            setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`)
          }
        } catch (err) {
          setError('Could not get location name.')
          console.error(err)
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        setError('Location access denied or unavailable.')
        setIsGettingLocation(false)
        console.error(error)
      }
    )
  }

  return (
    <>
      {/* Rain Animation */}
      {showRainAnimation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 10000,
          opacity: showRainAnimation ? 1 : 0,
          transition: 'opacity 1s ease-out'
        }}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                width: '2px',
                height: `${Math.random() * 20 + 10}px`,
                background: 'linear-gradient(to bottom, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.3))',
                borderRadius: '1px',
                animation: `rainDrop ${Math.random() * 2 + 1}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <DevelopmentBanner 
        showDevBanner={showDevBanner}
        setShowDevBanner={setShowDevBanner}
        isMobile={isMobile}
      />

      <InfoCard 
        showDevBanner={showDevBanner}
        isMobile={isMobile}
      />

      <div style={{
        maxWidth: isMobile ? '95vw' : 600,
        margin: showDevBanner 
          ? (isMobile ? '70px auto 20px' : '80px auto 40px')
          : (isMobile ? '20px auto' : '40px auto'),
        padding: isMobile ? 16 : 24,
        background: 'rgba(255, 255, 255, 0.5)',
        border: '1.5px solid #bbb',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'background-image 0.8s'
      }}>
        <h1 className="text-center font-bold leading-tight" style={{
          marginBottom: 20, 
          fontSize: isMobile ? '2.2rem' : '3rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontFamily: '"Poppins", "Inter", "Segoe UI", sans-serif',
          letterSpacing: '-0.02em',
          textShadow: '0 4px 8px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          Weather Wise
          <span style={{
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            marginLeft: '8px',
            display: 'inline-block',
            animation: 'bounce 2s infinite',
            background: 'none',
            WebkitBackgroundClip: 'initial',
            WebkitTextFillColor: 'initial',
            backgroundClip: 'initial',
            textShadow: 'none',
            color: 'initial'
          }}>
            ⛅
          </span>
        </h1>

        <SearchInput
          location={location}
          setLocation={setLocation}
          onGetWeather={handleGetWeather}
          onGetLocation={handleGetLocation}
          isLoading={isLoading}
          isGettingLocation={isGettingLocation}
          isMobile={isMobile}
        />

        {error && (
          <div className="text-error text-center mb-lg font-md">{error}</div>
        )}

        {weather && (
          <div className="text-center text-primary" style={{marginTop: 24}}>
            <h2 className="mb-xl font-xl">{weather.location.name}, {weather.location.region ? weather.location.region + ', ' : ''}{weather.location.country}</h2>
            
            <div className="flex gap-md justify-center items-center mb-xl" style={{
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'center' : 'stretch'
            }}>
              <WeatherCard
                title="Now"
                weatherData={weather.current}
                isMobile={isMobile}
              />
              
              {weather.hourly.length > 0 && (
                <WeatherCard
                  title="+1 Hour"
                  weatherData={weather.hourly[0]}
                  isMobile={isMobile}
                />
              )}
              
              {weather.hourly.length >= 2 && (
                <WeatherCard
                  title="+2 Hours"
                  weatherData={weather.hourly[1]}
                  isMobile={isMobile}
                />
              )}
            </div>

            <button 
              style={{
                marginTop: 20,
                padding: isMobile ? '8px 16px' : '10px 20px',
                fontSize: isMobile ? '0.9rem' : '1rem',
                borderRadius: 6,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: isMobile ? '100%' : 'auto'
              }}
              onClick={() => {
                // TODO: Implement weekly forecast functionality
                console.log('Next Three Days clicked');
              }}
              onMouseOver={e => {
                e.target.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
              }}
              onMouseOut={e => {
                e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              Next Three Days
            </button>
          </div>
        )}

        {imageInfo && (
          <div style={{
            position: 'fixed',
            bottom: isMobile ? '8px' : '20px',
            right: isMobile ? '8px' : '20px',
            left: isMobile ? '8px' : 'auto',
            background: '#764ba2bb',
            color: '#fff',
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
                style={{ color: '#87ceeb', textDecoration: 'none', transition: 'color 0.3s ease' }}
                onMouseOver={e => e.target.style.color = '#5dade2'}
                onMouseOut={e => e.target.style.color = '#87ceeb'}
              >
                {imageInfo.photographer.name}
              </a>
            </div>
            <div style={{ 
              fontSize: isMobile ? '0.65rem' : '0.8rem', 
              color: '#ccc',
              lineHeight: isMobile ? '1.2' : '1.4'
            }}>
              <div>📍 {imageInfo.location || 'Unknown location'}</div>
              <div style={{ marginTop: '2px' }}>
                <a 
                  href={imageInfo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#87ceeb', textDecoration: 'none', transition: 'color 0.3s ease' }}
                  onMouseOver={e => e.target.style.color = '#5dade2'}
                  onMouseOut={e => e.target.style.color = '#87ceeb'}
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
