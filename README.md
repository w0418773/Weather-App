# Weather Wise ⛅

A modern, responsive weather application built with React that provides real-time weather data with beautiful, dynamic backgrounds. Get current weather conditions and hourly forecasts with an intuitive, user-friendly interface.

![Weather Wise Demo](https://w0418773.github.io/Weather-App/)

## ✨ Features

### Current Weather Display
- **Real-time Weather Data**: Current temperature, conditions, humidity, and wind speed
- **Hourly Forecasts**: View weather for the next 1-2 hours
- **Interactive Weather Cards**: Hover effects and smooth animations
- **Three-Card Layout**: Current, +1 Hour, and +2 Hours weather display

### Location Services
- **GPS Location Detection**: Automatic location detection using browser geolocation
- **Manual Location Search**: Search for any city worldwide with Enter key support
- **Reverse Geocoding**: Convert coordinates to readable location names

### Dynamic User Interface
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dynamic Backgrounds**: Beautiful images that match your weather location from Unsplash
- **Rain Animation**: Ambient rain effect on page load
- **Loading States**: Smooth loading indicators and spinners for better UX
- **Mobile-First Design**: Cards stack vertically on mobile for optimal viewing

### Additional Features
- **Development Banner**: Shows current development status (dismissible)
- **Info Panel**: Displays API sources, future features, and project information
- **Future Features List**: Dynamic list loaded from GitHub repository
- **Image Attribution**: Proper credit for background photographers
- **FontAwesome Icons**: Modern iconography throughout the interface

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern React with Hooks (useState, useEffect)
- **JavaScript (ES6+)** - Async/await, destructuring, arrow functions, template literals
- **CSS-in-JS** - Inline styling with responsive design and animations
- **FontAwesome React** - Icon library for UI elements
- **Vite** - Fast build tool and dev server

### APIs & Services
- **Custom Python Backend** - [Custom weather API](https://github.com/w0418773/Weather_API_py_PUBLIC) built with Python
- **WeatherAPI** - Real-time weather data and forecasts
- **Unsplash API** - Dynamic background images based on location
- **BigDataCloud API** - Reverse geocoding services for location names
- **GitHub Raw API** - Dynamic feature list loading from repository

## 🎯 Usage

1. **Search for Weather**
   - Type a city name in the search box
   - Press Enter or click "Current Forecast"
   - Or use the location button (📍) to auto-detect your location

2. **View Weather Information**
   - **Now Card**: Current weather conditions
   - **+1 Hour Card**: Weather forecast for one hour ahead
   - **+2 Hours Card**: Weather forecast for two hours ahead
   - Background image updates automatically based on your location

3. **Explore Features**
   - Click the menu button (☰) in the top-left to view site information
   - Expand "Future Features" to see planned updates
   - Check photo credits in the bottom-right corner
   - Dismiss the development banner if desired

## 📱 Mobile Support

Weather Wise is fully responsive and optimized for mobile devices:

- **Touch-friendly interface** with larger buttons and touch targets
- **Vertical card layout** on mobile for better readability
- **Optimized text sizes** and spacing for smaller screens
- **Mobile-specific animations** and smooth transitions
- **Full-width cards** on mobile for maximum content visibility
- **Responsive development banner** that adapts to screen size