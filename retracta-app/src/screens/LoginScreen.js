import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { auth } from '../config/firebase';

export default function LoginScreen({ navigation }) {
  const handleGoogleLogin = async () => {
    // Simulação do login com Google para transição fluida
    navigation.replace('MainApp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RETRACTA</Text>
      <Text style={styles.subtitle}>Varal Automático Inteligente</Text>

      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Entrar com Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF0FE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'LexendGiga_700Bold',
    fontSize: 28,
    color: '#004AAD',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#545454',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#004AAD',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
});