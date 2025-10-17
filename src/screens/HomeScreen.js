import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import { Colors, FontSizes, Spacing } from '../constants/Colors';
import WeatherAPI from '../services/weatherAPI';
import { formatTemperature, formatHumidity, formatWindSpeed, formatPressure, formatDate } from '../utils/formatters';
import WeatherIcons, { WindDirection } from '../utils/weatherIcons';
import { getBackgroundImage, getOverlayOpacity } from '../utils/backgroundImages';

const HomeScreen = ({ navigation }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCity, setCurrentCity] = useState('Şehir Ara');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Klavye event listener'ları
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // İlk yükleme - İstanbul'u göster
  useEffect(() => {
    loadDefaultWeather();
  }, []);

  const loadDefaultWeather = async () => {
    try {
      setLoading(true);
      const data = await WeatherAPI.getCurrentWeatherByCity('Istanbul');
      setWeatherData(data);
      setCurrentCity('İstanbul');
    } catch (error) {
      console.error('Varsayılan hava durumu yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  // Şehir arama
  const searchCity = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir şehir adı girin.');
      return;
    }

    try {
      setLoading(true);
      const data = await WeatherAPI.getCurrentWeatherByCity(searchQuery.trim());
      setWeatherData(data);
      setCurrentCity(data.name);
      setSearchQuery('');
    } catch (error) {
      Alert.alert('Hata', 'Bu şehir bulunamadı. Lütfen geçerli bir şehir adı girin.');
      console.error('Şehir arama hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Background image ve overlay
  const getBackgroundImageSource = () => {
    if (!weatherData) return getBackgroundImage('default');
    console.log('📱 HomeScreen: Hava durumu ikonu:', weatherData.weather[0].icon);
    return getBackgroundImage(weatherData.weather[0].icon);
  };

  const getBackgroundOverlay = () => {
    if (!weatherData) return 0.3;
    return getOverlayOpacity(weatherData.weather[0].icon);
  };

  // Hava durumu kartları
  const WeatherCard = ({ title, value, icon }) => (
    <View style={styles.card}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );

  return (
    <ImageBackground 
      source={getBackgroundImageSource()} 
      style={styles.container}
      resizeMode="cover"
    >
      {/* Dark overlay for text readability */}
      <View style={[styles.overlay, { opacity: getBackgroundOverlay() }]} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: keyboardVisible ? 150 : 100 } // Klavye açıksa daha fazla padding
            ]}
            keyboardShouldPersistTaps="handled"
          >
          
          {/* Ana Hava Durumu Alanı */}
          <View style={styles.mainWeather}>
            <Text style={styles.cityName}>{currentCity}</Text>
            
            {loading ? (
              <ActivityIndicator size="large" color={Colors.textPrimary} style={styles.loader} />
            ) : weatherData ? (
              <>
                <Text style={styles.date}>{formatDate(weatherData.dt)}</Text>
                
                <View style={styles.tempContainer}>
                  <Text style={styles.temperature}>
                    {formatTemperature(weatherData.main.temp)}
                  </Text>
                  <Text style={styles.weatherIcon}>
                    {WeatherIcons[weatherData.weather[0].icon] || '🌤️'}
                  </Text>
                </View>
                
                <Text style={styles.description}>
                  {weatherData.weather[0].description.charAt(0).toUpperCase() + 
                   weatherData.weather[0].description.slice(1)}
                </Text>
                
                <Text style={styles.feelsLike}>
                  Hissedilen {formatTemperature(weatherData.main.feels_like)}
                </Text>

                <View style={styles.minMax}>
                  <Text style={styles.minMaxText}>
                    Max {formatTemperature(weatherData.main.temp_max)} • Min {formatTemperature(weatherData.main.temp_min)}
                  </Text>
                </View>

                {/* Detay Kartları */}
                <View style={styles.detailCards}>
                  <View style={styles.cardRow}>
                    <WeatherCard 
                      title="Nem" 
                      value={formatHumidity(weatherData.main.humidity)} 
                      icon="💧"
                    />
                    <WeatherCard 
                      title="Rüzgar" 
                      value={formatWindSpeed(weatherData.wind?.speed || 0)}
                      icon="💨"
                    />
                  </View>
                  
                  <View style={styles.cardRow}>
                    <WeatherCard 
                      title="Basınç" 
                      value={formatPressure(weatherData.main.pressure)}
                      icon="🌡️"
                    />
                    <WeatherCard 
                      title="Görüş" 
                      value={`${(weatherData.visibility / 1000).toFixed(1)} km`}
                      icon="👁️"
                    />
                  </View>
                </View>

                {/* Detay Butonu */}
                <TouchableOpacity 
                  style={styles.detailButton}
                  onPress={() => navigation.navigate('Detail', { 
                    weatherData, 
                    cityName: currentCity 
                  })}
                >
                  <Text style={styles.detailButtonText}>Detaylı Hava Durumu</Text>
                  <Text style={styles.detailButtonIcon}>→</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.noData}>Hava durumu verisi yok</Text>
            )}
          </View>
          </ScrollView>

          {/* Arama Alanı - En Altta */}
          <View style={[
            styles.searchContainer,
            keyboardVisible && styles.searchContainerKeyboard
          ]}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Şehir adı girin (örn: Ankara, Istanbul)"
                placeholderTextColor={Colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={searchCity}
                returnKeyType="search"
                blurOnSubmit={true}
              />
              <TouchableOpacity onPress={searchCity} style={styles.searchButton}>
                <Text style={styles.searchIcon}>🔍</Text>
              </TouchableOpacity>
            </View>
          </View>

        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  keyboardAvoid: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100, // Search container için yer bırak (dinamik olarak değişecek)
  },
  mainWeather: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  cityName: {
    fontSize: FontSizes.xxlarge,
    color: Colors.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  date: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  loader: {
    marginVertical: Spacing.xxl,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  temperature: {
    fontSize: FontSizes.massive,
    color: Colors.textPrimary,
    fontWeight: '300',
    marginRight: Spacing.lg,
  },
  weatherIcon: {
    fontSize: 64,
  },
  description: {
    fontSize: FontSizes.xlarge,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    textTransform: 'capitalize',
  },
  feelsLike: {
    fontSize: FontSizes.large,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  minMax: {
    marginBottom: Spacing.xl,
  },
  minMaxText: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
  },
  noData: {
    fontSize: FontSizes.large,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
  
  // Detay Kartları
  detailCards: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    padding: Spacing.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  cardValue: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },

  // Detay Butonu
  detailButton: {
    backgroundColor: Colors.buttonPrimary,
    borderRadius: 25,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.lg,
  },
  detailButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  detailButtonIcon: {
    fontSize: FontSizes.large,
    color: Colors.textPrimary,
  },

  // Arama Alanı
  searchContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  searchContainerKeyboard: {
    // Klavye açıkken ek stiller
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingBottom: Spacing.md, // Daha az bottom padding
  },
  searchInputContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 25,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  searchButton: {
    padding: Spacing.sm,
  },
  searchIcon: {
    fontSize: FontSizes.large,
  },
});

export default HomeScreen;