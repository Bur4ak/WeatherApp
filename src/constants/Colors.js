// Ana renkler ve tema tanımları
export const Colors = {
  primary: '#4A90E2',
  secondary: '#7B68EE',
  accent: '#FF6B6B',
  
  // Background gradients
  clearDay: ['#4A90E2', '#87CEEB'],
  clearNight: ['#2C3E50', '#4A90E2'],
  cloudy: ['#BDC3C7', '#95A5A6'],
  rainy: ['#34495E', '#2C3E50'],
  snowy: ['#ECF0F1', '#BDC3C7'],
  thunderstorm: ['#2C3E50', '#34495E'],
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.8)',
  textDark: '#2C3E50',
  
  // Card colors
  cardBackground: 'rgba(255, 255, 255, 0.15)',
  cardBorder: 'rgba(255, 255, 255, 0.2)',
  
  // Button colors
  buttonPrimary: 'rgba(255, 255, 255, 0.2)',
  buttonSecondary: 'rgba(0, 0, 0, 0.1)',
  
  // Status colors
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB'
};

// Hava durumu kodlarına göre renk temaları
export const WeatherThemes = {
  // Clear sky
  '01d': Colors.clearDay,
  '01n': Colors.clearNight,
  
  // Few clouds
  '02d': Colors.clearDay,
  '02n': Colors.clearNight,
  
  // Scattered/broken clouds
  '03d': Colors.cloudy,
  '03n': Colors.cloudy,
  '04d': Colors.cloudy,
  '04n': Colors.cloudy,
  
  // Rain
  '09d': Colors.rainy,
  '09n': Colors.rainy,
  '10d': Colors.rainy,
  '10n': Colors.rainy,
  
  // Thunderstorm
  '11d': Colors.thunderstorm,
  '11n': Colors.thunderstorm,
  
  // Snow
  '13d': Colors.snowy,
  '13n': Colors.snowy,
  
  // Mist
  '50d': Colors.cloudy,
  '50n': Colors.cloudy,
};

// Font sizes
export const FontSizes = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  huge: 48,
  massive: 72
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};