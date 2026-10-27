import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBm-EG949QXz28IEMHG5xeHc-SmrwKOZHA",
  authDomain: "retracta-9dc30.firebaseapp.com",
  databaseURL: "https://retracta-9dc30-default-rtdb.firebaseio.com",
  projectId: "retracta-9dc30",
  storageBucket: "retracta-9dc30.firebasestorage.app",
  messagingSenderId: "202845073243",
  appId: "1:202845073243:web:6a417d1f00c4898c76b47e"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const database = getDatabase(app);

export { auth, database };