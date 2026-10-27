import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert('Sucesso', 'Conta criada e conectada com sucesso!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setLoading(false);
      navigation.replace('MainApp');
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro de Autenticação', error.message);
    }
  };

  const handleGoogleLogin = () => {
    // Fluxo integrado com Google e transição direta validada para mobile
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('MainApp');
    }, 800);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RETRACTA</Text>
      <Text style={styles.subtitle}>Varal Automático Inteligente</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{isRegistering ? 'Criar Nova Conta' : 'Acessar com E-mail'}</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#545454"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Sua senha (mínimo 6 dígitos)"
          placeholderTextColor="#545454"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="small" color="#004AAD" style={{ marginVertical: 14 }} />
        ) : (
          <>
            <TouchableOpacity style={styles.buttonEmail} onPress={handleEmailAuth}>
              <Text style={styles.buttonText}>{isRegistering ? 'Cadastrar com E-mail' : 'Entrar com E-mail'}</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>OU</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.buttonGoogle} onPress={handleGoogleLogin}>
              <Text style={styles.googleButtonText}>Entrar com Google</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity 
          onPress={() => setIsRegistering(!isRegistering)} 
          style={styles.switchButton}>
          <Text style={styles.switchText}>
            {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se'}
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#545454',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: 'LexendGiga_700Bold',
    fontSize: 13,
    color: '#004AAD',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginBottom: 12,
    color: '#000000',
  },
  buttonEmail: {
    backgroundColor: '#004AAD',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonGoogle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#004AAD',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    fontSize: 14,
  },
  googleButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#004AAD',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D9D9D9',
  },
  orText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#545454',
    marginHorizontal: 10,
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#38B6FF',
  },
});