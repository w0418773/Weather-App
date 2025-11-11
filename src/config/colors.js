export const lightTheme = {
  // Primary Colors
  primary: {
    gradient: { start: '#667eea', end: '#764ba2' },
    base: '#764ba2',
    hover: '#6b46c1',
    light: '#8b5fbf',
    dark: '#5a3d85'
  },
  // Accent Colors
  accent: {
    base: '#87ceeb',
    hover: '#5dade2',
    light: '#a8d8f0',
    dark: '#4a9bc1'
  },
  // Background Colors
  background: {
    light: '#eaf6fb',
    white: '#ffffff',
    overlay: 'rgba(234, 246, 251, 0.25)',
    card: 'rgba(255, 255, 255, 0.5)',
    cardSolid: 'rgba(255, 255, 255, 0.9)',
    cardGlass: 'rgba(118, 75, 162, 0.733)'
  },
  // Text Colors
  text: {
    primary: '#222222',
    secondary: '#666666',
    tertiary: '#888888',
    white: '#ffffff',
    light: '#cccccc'
  },
  // Status Colors
  status: {
    error: '#d00000',
    success: '#28a745',
    successHover: '#218838',
    warning: '#ffc107',
    info: '#17a2b8',
    disabled: '#9ca3af'
  },
  // Development Banner
  banner: { start: '#ff6b6b', end: '#ee5a24' },
  // Border Colors
  border: {
    light: '#bbbbbb',
    medium: '#dddddd',
    white: '#ffffff'
  },
  // Rain Animation Colors
  rain: {
    start: 'rgba(102, 126, 234, 0.8)',
    end: 'rgba(118, 75, 162, 0.3)'
  },
  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.2)',
    medium: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(0, 0, 0, 0.3)'
  }
}

export const darkTheme = {
  // Primary Colors
  primary: {
    gradient: { start: '#667eea', end: '#764ba2' },
    base: '#764ba2',
    hover: '#8b5fbf',
    light: '#9d7bc7',
    dark: '#5a3d85'
  },
  // Accent Colors
  accent: {
    base: '#87ceeb',
    hover: '#a8d8f0',
    light: '#c1e4f7',
    dark: '#4a9bc1'
  },
  // Background Colors
  background: {
    light: '#1a1a1a',
    white: '#2d2d2d',
    overlay: 'rgba(0, 0, 0, 0.4)',
    card: 'rgba(45, 45, 45, 0.8)',
    cardSolid: 'rgba(45, 45, 45, 0.95)',
    cardGlass: 'rgba(118, 75, 162, 0.8)'
  },
  // Text Colors
  text: {
    primary: '#ffffff',
    secondary: '#cccccc',
    tertiary: '#999999',
    white: '#ffffff',
    light: '#888888'
  },
  // Status Colors
  status: {
    error: '#ff4444',
    success: '#44aa44',
    successHover: '#399739',
    warning: '#ffaa00',
    info: '#44aaff',
    disabled: '#666666'
  },
  // Development Banner
  banner: { start: '#ff6b6b', end: '#ee5a24' },
  // Border Colors
  border: {
    light: '#444444',
    medium: '#555555',
    white: '#666666'
  },
  // Rain Animation Colors
  rain: {
    start: 'rgba(102, 126, 234, 0.6)',
    end: 'rgba(118, 75, 162, 0.3)'
  },
  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.4)',
    medium: 'rgba(0, 0, 0, 0.3)',
    dark: 'rgba(0, 0, 0, 0.6)'
  }
}

export const colors = lightTheme // Default to light theme

// CSS Custom Properties Generator
export const generateCSSVariables = (theme = lightTheme) => {
  return `
    :root {
      /* Primary Colors */
      --primary-gradient-start: ${theme.primary.gradient.start};
      --primary-gradient-end: ${theme.primary.gradient.end};
      --primary-color: ${theme.primary.base};
      --primary-hover: ${theme.primary.hover};
      --primary-light: ${theme.primary.light};
      --primary-dark: ${theme.primary.dark};

      /* Accent Colors */
      --accent-color: ${theme.accent.base};
      --accent-hover: ${theme.accent.hover};
      --accent-light: ${theme.accent.light};
      --accent-dark: ${theme.accent.dark};

      /* Background Colors */
      --background-light: ${theme.background.light};
      --background-white: ${theme.background.white};
      --background-overlay: ${theme.background.overlay};
      --background-card: ${theme.background.card};
      --background-card-solid: ${theme.background.cardSolid};
      --background-card-glass: ${theme.background.cardGlass};

      /* Text Colors */
      --text-primary: ${theme.text.primary};
      --text-secondary: ${theme.text.secondary};
      --text-tertiary: ${theme.text.tertiary};
      --text-white: ${theme.text.white};
      --text-light: ${theme.text.light};

      /* Status Colors */
      --status-error: ${theme.status.error};
      --status-success: ${theme.status.success};
      --status-success-hover: ${theme.status.successHover};
      --status-warning: ${theme.status.warning};
      --status-info: ${theme.status.info};
      --status-disabled: ${theme.status.disabled};

      /* Banner Colors */
      --banner-start: ${theme.banner.start};
      --banner-end: ${theme.banner.end};

      /* Border Colors */
      --border-light: ${theme.border.light};
      --border-medium: ${theme.border.medium};
      --border-white: ${theme.border.white};

      /* Rain Colors */
      --rain-start: ${theme.rain.start};
      --rain-end: ${theme.rain.end};

      /* Shadow Colors */
      --shadow-light: ${theme.shadow.light};
      --shadow-medium: ${theme.shadow.medium};
      --shadow-dark: ${theme.shadow.dark};
    }
  `
}
