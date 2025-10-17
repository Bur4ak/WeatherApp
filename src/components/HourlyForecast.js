import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Colors, FontSizes, Spacing } from '../constants/Colors';
import WeatherIcons from '../utils/weatherIcons';
import { formatTime, formatTemperature } from '../utils/formatters';

const HourlyForecastItem = ({ item, timezone }) => {
  const time = formatTime(item.dt, timezone);
  const temp = formatTemperature(item.main.temp);
  const icon = WeatherIcons[item.weather[0].icon] || '🌤️';
  const rainChance = item.pop ? Math.round(item.pop * 100) : 0;

  return (
    <View style={styles.hourlyItem}>
      <Text style={styles.hourTime}>{time}</Text>
      <Text style={styles.hourIcon}>{icon}</Text>
      <Text style={styles.hourTemp}>{temp}</Text>
      {rainChance > 0 && (
        <View style={styles.rainChance}>
          <Text style={styles.rainText}>💧</Text>
          <Text style={styles.rainPercent}>{rainChance}%</Text>
        </View>
      )}
    </View>
  );
};

const HourlyForecast = ({ forecast, timezone, style }) => {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  // İlk 24 saatlik tahmin
  const hourlyData = forecast.slice(0, 24);

  const renderHourlyItem = ({ item }) => (
    <HourlyForecastItem item={item} timezone={timezone} />
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.sectionTitle}>24 Saatlik Tahmin</Text>
      <FlatList
        data={hourlyData}
        renderItem={renderHourlyItem}
        keyExtractor={(item) => item.dt.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

// 7 günlük tahmin komponenti
export const DailyForecast = ({ forecast, timezone, style }) => {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  // Günlük verileri grupla (her günün ilk tahminini al)
  const dailyData = [];
  const seenDates = new Set();
  
  forecast.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!seenDates.has(date)) {
      seenDates.add(date);
      dailyData.push(item);
    }
  });

  const renderDailyItem = ({ item }) => {
    const date = new Date(item.dt * 1000);
    const dayName = date.toLocaleDateString('tr-TR', { weekday: 'short' });
    const dayDate = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    const maxTemp = formatTemperature(item.main.temp_max);
    const minTemp = formatTemperature(item.main.temp_min);
    const icon = WeatherIcons[item.weather[0].icon] || '🌤️';
    const description = item.weather[0].description;

    return (
      <View style={styles.dailyItem}>
        <View style={styles.dailyLeft}>
          <Text style={styles.dayName}>{dayName}</Text>
          <Text style={styles.dayDate}>{dayDate}</Text>
        </View>
        
        <View style={styles.dailyCenter}>
          <Text style={styles.dailyIcon}>{icon}</Text>
          <Text style={styles.dailyDescription}>{description}</Text>
        </View>
        
        <View style={styles.dailyRight}>
          <Text style={styles.dailyMaxTemp}>{maxTemp}</Text>
          <Text style={styles.dailyMinTemp}>{minTemp}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.sectionTitle}>7 Günlük Tahmin</Text>
      <FlatList
        data={dailyData.slice(0, 7)}
        renderItem={renderDailyItem}
        keyExtractor={(item) => item.dt.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginVertical: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  listContainer: {
    paddingHorizontal: Spacing.xs,
  },
  
  // Saatlik tahmin stilleri
  hourlyItem: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    minWidth: 70,
  },
  hourTime: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  hourIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  hourTemp: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  rainChance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  rainText: {
    fontSize: FontSizes.small,
  },
  rainPercent: {
    fontSize: FontSizes.small,
    color: Colors.info,
    marginLeft: 2,
  },
  
  // Günlük tahmin stilleri
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  dailyLeft: {
    flex: 1,
  },
  dayName: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  dayDate: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dailyCenter: {
    flex: 2,
    alignItems: 'center',
  },
  dailyIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  dailyDescription: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  dailyRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dailyMaxTemp: {
    fontSize: FontSizes.large,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  dailyMinTemp: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default HourlyForecast;