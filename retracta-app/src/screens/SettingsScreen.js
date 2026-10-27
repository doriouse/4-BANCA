import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

export default function SettingsScreen({ navigation }) {
  const [coordsText, setCoordsText] = useState('Nenhuma localização salva');
  const [loadingGps, setLoadingGps] = useState(false);

  useEffect(() => {
    loadSavedCoords();
  }, []);

  const loadSavedCoords = async () => {
    try {
      const savedLat = await AsyncStorage.getItem('@retracta_lat');
      const savedLon = await AsyncStorage.getItem('@retracta_lon');
      const savedName = await AsyncStorage.getItem('@retracta_city');

      if (savedLat && savedLon) {
        setCoordsText(`${savedName || 'Localização Personalizada'}\nLat: ${parseFloat(savedLat).toFixed(4)}, Lon: ${parseFloat(savedLon).toFixed(4)}`);
      }
    } catch (error) {
      // Ignora erro
    }
  };

  const handleGetGPSLocation = async () => {
    setLoadingGps(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoadingGps(false);
        Alert.alert('Permissão negada', 'Permita o acesso à localização nas configurações do seu celular para usar esta função.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;

      // Salva as coordenadas exatas
      await AsyncStorage.setItem('@retracta_lat', latitude.toString());
      await AsyncStorage.setItem('@retracta_lon', longitude.toString());
      await AsyncStorage.setItem('@retracta_city', 'Minha Localização GPS');

      setCoordsText(`Minha Localização GPS\nLat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
      setLoadingGps(false);
      Alert.alert('Sucesso', 'Localização do varal atualizada com sucesso via GPS!');
    } catch (error) {
      setLoadingGps(false);
      Alert.alert('Erro', 'Não foi possível obter a localização atual. Verifique se o GPS do celular está ligado.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configurações de Localização</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>GPS do Varal</Text>
        <Text style={styles.label}>
          Clique no botão abaixo para capturar automaticamente a latitude e longitude exatas de onde o seu varal está instalado:
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{coordsText}</Text>
        </View>

        <TouchableOpacity 
          style={styles.gpsButton} 
          onPress={handleGetGPSLocation}
          disabled={loadingGps}>
          {loadingGps ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.gpsButtonText}>📍 Capturar Localização Atual (GPS)</Text>
          )}
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
    marginBottom: 14,
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: '#F4F7FE',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    marginBottom: 14,
  },
  infoText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#004AAD',
    textAlign: 'center',
  },
  gpsButton: {
    backgroundColor: '#004AAD',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  gpsButtonText: {
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