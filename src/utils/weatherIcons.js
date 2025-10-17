// Hava durumu kodlarına göre emoji/ikon mapping
export const WeatherIcons = {
  // Clear sky
  '01d': '☀️',
  '01n': '🌙',
  
  // Few clouds
  '02d': '⛅',
  '02n': '☁️',
  
  // Scattered clouds
  '03d': '☁️',
  '03n': '☁️',
  
  // Broken clouds
  '04d': '☁️',
  '04n': '☁️',
  
  // Shower rain
  '09d': '🌧️',
  '09n': '🌧️',
  
  // Rain
  '10d': '🌦️',
  '10n': '🌧️',
  
  // Thunderstorm
  '11d': '⛈️',
  '11n': '⛈️',
  
  // Snow
  '13d': '🌨️',
  '13n': '🌨️',
  
  // Mist
  '50d': '🌫️',
  '50n': '🌫️',
};

// Rüzgar yönü
export const WindDirection = {
  getDirection: (degree) => {
    if (!degree) return 'N';
    const directions = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BBK', 'BK', 'KBK'];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index];
  }
};

export default WeatherIcons;