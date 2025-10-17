import axios from 'axios';
import { OPENWEATHER_API_KEY } from '@env';
import Constants from 'expo-constants';
const API_KEY = Constants.expoConfig.extra.OPENWEATHER_API_KEY; // Geçici test key - kendi key'ini ekle
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherAPI {
  // Şehir adına göre mevcut hava durumu
  static async getCurrentWeatherByCity(cityName) {
    try {
      console.log(`Searching weather for: ${cityName}`);
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: cityName,
          appid: API_KEY,
          units: 'metric',
          lang: 'tr'
        }
      });
      console.log('Weather data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Şehir hava durumu hatası:', error.response?.data || error.message);
      throw error;
    }
  }

  // Koordinatlara göre mevcut hava durumu
  static async getCurrentWeatherByCoords(lat, lon) {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'tr'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Hava durumu alınamadı:', error);
      throw error;
    }
  }

  // 5 günlük tahmin
  static async getForecast(lat, lon) {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'tr'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Hava durumu tahmini alınamadı:', error);
      throw error;
    }
  }

  // Şehir arama önerileri
  static async searchCities(query) {
    try {
      if (query.length < 2) return [];
      
      const response = await axios.get(`${BASE_URL}/find`, {
        params: {
          q: query,
          appid: API_KEY,
          units: 'metric',
          lang: 'tr',
          cnt: 5
        }
      });
      return response.data.list || [];
    } catch (error) {
      console.error('Şehir arama hatası:', error);
      return [];
    }
  }
}

export default WeatherAPI;