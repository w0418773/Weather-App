import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
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
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [suggestionsCache, setSuggestionsCache] = useState({})
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
        BaseURLProd + `/weather/${location}`
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

      setWeather(weatherJSON.weather)
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

  // Fetch city suggestions using optimized Nominatim API
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Check cache first - more thorough cache check
    const cacheKey = query.toLowerCase().trim()
    if (suggestionsCache[cacheKey]) {
      setSuggestions(suggestionsCache[cacheKey])
      setShowSuggestions(suggestionsCache[cacheKey].length > 0)
      return
    }

    // Check for partial matches in cache for faster results
    const cacheKeys = Object.keys(suggestionsCache)
    const partialMatch = cacheKeys.find(key => 
      key.startsWith(cacheKey) && key.length <= cacheKey.length + 2
    )
    
    if (partialMatch && suggestionsCache[partialMatch]) {
      const filteredResults = suggestionsCache[partialMatch].filter(item =>
        item.name.toLowerCase().includes(cacheKey)
      )
      if (filteredResults.length > 0) {
        setSuggestions(filteredResults)
        setShowSuggestions(true)
      }
    }

    setIsLoadingSuggestions(true)
    try {
      // Optimized Nominatim parameters for better results
      const params = new URLSearchParams({
        format: 'json',
        addressdetails: '1',
        limit: '6', // Reduced limit for faster response
        'accept-language': 'en',
        featuretype: 'city',
        q: query.trim()
      })
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        {
          headers: {
            'User-Agent': 'WeatherWise/1.0'
          }
        }
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions')
      }
      
      const data = await response.json()
      
      // Improved filtering and scoring
      const processedSuggestions = data
        .filter(item => {
          const isRelevantPlace = item.class === 'place' && 
            ['city', 'town', 'village', 'municipality', 'hamlet', 'suburb', 'neighbourhood'].includes(item.type)
          
          const isBoundary = item.class === 'boundary' && item.type === 'administrative'
          
          return isRelevantPlace || isBoundary
        })
        .map(item => {
          const name = item.name || item.display_name.split(',')[0]
          const country = item.address?.country || ''
          const state = item.address?.state || item.address?.province || item.address?.region || ''
          const county = item.address?.county || ''
          
          // Calculate relevance score
          const queryLower = query.toLowerCase()
          const nameLower = name.toLowerCase()
          let score = 0
          
          // Exact match gets highest score
          if (nameLower === queryLower) score += 100
          // Starts with query gets high score
          else if (nameLower.startsWith(queryLower)) score += 50
          // Contains query gets medium score
          else if (nameLower.includes(queryLower)) score += 25
          
          // Prefer cities over villages/hamlets
          if (item.type === 'city') score += 20
          else if (item.type === 'town') score += 15
          else if (item.type === 'municipality') score += 10
          
          // Prefer places with higher importance
          if (item.importance) score += item.importance * 10
          
          return {
            display_name: item.display_name,
            name: name,
            country: country,
            state: state,
            county: county,
            lat: item.lat,
            lon: item.lon,
            type: item.type,
            score: score,
            importance: item.importance || 0
          }
        })
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score
          return b.importance - a.importance
        })
        .filter((item, index, array) => {
          const key = `${item.name.toLowerCase()}-${item.country.toLowerCase()}`
          return array.findIndex(other => 
            `${other.name.toLowerCase()}-${other.country.toLowerCase()}` === key
          ) === index
        })
        .slice(0, 5)
      
      // Cache the results
      setSuggestionsCache(prev => ({
        ...prev,
        [cacheKey]: processedSuggestions
      }))
      
      setSuggestions(processedSuggestions)
      setShowSuggestions(processedSuggestions.length > 0)
      
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  // Improved debounce with much shorter delay
  const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 100)

  const handleLocationChange = (e) => {
    const value = e.target.value
    setLocation(value)
    
    if (!value.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    
    // Show suggestions immediately if we have cached results
    const cacheKey = value.toLowerCase().trim()
    if (suggestionsCache[cacheKey]) {
      setSuggestions(suggestionsCache[cacheKey])
      setShowSuggestions(suggestionsCache[cacheKey].length > 0)
    }
    
    debouncedFetchSuggestions(value)
  }

  const handleSuggestionClick = (suggestion) => {
    // Improved location string formatting
    let locationString = suggestion.name
    
    if (suggestion.state && suggestion.country) {
      locationString = `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
    } else if (suggestion.county && suggestion.country) {
      locationString = `${suggestion.name}, ${suggestion.county}, ${suggestion.country}`
    } else if (suggestion.country) {
      locationString = `${suggestion.name}, ${suggestion.country}`
    }
    
    setLocation(locationString)
    setSuggestions([])
    setShowSuggestions(false)
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

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes rainDrop {
            0% {
              transform: translateY(-10px);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh);
              opacity: 0.3;
            }
          }
        `}
      </style>

      {/* Development Banner */}
      {showDevBanner && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
          color: '#fff',
          padding: isMobile ? '8px' : '12px',
          textAlign: 'center',
          fontSize: isMobile ? '0.8rem' : '0.9rem',
          fontWeight: '500',
          zIndex: 9999,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1 }}>
            🚧 This website is still in development - Some features may not work as expected
          </div>
          <button
            onClick={() => setShowDevBanner(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#fff',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '10px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Info Card */}
      <div style={{
        position: 'fixed',
        top: showDevBanner ? (isMobile ? '50px' : '60px') : (isMobile ? '10px' : '20px'),
        left: isMobile ? '10px' : '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setShowInfoCard(!showInfoCard)}
          style={{
            background: '#764ba2',
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
            gap: '3px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#6b46c1'
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#764ba2'
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
            background: '#764ba2bb',
            color: '#ffffffff',
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
            
            <div style={{ borderTop: '1px solid #ffffffff', paddingTop: '10px' }}>
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
          margin: showDevBanner 
            ? (isMobile ? '70px auto 20px' : '80px auto 40px')
            : (isMobile ? '20px auto' : '40px auto'),
          padding: isMobile ? 16 : 24,
          background: 'rgba(255, 255, 255, 0.5)',
          color: '#222',
          borderRadius: 12,
          border: '1.5px solid #bbb',
          boxShadow: '0 4px 24px #0002',
          transition: 'background-image 0.8s'
        }}
      >
        <h1 style={{
          textAlign: 'center', 
          marginBottom: 20, 
          fontSize: isMobile ? '2.2rem' : '3rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '700',
          fontFamily: '"Poppins", "Inter", "Segoe UI", sans-serif',
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
          textShadow: '0 4px 8px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          Weather Wise
          <span style={{
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            marginLeft: '8px',
            display: 'inline-block',
            animation: 'bounce 2s infinite'
          }}>
            ⛅
          </span>
        </h1>
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
              onClick={handleGetLocation}
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
            
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={location}
                onChange={handleLocationChange}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true)
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 150)
                }}
                placeholder="Checking the weather for…?"
                style={{
                  padding: '8px', 
                  fontSize: '1rem', 
                  width: isMobile ? '100%' : '300px',
                  borderRadius: showSuggestions && suggestions.length > 0 ? '6px 6px 0 0' : '6px',
                  background: '#ffffffff',
                  color: '#222',
                  border: '1px solid #bbb'
                }}
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #bbb',
                  borderTop: 'none',
                  borderRadius: '0 0 6px 6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1001
                }}>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                      style={{
                        padding: '12px',
                        cursor: 'pointer',
                        borderBottom: index < suggestions.length - 1 ? '1px solid #eee' : 'none',
                        fontSize: '0.9rem',
                        color: '#333',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={e => e.target.style.background = '#f5f5f5'}
                      onMouseOut={e => e.target.style.background = 'transparent'
                      }
                    >
                      <div style={{ fontWeight: '500' }}>{suggestion.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                        {suggestion.state && `${suggestion.state}, `}
                        {suggestion.country}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Loading indicator for suggestions */}
              {isLoadingSuggestions && (
                <div style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid #666',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                </div>
              )}
            </div>
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
            onClick={handleGetWeather}
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
        {error && (
          <div style={{color: '#d00', marginBottom: 16, textAlign: 'center', fontSize: isMobile ? '0.9rem' : '1rem'}}>{error}</div>
        )}
        {weather && (
          <div style={{textAlign: 'center', marginTop: 24, color: '#222'}}>
            <h2 style={{marginBottom: 20, fontSize: isMobile ? '1.2rem' : '1.5rem'}}>{weather.location.name}, {weather.location.region ? weather.location.region + ', ' : ''}{weather.location.country}</h2>
            
            {/* Three Weather Cards Layout */}
            <div style={{
              display: 'flex',
              gap: isMobile ? '12px' : '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 20
            }}>
              {/* Current Weather Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #ddd',
                borderRadius: '16px',
                padding: isMobile ? '16px' : '20px',
                minWidth: isMobile ? '160px' : '180px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0px)'}
              >
                <div style={{
                  fontSize: isMobile ? '1.3rem' : '1.5rem',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '12px'
                }}>
                  Now
                </div>
                <img 
                  src={weather.current.condition.icon} 
                  alt={weather.current.condition.text}
                  style={{
                    width: isMobile ? '64px' : '72px',
                    height: isMobile ? '64px' : '72px',
                  }}
                />
                <div style={{
                  fontSize: isMobile ? '1.8rem' : '2.2rem',
                  fontWeight: '700',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  {Math.round(weather.current.temp_c)}°C
                </div>
                <div style={{
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  color: '#666',
                  marginBottom: '8px'
                }}>
                  {weather.current.condition.text}
                </div>
                <div style={{
                  fontSize: isMobile ? '0.7rem' : '0.8rem',
                  color: '#888',
                  lineHeight: '1.3'
                }}>
                  Feels like {Math.round(weather.current.feelslike_c)}°C<br />
                  Humidity: {weather.current.humidity}%<br />
                  Wind: {weather.current.wind_kph} km/h
                </div>
              </div>

              {/* Next Hour Card */}
              {weather.forecast && weather.forecast.forecastday && weather.forecast.forecastday[0] && weather.forecast.forecastday[0].hour[1] && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ddd',
                  borderRadius: '16px',
                  padding: isMobile ? '16px' : '20px',
                  minWidth: isMobile ? '160px' : '180px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0px)'}
                >
                  <div style={{
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '12px'
                  }}>
                    {(() => {
                      const hour = new Date(weather.forecast.forecastday[0].hour[1].time).getHours()
                      return hour === 0 ? '12 AM' : hour <= 12 ? `${hour} AM` : `${hour - 12} PM`
                    })()}
                  </div>
                  <img 
                    src={weather.forecast.forecastday[0].hour[1].condition.icon} 
                    alt={weather.forecast.forecastday[0].hour[1].condition.text}
                    style={{
                      width: isMobile ? '64px' : '72px',
                      height: isMobile ? '64px' : '72px',
                      marginBottom: '12px'
                    }}
                  />
                  <div style={{
                    fontSize: isMobile ? '1.8rem' : '2.2rem',
                    fontWeight: '700',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    {Math.round(weather.forecast.forecastday[0].hour[1].temp_c)}°C
                  </div>
                  <div style={{
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    color: '#666',
                    marginBottom: '8px'
                  }}>
                    {weather.forecast.forecastday[0].hour[1].condition.text}
                  </div>
                  <div style={{
                    fontSize: isMobile ? '0.7rem' : '0.8rem',
                    color: '#888',
                    lineHeight: '1.3'
                  }}>
                    Feels like {Math.round(weather.forecast.forecastday[0].hour[1].feelslike_c)}°C<br />
                    Humidity: {weather.forecast.forecastday[0].hour[1].humidity}%
                    Wind: {weather.forecast.forecastday[0].hour[1].wind_kph} km/h
                  </div>
                </div>
              )}

              {/* Third Hour Card */}
              {weather.forecast && weather.forecast.forecastday && weather.forecast.forecastday[0] && weather.forecast.forecastday[0].hour[2] && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ddd',
                  borderRadius: '16px',
                  padding: isMobile ? '16px' : '20px',
                  minWidth: isMobile ? '160px' : '180px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0px)'}
                >
                  <div style={{
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '12px'
                  }}>
                    {(() => {
                      const hour = new Date(weather.forecast.forecastday[0].hour[2].time).getHours()
                      return hour === 0 ? '12 AM' : hour <= 12 ? `${hour} AM` : `${hour - 12} PM`
                    })()}
                  </div>
                  <img 
                    src={weather.forecast.forecastday[0].hour[2].condition.icon} 
                    alt={weather.forecast.forecastday[0].hour[2].condition.text}
                    style={{
                      width: isMobile ? '64px' : '72px',
                      height: isMobile ? '64px' : '72px',
                      marginBottom: '12px'
                    }}
                  />
                  <div style={{
                    fontSize: isMobile ? '1.8rem' : '2.2rem',
                    fontWeight: '700',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    {Math.round(weather.forecast.forecastday[0].hour[2].temp_c)}°C
                  </div>
                  <div style={{
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    color: '#666',
                    marginBottom: '8px'
                  }}>
                    {weather.forecast.forecastday[0].hour[2].condition.text}
                  </div>
                  <div style={{
                    fontSize: isMobile ? '0.7rem' : '0.8rem',
                    color: '#888',
                    lineHeight: '1.3'
                  }}>
                    Feels like {Math.round(weather.forecast.forecastday[0].hour[2].feelslike_c)}°C<br />
                    Humidity: {weather.forecast.forecastday[0].hour[2].humidity}%
                  </div>
                </div>
              )}
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
            background: '#764ba2bb',
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
