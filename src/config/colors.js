export const colors = {
  // Primary Colors
  primary: {
    gradient: {
      start: '#667eea',
      end: '#764ba2'
    },
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
  banner: {
    start: '#ff6b6b',
    end: '#ee5a24'
  },

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

// CSS Custom Properties Generator
export const generateCSSVariables = () => {
  return `
    :root {
      /* Primary Colors */
      --primary-gradient-start: ${colors.primary.gradient.start};
      --primary-gradient-end: ${colors.primary.gradient.end};
      --primary-color: ${colors.primary.base};
      --primary-hover: ${colors.primary.hover};
      --primary-light: ${colors.primary.light};
      --primary-dark: ${colors.primary.dark};

      /* Accent Colors */
      --accent-color: ${colors.accent.base};
      --accent-hover: ${colors.accent.hover};
      --accent-light: ${colors.accent.light};
      --accent-dark: ${colors.accent.dark};

      /* Background Colors */
      --background-light: ${colors.background.light};
      --background-white: ${colors.background.white};
      --background-overlay: ${colors.background.overlay};
      --background-card: ${colors.background.card};
      --background-card-solid: ${colors.background.cardSolid};
      --background-card-glass: ${colors.background.cardGlass};

      /* Text Colors */
      --text-primary: ${colors.text.primary};
      --text-secondary: ${colors.text.secondary};
      --text-tertiary: ${colors.text.tertiary};
      --text-white: ${colors.text.white};
      --text-light: ${colors.text.light};

      /* Status Colors */
      --status-error: ${colors.status.error};
      --status-success: ${colors.status.success};
      --status-success-hover: ${colors.status.successHover};
      --status-warning: ${colors.status.warning};
      --status-info: ${colors.status.info};
      --status-disabled: ${colors.status.disabled};

      /* Banner Colors */
      --banner-start: ${colors.banner.start};
      --banner-end: ${colors.banner.end};

      /* Border Colors */
      --border-light: ${colors.border.light};
      --border-medium: ${colors.border.medium};
      --border-white: ${colors.border.white};

      /* Rain Colors */
      --rain-start: ${colors.rain.start};
      --rain-end: ${colors.rain.end};

      /* Shadow Colors */
      --shadow-light: ${colors.shadow.light};
      --shadow-medium: ${colors.shadow.medium};
      --shadow-dark: ${colors.shadow.dark};
    }
  `
}
