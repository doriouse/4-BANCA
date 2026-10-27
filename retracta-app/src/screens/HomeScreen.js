import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { database } from '../config/firebase';
import { ref, onValue, set } from 'firebase/database';

export default function HomeScreen() {
  const [deviceState, setDeviceState] = useState({
    status: 'desconhecido', // aberto, retraido, movimentando, offline
    lastUpdate: '--:--',
    isOnline: false,
  });

  const deviceId = 'varal_01'; // ID de exemplo do dispositivo

  useEffect(() => {
    const statusRef = ref(database, `devices/${deviceId}/status`);
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDeviceState(data);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Indicador de Conectividade */}
      <View style={[styles.bannerOffline, { backgroundColor: deviceState.isOnline ? '#38B6FF' : '#FF944E' }]}>
        <Text style={styles.bannerText}>
          {deviceState.isOnline ? 'Dispositivo Online' : 'Dispositivo Offline (Exibindo último estado)'}
        </Text>
      </View>

      {/* Status Visual do Varal */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estado Atual</Text>
        <Text style={styles.statusText}>
          {deviceState.status === 'aberto' ? '☀️ Varal Estendido' : '🌧️ Varal Retraído / Protegido'}
        </Text>
        <Text style={styles.updateText}>Última atualização: {deviceState.lastUpdate}</Text>
      </View>

      {/* Clima Local */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Clima Local (Exemplo)</Text>
        <Text style={styles.weatherText}>São Paulo • 24°C</Text>
        <Text style={styles.weatherSubtext}>Parcialmente nublado (Previsão)</Text>
      </View>

      {/* Comandos Manual / Teste */}
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