// Sıcaklık formatları
export const formatTemperature = (temp) => {
  const roundedTemp = Math.round(temp);
  return `${roundedTemp}°`;
};

// Nem formatı
export const formatHumidity = (humidity) => {
  return `%${humidity}`;
};

// Rüzgar hızı formatı
export const formatWindSpeed = (speed) => {
  const kmh = Math.round(speed * 3.6);
  return `${kmh} km/h`;
};

// Basınç formatı
export const formatPressure = (pressure) => {
  return `${pressure} hPa`;
};

// Görüş mesafesi formatı
export const formatVisibility = (visibility) => {
  if (visibility >= 1000) {
    return `${(visibility / 1000).toFixed(1)} km`;
  }
  return `${visibility} m`;
};

// Tarih formatı
export const formatDate = (timestamp, timezone = 0) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC'
  });
};

// Saat formatı (timezone desteği ile)
export const formatTime = (timestamp, timezone = 0) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  });
};