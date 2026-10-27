import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [canopyStatus, setCanopyStatus] = useState('Varal Recolhido');
  const [rainStatus, setRainStatus] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Estado para o Countdown de 4 segundos
  const [countdown, setCountdown] = useState(0);

  const [cityName, setCityName] = useState('Taboão da Serra');
  const [weatherData, setWeatherData] = useState({
    temp: '22°C',
    description: 'Parcialmente nublado',
    iconEmoji: '⛅'
  });

  const WEATHER_API_KEY = 'SUA_CHAVE_OPENWEATHER_AQUI';

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  // Efeito para gerenciar o countdown de 4 segundos
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const getLocationAndWeather = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = location.coords;
      await fetchWeatherByCoords(latitude, longitude);
    } catch (error) {
      console.log("Erro de GPS");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${WEATHER_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.main) {
        let localName = data.name;
        if (localName === 'Campo Limpo' || (localName === 'São Paulo' && lat < -23.59 && lat > -23.65)) {
          localName = 'Taboão da Serra';
        }
        setCityName(localName);
        setWeatherData({
          temp: `${Math.round(data.main.temp)}°C`,
          description: data.weather[0].description,
          iconEmoji: getWeatherEmoji(data.weather[0].id),
        });
      }
    } catch (error) {
      console.log("Erro clima");
    }
  };

  const getWeatherEmoji = (id) => {
    if (id >= 200 && id < 300) return '⛈️';
    if (id >= 300 && id < 600) return '🌧️';
    if (id === 800) return '☀️';
    return '⛅';
  };

  // Ação manual com contagem regressiva de 4 segundos
  const sendCommand = (command) => {
    if (autoMode) {
      alert("Desative o modo Automático para controlar manualmente.");
      return;
    }
    if (countdown > 0) return; // Evita cliques múltiplos durante a animação

    setCountdown(4);
    if (command === 'estender') {
      setCanopyStatus('Movendo para Estender...');
      setTimeout(() => setCanopyStatus('Varal Estendido'), 4000);
    } else if (command === 'retrair') {
      setCanopyStatus('Movendo para Retrair...');
      setTimeout(() => setCanopyStatus('Varal Recolhido'), 4000);
    }
  };

  const toggleAutoMode = () => {
    setAutoMode(!autoMode);
  };

  const isExtended = canopyStatus.toLowerCase().includes('estendido') || canopyStatus.toLowerCase().includes('aberto');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>RETRACTA</Text>
          <Text style={styles.headerSubtitle}>Painel de Controle Inteligente</Text>
        </View>

        {/* Clima */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <View style={styles.locationContainer}>
              <Ionicons name="location-sharp" size={18} color="#2563EB" />
              <Text style={styles.cityName}>{cityName}</Text>
            </View>
            <TouchableOpacity onPress={getLocationAndWeather} disabled={loading}>
              {loading ? <ActivityIndicator size="small" color="#2563EB" /> : <Ionicons name="refresh" size={20} color="#2563EB" />}
            </TouchableOpacity>
          </View>
          <View style={styles.weatherBody}>
            <Text style={styles.weatherEmoji}>{weatherData.iconEmoji}</Text>
            <View>
              <Text style={styles.temperature}>{weatherData.temp}</Text>
              <Text style={styles.description}>{weatherData.description}</Text>
            </View>
          </View>
        </View>

        {/* Imagem do Varal */}
        <View style={styles.imageCard}>
          <Text style={styles.cardTitle}>Visualização do Varal</Text>
          <Image 
            source={
              isExtended 
                ? require('../../assets/images/varal_aberto.png.png') 
                : require('../../assets/images/varal_retraido.png.png')
            } 
            style={styles.varalImage} 
            resizeMode="contain"
          />
          <Text style={styles.imageCaption}>{canopyStatus}</Text>
        </View>

        {/* Status */}
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>Status do Sistema</Text>
          <View style={styles.statusRow}>
            <Ionicons name={isExtended ? "sunny" : "shield-checkmark"} size={32} color="#2563EB" />
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>Estado Atual:</Text>
              <Text style={styles.statusValue}>{canopyStatus}</Text>
            </View>
          </View>

          <View style={[styles.rainAlert, { backgroundColor: rainStatus ? '#FEE2E2' : '#DCFCE7' }]}>
            <Ionicons name={rainStatus ? "rainy" : "checkmark-circle"} size={20} color={rainStatus ? "#DC2626" : "#16A34A"} />
            <Text style={[styles.rainText, { color: rainStatus ? "#991B1B" : "#166534" }]}>
              {rainStatus ? "Chuva Detectada! Varal Recolhendo." : "Tempo Seco / Seguro."}
            </Text>
          </View>
        </View>

        {/* Controles com Countdown */}
        <View style={styles.controlCard}>
          <View style={styles.modeRow}>
            <Text style={styles.cardTitle}>Modo de Operação</Text>
            <TouchableOpacity 
              style={[styles.modeButton, { backgroundColor: autoMode ? '#2563EB' : '#64748B' }]}
              onPress={toggleAutoMode}
            >
              <Text style={styles.modeButtonText}>{autoMode ? 'Automático' : 'Manual'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.actionButton, (autoMode || countdown > 0) && styles.disabledButton]} 
              onPress={() => sendCommand('estender')}
              disabled={autoMode || countdown > 0}
            >
              <Ionicons name="expand" size={20} color="#FFF" />
              <Text style={styles.buttonText}>
                {countdown > 0 ? `Aguarde ${countdown}s` : 'Estender'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.retractButton, (autoMode || countdown > 0) && styles.disabledButton]} 
              onPress={() => sendCommand('retrair')}
              disabled={autoMode || countdown > 0}
            >
              <Ionicons name="contract" size={20} color="#FFF" />
              <Text style={styles.buttonText}>
                {countdown > 0 ? `Aguarde ${countdown}s` : 'Retrair'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContainer: { padding: 16 },
  header: { marginBottom: 16, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  headerSubtitle: { fontSize: 13, color: '#64748B' },
  weatherCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  weatherHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  cityName: { fontSize: 16, fontWeight: '600', color: '#334155', marginLeft: 6 },
  weatherBody: { flexDirection: 'row', alignItems: 'center' },
  weatherEmoji: { fontSize: 40, marginRight: 16 },
  temperature: { fontSize: 24, fontWeight: 'bold', color: '#0F172A' },
  description: { fontSize: 13, color: '#64748B', textTransform: 'capitalize' },
  imageCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, alignItems: 'center', elevation: 2 },
  varalImage: { width: '100%', height: 160, marginVertical: 8 },
  imageCaption: { fontSize: 13, fontWeight: '600', color: '#475569', marginTop: 4 },
  statusCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statusInfo: { marginLeft: 12 },
  statusLabel: { fontSize: 12, color: '#64748B' },
  statusValue: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  rainAlert: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8 },
  rainText: { fontSize: 13, fontWeight: '500', marginLeft: 8 },
  controlCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, elevation: 2 },
  modeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modeButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  modeButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { flex: 1, backgroundColor: '#2563EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, marginRight: 6 },
  retractButton: { backgroundColor: '#475569', marginRight: 0, marginLeft: 6 },
  disabledButton: { backgroundColor: '#CBD5E1' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 13, marginLeft: 4 }
});