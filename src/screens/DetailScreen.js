import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ImageBackground
} from 'react-native';
import { Colors, FontSizes, Spacing } from '../constants/Colors';
import { formatTemperature, formatHumidity, formatWindSpeed, formatPressure, formatTime } from '../utils/formatters';
import WeatherIcons, { WindDirection } from '../utils/weatherIcons';
import { getBackgroundImage, getOverlayOpacity } from '../utils/backgroundImages';

const DetailScreen = ({ route, navigation }) => {
  const { weatherData, cityName } = route.params || {};

  const goBack = () => {
    navigation.goBack();
  };

  // Background image ve overlay
  const getBackgroundImageSource = () => {
    if (!weatherData) return getBackgroundImage('default');
    console.log('📱 DetailScreen: Hava durumu ikonu:', weatherData.weather[0].icon);
    return getBackgroundImage(weatherData.weather[0].icon);
  };

  const getBackgroundOverlay = () => {
    if (!weatherData) return 0.3;
    return getOverlayOpacity(weatherData.weather[0].icon);
  };

  const DetailCard = ({ title, value, subtitle, icon }) => (
    <View style={styles.detailCard}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    </View>
  );

  if (!weatherData) {
    return (
      <ImageBackground 
        source={getBackgroundImage('default')} 
        style={styles.container}
        resizeMode="cover"
      >
        <View style={[styles.overlay, { opacity: 0.3 }]} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Detay</Text>
            <View style={styles.placeholder} />
          </View>
          <View style={styles.centerContent}>
            <Text style={styles.noData}>Hava durumu verisi bulunamadı</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={getBackgroundImageSource()} 
      style={styles.container}
      resizeMode="cover"
    >
      {/* Dark overlay for text readability */}
      <View style={[styles.overlay, { opacity: getBackgroundOverlay() }]} />
      
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{cityName}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          
          {/* Ana Bilgiler */}
          <View style={styles.mainInfo}>
            <Text style={styles.mainTemp}>
              {formatTemperature(weatherData.main.temp)}
            </Text>
            <Text style={styles.mainIcon}>
              {WeatherIcons[weatherData.weather[0].icon] || '🌤️'}
            </Text>
            <Text style={styles.mainDescription}>
              {weatherData.weather[0].description.charAt(0).toUpperCase() + 
               weatherData.weather[0].description.slice(1)}
            </Text>
            <Text style={styles.feelsLike}>
              Hissedilen {formatTemperature(weatherData.main.feels_like)}
            </Text>
          </View>

          {/* Detaylı Bilgiler */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Detaylı Bilgiler</Text>
            
            <View style={styles.cardGrid}>
              <DetailCard
                title="Nem Oranı"
                value={formatHumidity(weatherData.main.humidity)}
                icon="💧"
              />
              
              <DetailCard
                title="Rüzgar"
                value={formatWindSpeed(weatherData.wind?.speed || 0)}
                subtitle={`${WindDirection.getDirection(weatherData.wind?.deg || 0)}${
                  weatherData.wind?.gust ? ` • Şiddet: ${formatWindSpeed(weatherData.wind.gust)}` : ''
                }`}
                icon="💨"
              />
              
              <DetailCard
                title="Basınç"
                value={formatPressure(weatherData.main.pressure)}
                subtitle={weatherData.main.sea_level ? `Deniz: ${formatPressure(weatherData.main.sea_level)}` : ''}
                icon="⏲️"
              />
              
              <DetailCard
                title="Görüş Mesafesi"
                value={`${(weatherData.visibility / 1000).toFixed(1)} km`}
                icon="👁️"
              />
              
              <DetailCard
                title="Bulutluluk"
                value={`%${weatherData.clouds.all}`}
                icon="☁️"
              />
              
              <DetailCard
                title="Koordinatlar"
                value={`${weatherData.coord.lat.toFixed(2)}°, ${weatherData.coord.lon.toFixed(2)}°`}
                subtitle={`${weatherData.sys.country}`}
                icon="🌍"
              />
            </View>

            {/* Sıcaklık Detayları */}
            <View style={styles.tempSection}>
              <Text style={styles.sectionTitle}>Sıcaklık Detayları</Text>
              <View style={styles.tempDetails}>
                <View style={styles.tempItem}>
                  <Text style={styles.tempLabel}>Şu Anki</Text>
                  <Text style={styles.tempValue}>{formatTemperature(weatherData.main.temp)}</Text>
                </View>
                <View style={styles.tempItem}>
                  <Text style={styles.tempLabel}>Maksimum</Text>
                  <Text style={styles.tempValue}>{formatTemperature(weatherData.main.temp_max)}</Text>
                </View>
                <View style={styles.tempItem}>
                  <Text style={styles.tempLabel}>Minimum</Text>
                  <Text style={styles.tempValue}>{formatTemperature(weatherData.main.temp_min)}</Text>
                </View>
                <View style={styles.tempItem}>
                  <Text style={styles.tempLabel}>Hissedilen</Text>
                  <Text style={styles.tempValue}>{formatTemperature(weatherData.main.feels_like)}</Text>
                </View>
              </View>
            </View>

            {/* Güneş Bilgileri */}
            <View style={styles.sunSection}>
              <Text style={styles.sectionTitle}>Güneş</Text>
              <View style={styles.sunDetails}>
                <View style={styles.sunItem}>
                  <Text style={styles.sunIcon}>🌅</Text>
                  <Text style={styles.sunLabel}>Doğuş</Text>
                  <Text style={styles.sunTime}>
                    {formatTime(weatherData.sys.sunrise, weatherData.timezone)}
                  </Text>
                </View>
                <View style={styles.sunItem}>
                  <Text style={styles.sunIcon}>🌇</Text>
                  <Text style={styles.sunLabel}>Batış</Text>
                  <Text style={styles.sunTime}>
                    {formatTime(weatherData.sys.sunset, weatherData.timezone)}
                  </Text>
                </View>
              </View>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: Spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  backIcon: {
    fontSize: FontSizes.xlarge,
    color: Colors.textPrimary,
  },
  headerTitle: {
    fontSize: FontSizes.xlarge,
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    fontSize: FontSizes.large,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  
  // Ana bilgiler
  mainInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  mainTemp: {
    fontSize: 80,
    color: Colors.textPrimary,
    fontWeight: '300',
    marginBottom: Spacing.sm,
  },
  mainIcon: {
    fontSize: 64,
    marginBottom: Spacing.sm,
  },
  mainDescription: {
    fontSize: FontSizes.xlarge,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    textTransform: 'capitalize',
  },
  feelsLike: {
    fontSize: FontSizes.large,
    color: Colors.textSecondary,
  },

  // Detay section
  detailSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.xlarge,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },

  // Kart grid
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  detailCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    padding: Spacing.md,
    alignItems: 'center',
    width: '48%',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: FontSizes.large,
    color: Colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },

  // Sıcaklık section
  tempSection: {
    marginBottom: Spacing.xl,
  },
  tempDetails: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tempItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tempLabel: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
  },
  tempValue: {
    fontSize: FontSizes.large,
    color: Colors.textPrimary,
    fontWeight: '600',
  },

  // Güneş section
  sunSection: {
    marginBottom: Spacing.xl,
  },
  sunDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  sunItem: {
    alignItems: 'center',
  },
  sunIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  sunLabel: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  sunTime: {
    fontSize: FontSizes.large,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

export default DetailScreen;