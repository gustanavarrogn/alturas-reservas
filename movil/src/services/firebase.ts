// Inicialización de Firebase (Authentication + Cloud Firestore) con el SDK web modular,
// que funciona en Expo Go sin código nativo adicional.
// Las claves se leen de variables EXPO_PUBLIC_* definidas en movil/.env (ver .env.example).
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { Auth, getAuth, initializeAuth, Persistence } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// IDs de cliente OAuth para "Continuar con Google" (Google Cloud Console / Firebase).
export const googleClientIds = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
};

export const firebaseConfigurado = Boolean(config.apiKey && config.projectId && config.appId);

// En móvil la sesión se guarda con AsyncStorage para que siga activa al reabrir la app;
// en web Firebase usa IndexedDB por defecto.
function crearAuth(app: FirebaseApp): Auth {
  if (Platform.OS === 'web') return getAuth(app);
  // getReactNativePersistence solo existe en el paquete de React Native de firebase/auth.
  const getReactNativePersistence = (FirebaseAuth as unknown as {
    getReactNativePersistence: (s: typeof AsyncStorage) => Persistence;
  }).getReactNativePersistence;
  try {
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    // Con recarga rápida (Fast Refresh) Auth ya estaba inicializado.
    return getAuth(app);
  }
}

const app = firebaseConfigurado ? (getApps().length ? getApp() : initializeApp(config)) : undefined;

// Solo se usan cuando firebaseConfigurado es true (App.tsx lo verifica antes de montar la app).
export const auth = (app ? crearAuth(app) : undefined) as Auth;
export const db = (app ? getFirestore(app) : undefined) as Firestore;
