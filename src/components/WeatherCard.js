import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes, Spacing } from '../constants/Colors';
import WeatherIcons from '../utils/weatherIcons';
import { 
  formatTemperature, 
  formatHumidity, 
  formatWindSpeed, 
  formatPressure,
  formatVisibility
} from '../utils/formatters';

const WeatherCard = ({ title, icon, value, subtitle, style, size = 'medium' }) => {
  const cardStyles = [
    styles.card,
    size === 'large' ? styles.largeCard : size === 'small' ? styles.smallCard : styles.mediumCard,
    style
  ];

  return (
    <View style={cardStyles}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={styles.content}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <View style={styles.textContainer}>
          <Text style={[styles.value, size === 'large' ? styles.largeValue : null]}>
            {value}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

// Özel hava durumu kartları
export const TemperatureCard = ({ temperature, feelsLike, condition, icon }) => (
  <WeatherCard
    value={formatTemperature(temperature)}
    subtitle={`Hissedilen ${formatTemperature(feelsLike)}`}
    icon={WeatherIcons[icon] || '🌤️'}
    size="large"
    style={styles.temperatureCard}
  />
);

export const HumidityCard = ({ humidity }) => (
  <WeatherCard
    title="Nem"
    icon="💧"
    value={formatHumidity(humidity)}
    size="small"
  />
);

export const WindCard = ({ speed, direction }) => (
  <WeatherCard
    title="Rüzgar"
    icon="💨"
    value={formatWindSpeed(speed)}
    subtitle={direction ? `${direction}` : null}
    size="small"
  />
);

export const PressureCard = ({ pressure }) => (
  <WeatherCard
    title="Basınç"
    icon="⏲️"
    value={formatPressure(pressure)}
    size="small"
  />
);

export const VisibilityCard = ({ visibility }) => (
  <WeatherCard
    title="Görüş"
    icon="👁️"
    value={formatVisibility(visibility)}
    size="small"
  />
);

export const UVIndexCard = ({ uvIndex }) => {
  const getUVColor = (uv) => {
    if (uv <= 2) return Colors.success;
    if (uv <= 5) return Colors.warning;
    if (uv <= 7) return '#E67E22';
    if (uv <= 10) return Colors.error;
    return '#8E44AD';
  };

  return (
    <WeatherCard
      title="UV İndeksi"
      icon="☀️"
      value={uvIndex?.toFixed(1) || '0'}
      size="small"
      style={{ borderLeftWidth: 3, borderLeftColor: getUVColor(uvIndex) }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backdropFilter: 'blur(10px)',
  },
  smallCard: {
    minHeight: 80,
    flex: 1,
    marginHorizontal: 4,
  },
  mediumCard: {
    minHeight: 100,
    flex: 1,
    marginHorizontal: 4,
  },
  largeCard: {
    minHeight: 120,
    marginBottom: Spacing.lg,
  },
  temperatureCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  value: {
    fontSize: FontSizes.large,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  largeValue: {
    fontSize: FontSizes.massive,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default WeatherCard;