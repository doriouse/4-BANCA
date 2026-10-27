import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';

export default function SplashScreenCustom({ navigation }) {
  useEffect(() => {
    // Mantém a imagem exibida por exatamente 5 segundos (5000ms)
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/Background.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004AAD',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
});