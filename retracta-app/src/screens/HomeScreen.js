import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from '../config/firebase';
import { ref, onValue, set } from 'firebase/database';

export default function HomeScreen() {
  const [deviceState, setDeviceState] = useState({
    status: 'aberto', // 'aberto', 'retraido', 'movimentando'
    lastUpdate: 'Agora mesmo',
    isOnline: true,
  });

  const [cityName, setCityName] = useState('São Paulo');
  const [weatherData, setWeatherData] = useState({
    temp: '--',
    description: 'Carregando clima...',
  });

  const deviceId = 'varal_01';
  const WEATHER_API_KEY = 'SUA_CHAVE_OPENWEATHERMAP'; // Substitua pela sua chave do OpenWeatherMap

  // Carregar cidade salva nas configurações sempre que a tela focar
  useFocusEffect(
    useCallback(() => {
      loadSavedCity();
    }, [])
  );

  const loadSavedCity = async () => {
    try {
      const savedCity = await AsyncStorage.getItem('@retracta_city');
      if (savedCity) {
        setCityName(savedCity);
        fetchWeather(savedCity);
      } else {
        fetchWeather('São Paulo');
      }
    } catch (error) {
      fetchWeather('São Paulo');
    }
  };

  const fetchWeather = async (city) => {
    if (WEATHER_API_KEY === 'SUA_CHAVE_OPENWEATHERMAP') {
      setWeatherData({ temp: '24°C', description: 'Parcialmente nublado' });
      return;
    }
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=pt_br&appid=${WEATHER_API_KEY}`
      );
      const data = await response.json();
      if (response.ok) {
        setWeatherData({
          temp: `${Math.round(data.main.temp)}°C`,
          description: data.weather[0].description,
        });
      } else {
        setWeatherData({ temp: '--', description: 'Cidade não encontrada' });
      }
    } catch (error) {
      setWeatherData({ temp: '--', description: 'Erro ao carregar clima' });
    }
  };

  useEffect(() => {
    const statusRef = ref(database, `devices/${deviceId}/status`);
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDeviceState({
          status: data.status || 'aberto',
          lastUpdate: data.lastUpdate || new Date().toLocaleTimeString(),
          isOnline: data.isOnline !== undefined ? data.isOnline : true,
        });
      } else {
        // Fallback caso o nó não exista ainda no Realtime Database
        setDeviceState({
          status: 'aberto',
          lastUpdate: 'Conectado ao Firebase',
          isOnline: true,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const sendCommand = (command) => {
    const commandRef = ref(database, `devices/${deviceId}/commands`);
    set(commandRef, {
      action: command,
      timestamp: Date.now(),
      status: 'pending'
    });
  };

  const isRetracted = deviceState.status === 'retraido';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Indicador de Conectividade */}
      <View style={[styles.bannerOffline, { backgroundColor: deviceState.isOnline ? '#38B6FF' : '#FF944E' }]}>
        <Text style={styles.bannerText}>
          {deviceState.isOnline ? '🟢 Dispositivo Online Conectado' : '🟠 Dispositivo Offline (Exibindo último estado)'}
        </Text>
      </View>

      {/* Imagem Visual do Varal (Preparada para assets/images/varal_aberto.png / varal_retraido.png) */}
      <View style={styles.imageCard}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>
            {isRetracted ? '🌧️ [ Varal Retraído / Protegido ]' : '☀️ [ Varal Estendido / Aberto ]'}
          </Text>
          <Text style={styles.imageSubtext}>
            {isRetracted ? 'Estrutura elevada sob o teto' : 'Estrutura horizontal estendida'}
          </Text>
        </View>
      </View>

      {/* Status Visual do Varal */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estado Atual</Text>
        <Text style={styles.statusText}>
          {isRetracted ? '🌧️ Varal Retraído / Protegido' : '☀️ Varal Estendido'}
        </Text>
        <Text style={styles.updateText}>Última atualização: {deviceState.lastUpdate}</Text>
      </View>

      {/* Clima Local */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Clima Local ({cityName})</Text>
        <Text style={styles.weatherText}>{cityName} • {weatherData.temp}</Text>
        <Text style={styles.weatherSubtext}>{weatherData.description} (Previsão Externa)</Text>
      </View>

      {/* Comandos Manuais */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => sendCommand('retrair')}>
          <Text style={styles.actionButtonText}>Recolher Varal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.btnEstender]} onPress={() => sendCommand('estender')}>
          <Text style={styles.actionButtonText}>Estender Varal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#EAF0FE',
    padding: 16,
  },
  bannerOffline: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
    alignItems: 'center',
  },
  bannerText: {
    color: '#000000',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 150,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  imagePlaceholder: {
    alignItems: 'center',
    padding: 10,
  },
  imagePlaceholderText: {
    fontFamily: 'LexendGiga_700Bold',
    fontSize: 13,
    color: '#004AAD',
    textAlign: 'center',
  },
  imageSubtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#545454',
    marginTop: 4,
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
  cardTitle: {
    fontFamily: 'LexendGiga_700Bold',
    fontSize: 14,
    color: '#004AAD',
    marginBottom: 12,
  },
  statusText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 8,
  },
  updateText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#545454',
  },
  weatherText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  weatherSubtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#545454',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FF944E',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnEstender: {
    backgroundColor: '#00C2CB',
  },
  actionButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    fontSize: 14,
  },
});