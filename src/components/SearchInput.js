import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  Animated
} from 'react-native';
import { Colors, FontSizes, Spacing } from '../constants/Colors';
import WeatherAPI from '../services/weatherAPI';

const SearchInput = ({ onCitySelect, style }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fadeAnim = new Animated.Value(0);

  // Arama fonksiyonu
  useEffect(() => {
    const searchCities = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await WeatherAPI.searchCities(searchQuery);
        setSearchResults(results.slice(0, 5)); // İlk 5 sonuç
        setShowResults(true);
        
        // Sonuçları animate et
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Arama hatası:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchCities, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Şehir seçimi
  const handleCitySelect = (city) => {
    setSearchQuery(city.name);
    setShowResults(false);
    setSearchResults([]);
    
    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    
    onCitySelect(city);
  };

  // Search input temizle
  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Sonuç item render
  const renderSearchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleCitySelect(item)}
    >
      <Text style={styles.cityName}>{item.name}</Text>
      <Text style={styles.countryName}>{item.country}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {/* Search Input */}
      <View style={styles.searchInputContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Şehir ara..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <Animated.View 
          style={[styles.resultsContainer, { opacity: fadeAnim }]}
        >
          <FlatList
            data={searchResults}
            renderItem={renderSearchItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          />
        </Animated.View>
      )}
      
      {/* Loading indicator */}
      {isSearching && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Aranıyor...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 25,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  searchIcon: {
    fontSize: FontSizes.large,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    padding: 0,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  clearIcon: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
  },
  resultsContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    maxHeight: 200,
    zIndex: 1001,
  },
  resultItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  cityName: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  countryName: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  loadingContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.md,
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.small,
  },
});

export default SearchInput;