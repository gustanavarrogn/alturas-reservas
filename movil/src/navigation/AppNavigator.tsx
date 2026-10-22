// Navegación: si no hay sesión se muestra el flujo de autenticación;
// con sesión, la barra inferior del mockup (Inicio, Reservas, Menú, Perfil).
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colores } from '../theme';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import InicioScreen from '../screens/InicioScreen';
import MisReservasScreen from '../screens/MisReservasScreen';
import ReservarScreen from '../screens/ReservarScreen';
import ConfirmacionScreen from '../screens/ConfirmacionScreen';
import MenuScreen from '../screens/MenuScreen';
import PerfilScreen from '../screens/PerfilScreen';

export type AuthStackParams = { Login: undefined; Registro: undefined };
export type ReservasStackParams = { MisReservas: undefined; Reservar: undefined; Confirmacion: { id: string } };
export type TabParams = { Inicio: undefined; Reservas: NavigatorScreenParams<ReservasStackParams> | undefined; Menu: undefined; Perfil: undefined };

const AuthStack = createNativeStackNavigator<AuthStackParams>();
const ReservasStack = createNativeStackNavigator<ReservasStackParams>();
const Tabs = createBottomTabNavigator<TabParams>();

function ReservasNavigator() {
  return (
    <ReservasStack.Navigator screenOptions={{ headerTintColor: colores.primario, headerStyle: { backgroundColor: colores.superficie }, contentStyle: { backgroundColor: colores.fondo } }}>
      <ReservasStack.Screen name="MisReservas" component={MisReservasScreen} options={{ headerShown: false }} />
      <ReservasStack.Screen name="Reservar" component={ReservarScreen} options={{ title: 'Nueva reserva' }} />
      <ReservasStack.Screen name="Confirmacion" component={ConfirmacionScreen} options={{ headerShown: false, gestureEnabled: false }} />
    </ReservasStack.Navigator>
  );
}

const ICONOS: Record<keyof TabParams, keyof typeof Ionicons.glyphMap> = {
  Inicio: 'home-outline',
  Reservas: 'calendar-outline',
  Menu: 'cafe-outline',
  Perfil: 'person-outline',
};

function PrincipalTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoSuave,
        tabBarStyle: { backgroundColor: colores.superficie, borderTopColor: colores.borde },
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONOS[route.name]} color={color} size={size} />,
      })}
    >
      <Tabs.Screen name="Inicio" component={InicioScreen} />
      <Tabs.Screen name="Reservas" component={ReservasNavigator} />
      <Tabs.Screen name="Menu" component={MenuScreen} options={{ title: 'Menú' }} />
      <Tabs.Screen name="Perfil" component={PerfilScreen} />
    </Tabs.Navigator>
  );
}

export default function AppNavigator() {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {usuario ? (
        <PrincipalTabs />
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Registro" component={RegistroScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
