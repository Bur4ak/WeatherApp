// Hava durumu arka plan resimleri
const BackgroundImages = {
  // Açık hava - Güneşli
  '01d': require('../../assets/backgrounds/sunny.jpg'),      // Clear sky day
  '02d': require('../../assets/backgrounds/partlycloude.jpg'),      // Few clouds day
  
  // Gece
  '01n': require('../../assets/backgrounds/clearnight.jpg'),      // Clear sky night
  '02n': require('../../assets/backgrounds/partlycloudenight.jpg'),      // Few clouds night
  '03n': require('../../assets/backgrounds/cloudynight.jpg'),      // Scattered clouds night
  '04n': require('../../assets/backgrounds/partlycloudenight.jpg'),      // Broken clouds night
  '09n': require('../../assets/backgrounds/rainynight.jpg'),      // Shower rain night
  '10n': require('../../assets/backgrounds/rainynight.jpg'),      // Rain night
  '11n': require('../../assets/backgrounds/thunderstorm.jpg'), // Thunderstorm night
  '13n': require('../../assets/backgrounds/snowynight.jpg'),      // Snow night ← KAR!
  '50n': require('../../assets/backgrounds/mistnight.jpg'),     // Mist night
  
  // Gündüz bulutlu
  '03d': require('../../assets/backgrounds/cloudy.jpg'),     // Scattered clouds
  '04d': require('../../assets/backgrounds/partlycloude.jpg'),     // Broken clouds
  
  // Yağmur
  '09d': require('../../assets/backgrounds/rainy.jpg'),      // Shower rain
  '10d': require('../../assets/backgrounds/rainy.jpg'),      // Rain
  
  // Fırtına
  '11d': require('../../assets/backgrounds/thunderstorm.jpg'), // Thunderstorm
  
  // Kar - İşte bu! ❄️
  '13d': require('../../assets/backgrounds/snowy.jpg'),      // Snow day ← KAR!
  
  // Sis/Pus
  '50d': require('../../assets/backgrounds/mist.jpg'),     // Mist
  
  // Varsayılan
  'default': require('../../assets/backgrounds/clear.jpg')
};

// Debug için console log
export const getBackgroundImage = (weatherIcon) => {
  console.log('🖼️ Background Image İsteniyor:', weatherIcon);
  
  if (!weatherIcon) {
    console.log('🖼️ Varsayılan resim kullanılıyor');
    return BackgroundImages.default;
  }
  
  // Önce tam kodu kontrol et
  if (BackgroundImages[weatherIcon]) {
    const imageName = Object.keys(BackgroundImages).find(key => 
      BackgroundImages[key] === BackgroundImages[weatherIcon]
    );
    console.log('🖼️ Resim bulundu:', weatherIcon, '→', getImageName(weatherIcon));
    return BackgroundImages[weatherIcon];
  }
  
  console.log('🖼️ Resim bulunamadı, varsayılan kullanılıyor');
  return BackgroundImages.default;
};

// Debug için resim adını getir
const getImageName = (weatherIcon) => {
  if (['01d', '02d'].includes(weatherIcon)) return 'sunny.jpg ☀️';
  if (['01n', '02n', '03n', '04n'].includes(weatherIcon)) return 'night.jpg 🌙';
  if (['03d', '04d', '50d', '50n'].includes(weatherIcon)) return 'cloudy.jpg ☁️';
  if (['09d', '09n', '10d', '10n'].includes(weatherIcon)) return 'rainy.jpg 🌧️';
  if (['11d', '11n'].includes(weatherIcon)) return 'thunderstorm.jpg ⛈️';
  if (['13d', '13n'].includes(weatherIcon)) return 'snowy.jpg ❄️';
  return 'default.jpg';
};

// Hava durumu tipine göre overlay opacity
export const getOverlayOpacity = (weatherIcon) => {
  console.log('🎨 Overlay opacity hesaplanıyor:', weatherIcon);
  
  if (!weatherIcon) return 0.3;
  
  // Karanlık havalar için daha az overlay
  const darkWeathers = ['09d', '09n', '10d', '10n', '11d', '11n', '13d', '13n', '50d', '50n'];
  
  if (darkWeathers.includes(weatherIcon)) {
    return 0.2; // Karanlık resimler için az overlay
  }
  
  // Parlak havalar için daha fazla overlay  
  return 0.4; // Parlak resimler için fazla overlay
};

// Gradient fonksiyonu (geriye dönük uyumluluk)
export const getGradientColors = (weatherIcon) => {
  console.log('🌈 Gradient colors istendi (kullanılmayacak):', weatherIcon);
  return ['#4A90E2', '#87CEEB'];
};

export default BackgroundImages;