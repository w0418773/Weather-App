import { useState, useEffect } from 'react'
import InfoCard from './components/InfoCard'
import WeatherCard from './components/WeatherCard'
import SearchInput from './components/SearchInput'
import DevelopmentBanner from './components/DevelopmentBanner'
import ImageAttribution from './components/ImageAttribution'
import { generateCSSVariables, colors } from './config/colors'
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
      document.body.style.background = `linear-gradient(${colors.background.overlay}, ${colors.background.overlay}), url(${bgUrl}) center/cover no-repeat`
    } else {
      document.body.style.background = colors.background.light
    }
    // Clean up on unmount
    return () => {
      document.body.style.background = colors.background.light
    }
  }, [bgUrl])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Inject color variables into CSS
    const styleElement = document.createElement('style')
    styleElement.textContent = generateCSSVariables()
    document.head.appendChild(styleElement)
    
    return () => {
      document.head.removeChild(styleElement)
    }
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
                background: `linear-gradient(to bottom, ${colors.rain.start}, ${colors.rain.end})`,
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
        background: colors.background.card,
        border: `1.5px solid ${colors.border.light}`,
        borderRadius: 12,
        boxShadow: `0 4px 12px ${colors.shadow.medium}`,
        transition: 'background-image 0.8s'
      }}>
        <h1 className="text-center font-bold leading-tight" style={{
          marginBottom: 20, 
          fontSize: isMobile ? '2.2rem' : '3rem',
          background: `linear-gradient(135deg, ${colors.primary.gradient.start} 0%, ${colors.primary.gradient.end} 100%)`,
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
                background: `linear-gradient(135deg, ${colors.primary.gradient.start} 0%, ${colors.primary.gradient.end} 100%)`,
                color: colors.text.white,
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
                e.target.style.background = `linear-gradient(135deg, ${colors.primary.hover} 0%, ${colors.primary.dark} 100%)`
              }}
              onMouseOut={e => {
                e.target.style.background = `linear-gradient(135deg, ${colors.primary.gradient.start} 0%, ${colors.primary.gradient.end} 100%)`
              }}
            >
              Next Three Days
            </button>
          </div>
        )}
      </div>

      <ImageAttribution 
        imageInfo={imageInfo}
        isMobile={isMobile}
      />
    </>
  )
}

export default App
