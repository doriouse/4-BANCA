import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBm-EG949QXz28IEMHG5xeHc-SmrwKOZHA",
  authDomain: "retracta-9dc30.firebaseapp.com",
  databaseURL: "https://retracta-9dc30-default-rtdb.firebaseio.com",
  projectId: "retracta-9dc30",
  storageBucket: "retracta-9dc30.firebasestorage.app",
  messagingSenderId: "202845073243",
  appId: "1:202845073243:web:6a417d1f00c4898c76b47e"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getDatabase(app);
export const auth = getAuth(app);