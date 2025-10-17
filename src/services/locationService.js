import * as Location from 'expo-location';
import { Alert } from 'react-native';

class LocationService {
  // Konum izni kontrolü ve konum alma
  static async getCurrentLocation() {
    try {
      // Konum iznini kontrol et
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Konum İzni',
          'Hava durumu bilgisi alabilmek için konum iznine ihtiyacımız var.',
          [{ text: 'Tamam' }]
        );
        return null;
      }

      // Mevcut konumu al
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
    } catch (error) {
      console.error('Konum alınamadı:', error);
      Alert.alert('Hata', 'Konum bilgisi alınamadı. Lütfen tekrar deneyin.');
      return null;
    }
  }

  // Koordinatları adrese çevirme (reverse geocoding)
  static async getAddressFromCoords(latitude, longitude) {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (response && response.length > 0) {
        const address = response[0];
        return {
          city: address.city || address.district || address.subregion,
          country: address.country,
          region: address.region
        };
      }
      
      return null;
    } catch (error) {
      console.error('Adres çevrilemedi:', error);
      return null;
    }
  }
}

export default LocationService;