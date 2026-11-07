import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ReservasProvider } from './src/context/ReservasContext';
import AppNavigator from './src/navigation/AppNavigator';
import { firebaseConfigurado } from './src/services/firebase';
import { colores, espacio } from './src/theme';

export default function App() {
  // Sin las claves de Firebase la app no puede autenticar ni guardar datos: se explica cómo configurarlas.
  if (!firebaseConfigurado) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.titulo}>Falta configurar Firebase</Text>
        <Text style={estilos.texto}>
          Copia movil/.env.example como movil/.env, pega las claves de tu proyecto de Firebase y reinicia con{' '}
          <Text style={{ fontWeight: '700' }}>npx expo start -c</Text>.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ReservasProvider>
          <AppNavigator />
          <StatusBar style="dark" />
        </ReservasProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  centro: { flex: 1, justifyContent: 'center', padding: espacio.l, backgroundColor: colores.fondo },
  titulo: { fontSize: 22, fontWeight: '800', color: colores.primario, marginBottom: espacio.m, textAlign: 'center' },
  texto: { fontSize: 15, color: colores.texto, textAlign: 'center', lineHeight: 22 },
});
