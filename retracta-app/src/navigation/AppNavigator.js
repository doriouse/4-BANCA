import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#004AAD' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontFamily: 'LexendGiga_700Bold', fontSize: 16 },
        tabBarStyle: { 
          backgroundColor: '#FFFFFF', 
          height: 65, 
          paddingBottom: 10, 
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#D9D9D9'
        },
        tabBarActiveTintColor: '#004AAD',
        tabBarInactiveTintColor: '#545454',
        tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 11 }
      }}>
      <Tab.Screen name="Painel" component={HomeScreen} />
      <Tab.Screen name="Estatísticas" component={StatisticsScreen} />
      <Tab.Screen name="Configurações" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainApp" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}