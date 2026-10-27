import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

export default function SettingsScreen({ navigation }) {
  const [cityInput, setCityInput] = useState('São Paulo');

  useEffect(() => {
    loadCity();
  }, []);

  const loadCity = async () => {
    const saved = await AsyncStorage.getItem('@retracta_city');
    if (saved) setCityInput(saved);
  };

  const saveCity = async () => {
    await AsyncStorage.setItem('@retracta_city', cityInput);
    Alert.alert('Sucesso', 'Localidade do varal atualizada com sucesso!');
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      {/* Configuração de Localidade */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Localização do Varal</Text>
        <Text style={styles.label}>Cidade do Dispositivo (para API de clima):</Text>
        <TextInput
          style={styles.input}
          value={cityInput}
          onChangeText={setCityInput}
          placeholder="Ex: São Paulo"
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveCity}>
          <Text style={styles.saveButtonText}>Salvar Localidade</Text>
        </TouchableOpacity>
      </View>

      {/* Suporte */}
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
  },
  sectionTitle: {
    fontFamily: 'LexendGiga_700Bold',
    fontSize: 14,
    color: '#004AAD',
    marginBottom: 12,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#545454',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: 10,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#004AAD',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    fontSize: 13,
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