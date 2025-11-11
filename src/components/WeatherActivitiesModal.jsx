import { colors } from '../config/colors'

const WeatherActivitiesModal = ({ weatherData, isOpen, onClose, isMobile }) => {
  if (!isOpen || !weatherData) return null

  const getActivitiesForWeather = (condition, temp) => {
    const conditionLower = condition.toLowerCase()
    const temperature = Math.round(temp)
    
    // Define activities based on weather conditions
    const activities = {
      sunny: [
        "🏖️ Visit the beach or lake",
        "🚴‍♂️ Go cycling or biking",
        "🥾 Take a nature hike",
        "🧺 Have a picnic in the park",
        "🏊‍♀️ Go swimming outdoors",
        "📸 Take outdoor photography",
        "⛳ Play golf or mini golf",
        "🌻 Visit a botanical garden"
      ],
      cloudy: [
        "☕ Visit a cozy café",
        "📚 Read a book in the park",
        "🚶‍♀️ Take a leisurely walk",
        "🎨 Outdoor sketching or painting",
        "🛍️ Go shopping outdoors",
        "🏛️ Visit museums or galleries",
        "🎪 Attend outdoor events",
        "🌳 Explore local parks"
      ],
      rainy: [
        "☕ Enjoy hot drinks indoors",
        "📖 Read a good book",
        "🎬 Watch movies or series",
        "🧩 Work on puzzles",
        "👨‍🍳 Try cooking new recipes",
        "🎨 Indoor art projects",
        "🛁 Take a relaxing bath",
        "🎮 Play indoor games"
      ],
      snowy: [
        "⛄ Build a snowman",
        "🎿 Go skiing or snowboarding",
        "☕ Drink hot chocolate",
        "🔥 Cozy up by the fireplace",
        "📚 Read with warm blankets",
        "🧶 Knitting or crafting",
        "🏠 Home organization projects",
        "🎲 Board games with family"
      ],
      windy: [
        "🪁 Fly a kite",
        "🏠 Stay indoors and relax",
        "💨 Watch the trees sway",
        "🌬️ Feel the fresh air (briefly)",
        "📱 Indoor entertainment",
        "☕ Warm beverages",
        "🧘‍♀️ Indoor yoga or meditation",
        "🎵 Listen to calming music"
      ]
    }

    // Determine weather type based on condition
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
      return activities.sunny
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
      return activities.rainy
    } else if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
      return activities.snowy
    } else if (conditionLower.includes('wind')) {
      return activities.windy
    } else {
      return activities.cloudy
    }
  }

  const activities = getActivitiesForWeather(weatherData.condition.text, weatherData.temp_c)
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
