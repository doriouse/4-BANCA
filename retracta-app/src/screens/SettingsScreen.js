import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

export default function SettingsScreen({ navigation }) {
  const [region, setRegion] = useState({
    latitude: -23.6261, // Taboão da Serra como padrão inicial
    longitude: -46.7544,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [markerCoords, setMarkerCoords] = useState({
    latitude: -23.6261,
    longitude: -46.7544,
  });

  const [loadingGps, setLoadingGps] = useState(false);

  useEffect(() => {
    loadSavedLocation();
  }, []);

  const loadSavedLocation = async () => {
    try {
      const savedLat = await AsyncStorage.getItem('@retracta_lat');
      const savedLon = await AsyncStorage.getItem('@retracta_lon');
      if (savedLat && savedLon) {
        const lat = parseFloat(savedLat);
        const lon = parseFloat(savedLon);
        setRegion({ latitude: lat, longitude: lon, latitudeDelta: 0.05, longitudeDelta: 0.05 });
        setMarkerCoords({ latitude: lat, longitude: lon });
      }
    } catch (error) {
      // Usa padrão
    }
  };

  // Botão para ir direto para a localização atual do celular (GPS)
  const handleGetCurrentLocation = async () => {
    setLoadingGps(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoadingGps(false);
        Alert.alert('Permissão negada', 'Permita o acesso à localização para usar esta função.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
      setMarkerCoords({ latitude, longitude });
      setLoadingGps(false);
    } catch (error) {
      setLoadingGps(false);
      Alert.alert('Erro', 'Não foi possível obter a localização atual.');
    }
  };

  // Quando o usuário toca em qualquer lugar do mapa
  const handleMapPress = (e) => {
    const coords = e.nativeEvent.coordinate;
    setMarkerCoords(coords);
  };

  const saveLocation = async () => {
    try {
      await AsyncStorage.setItem('@retracta_lat', markerCoords.latitude.toString());
      await AsyncStorage.setItem('@retracta_lon', markerCoords.longitude.toString());
      // Salva um nome genérico baseado nas coordenadas para exibir no painel
      await AsyncStorage.setItem('@retracta_city', `Lat: ${markerCoords.latitude.toFixed(2)}, Lon: ${markerCoords.longitude.toFixed(2)}`);
      
      Alert.alert('Sucesso', 'Localização exata do varal salva com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a localização.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configurações e Localização</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Mapa do Varal (Geolocalização)</Text>
        <Text style={styles.label}>Toque no mapa para marcar onde o varal está instalado ou use o botão abaixo:</Text>

        <TouchableOpacity 
          style={styles.gpsButton} 
          onPress={handleGetCurrentLocation}
          disabled={loadingGps}>
          {loadingGps ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.gpsButtonText}>📍 Usar minha localização atual (GPS)</Text>
          )}
        </TouchableOpacity>

        {/* Componente de Mapa Interativo */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}>
            <Marker coordinate={markerCoords} title="Localização do Varal" />
          </MapView>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveLocation}>
          <Text style={styles.saveButtonText}>Salvar Localização no Mapa</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Suporte e Contato</Text>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:retractacompany@gmail.com')}>
          <Text style={styles.linkText}>Contato: retractacompany@gmail.com</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Encerrar Sessão</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#EAF0FE',
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'LexendGiga_700Bold',
    fontSize: 20,
    color: '#004AAD',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'LexendGiga_700Bold',
    fontSize: 14,
    color: '#004AAD',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#545454',
    marginBottom: 12,
  },
  gpsButton: {
    backgroundColor: '#38B6FF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  gpsButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    fontSize: 13,
  },
  mapContainer: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    marginBottom: 14,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  saveButton: {
    backgroundColor: '#004AAD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    fontSize: 14,
  },
  linkText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#38B6FF',
    textDecorationLine: 'underline',
  },
  logoutButton: {
    backgroundColor: '#FF944E',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  logoutText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    fontSize: 14,
  },
});