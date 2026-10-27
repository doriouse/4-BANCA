import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from '../config/firebase';
import { ref, onValue, set } from 'firebase/database';

export default function HomeScreen() {
  const [deviceState, setDeviceState] = useState({
    status: 'aberto', 
    lastUpdate: 'Agora mesmo',
    isOnline: true,
  });

  const [cityName, setCityName] = useState('Localização no Mapa');
  const [weatherData, setWeatherData] = useState({
    temp: '--',
    description: 'Carregando clima...',
    iconEmoji: '⛅',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const deviceId = 'varal_01';
  // Chave de API atualizada fornecida
  const WEATHER_API_KEY = '4bec2bc8c3690bd1fa72a91970009cc3';

  useFocusEffect(
    useCallback(() => {
      loadSavedLocation();
    }, [])
  );

  const loadSavedLocation = async () => {
    try {
      const savedLat = await AsyncStorage.getItem('@retracta_lat');
      const savedLon = await AsyncStorage.getItem('@retracta_lon');

      if (savedLat && savedLon) {
        const lat = parseFloat(savedLat);
        const lon = parseFloat(savedLon);
        setCityName(`Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`);
        fetchWeatherByCoords(lat, lon);
      } else {
        // Padrão Taboão da Serra (-23.62, -46.75)
        setCityName('Taboão da Serra');
        fetchWeatherByCoords(-23.6261, -46.7544);
      }
    } catch (error) {
      fetchWeatherByCoords(-23.6261, -46.7544);
    }
  };

  const getWeatherEmoji = (conditionCode) => {
    if (conditionCode >= 200 && conditionCode < 300) return '⛈️';
    if (conditionCode >= 300 && conditionCode < 600) return '🌧️';
    if (conditionCode >= 600 && conditionCode < 700) return '❄️';
    if (conditionCode >= 700 && conditionCode < 800) return '🌫️';
    if (conditionCode === 800) return '☀️';
    if (conditionCode > 800) return '☁️';
    return '⛅';
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${WEATHER_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.main) {
        const weatherId = data.weather[0].id;
        if (data.name) {
          setCityName(data.name);
        }
        setWeatherData({
          temp: `${Math.round(data.main.temp)}°C`,
          description: data.weather[0].description,
          iconEmoji: getWeatherEmoji(weatherId),
        });
      } else {
        setWeatherData({ 
          temp: 'N/D', 
          description: data.message ? `Erro: ${data.message}` : 'Erro na chave ou limite', 
          iconEmoji: '⚠️' 
        });
      }
    } catch (error) {
      setWeatherData({ 
        temp: 'N/D', 
        description: 'Falha de conexão com a API', 
        iconEmoji: '❌' 
      });
    }
  };

  useEffect(() => {
    const statusRef = ref(database, `devices/${deviceId}/status`);
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.status) {
        setDeviceState({
          status: data.status,
          lastUpdate: data.lastUpdate || new Date().toLocaleTimeString(),
          isOnline: data.isOnline !== undefined ? data.isOnline : true,
        });
      }
    }, () => {});

    return () => unsubscribe();
  }, []);

  const handleActionWithCountdown = (command) => {
    if (actionLoading) return;

    setActionLoading(true);
    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          executeCommand(command);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const executeCommand = (command) => {
    const novoStatus = command === 'retrair' ? 'retraido' : 'aberto';
    const horarioAtual = new Date().toLocaleTimeString();

    setDeviceState({
      status: novoStatus,
      lastUpdate: horarioAtual,
      isOnline: true,
    });

    setActionLoading(false);

    const commandRef = ref(database, `devices/${deviceId}/commands`);
    const statusRef = ref(database, `devices/${deviceId}/status`);
    
    set(commandRef, {
      action: command,
      timestamp: Date.now(),
      status: 'pending'
    }).catch(() => {});

    set(statusRef, {
      status: novoStatus,
      lastUpdate: horarioAtual,
      isOnline: true
    }).catch(() => {});
  };

  const isRetracted = deviceState.status === 'retraido';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.bannerOffline, { backgroundColor: deviceState.isOnline ? '#38B6FF' : '#FF944E' }]}>
        <Text style={styles.bannerText}>
          {deviceState.isOnline ? '🟢 Dispositivo Online (Pronto para o ESP32)' : '🟠 Dispositivo Offline'}
        </Text>
      </View>

      <View style={styles.imageCard}>
        <Image 
          source={
            isRetracted 
              ? require('../../assets/images/varal_retraido.png.png') 
              : require('../../assets/images/varal_aberto.png.png')
          } 
          style={styles.varalImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estado Atual</Text>
        <Text style={styles.statusText}>
          {isRetracted ? '🌧️ Varal Retraído / Protegido' : '☀️ Varal Estendido'}
        </Text>
        <Text style={styles.updateText}>Última atualização: {deviceState.lastUpdate}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Clima Local</Text>
        <View style={styles.weatherRow}>
          <Text style={styles.weatherEmoji}>{weatherData.iconEmoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.weatherText}>{cityName} • {weatherData.temp}</Text>
            <Text style={styles.weatherSubtext}>{weatherData.description}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, actionLoading && styles.buttonDisabled]} 
          onPress={() => handleActionWithCountdown('retrair')}
          disabled={actionLoading}>
          {actionLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Recolhendo ({countdown}s)</Text>
            </View>
          ) : (
            <Text style={styles.actionButtonText}>Recolher Varal</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.btnEstender, actionLoading && styles.buttonDisabled]} 
          onPress={() => handleActionWithCountdown('estender')}
          disabled={actionLoading}>
          {actionLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Estendendo ({countdown}s)</Text>
            </View>
          ) : (
            <Text style={styles.actionButtonText}>Estender Varal</Text>
          )}
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
    paddingBottom: 40,
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
    height: 180,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    overflow: 'hidden',
  },
  varalImage: {
    width: '100%',
    height: '100%',
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
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  weatherEmoji: {
    fontSize: 36,
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
    marginTop: 2,
    textTransform: 'capitalize',
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
    justifyContent: 'center',
  },
  btnEstender: {
    backgroundColor: '#00C2CB',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    fontSize: 14,
  },
});