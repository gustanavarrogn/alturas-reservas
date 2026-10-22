import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Pantalla from '../components/Pantalla';
import Encabezado from '../components/Encabezado';
import CampoTexto from '../components/CampoTexto';
import Boton from '../components/Boton';
import { useAuth } from '../context/AuthContext';
import { validarCorreo } from '../logic/validaciones';
import { AuthStackParams } from '../navigation/AppNavigator';
import { colores, espacio } from '../theme';

type Props = NativeStackScreenProps<AuthStackParams, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { iniciarSesion } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState<{ correo?: string | null; contrasena?: string | null; general?: string | null }>({});
  const [cargando, setCargando] = useState(false);

  const enviar = async () => {
    const e = { correo: validarCorreo(correo), contrasena: contrasena ? null : 'Ingresa tu contraseña' };
    setErrores(e);
    if (e.correo || e.contrasena) return;
    setCargando(true);
    const error = await iniciarSesion(correo, contrasena);
    setCargando(false);
    if (error) setErrores({ general: error });
  };

  return (
    <Pantalla>
      <Encabezado etiqueta="Bienvenido" titulo="Iniciar sesión" />
      <CampoTexto
        etiqueta="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="tucorreo@ejemplo.com"
        error={errores.correo}
      />
      <CampoTexto
        etiqueta="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        placeholder="••••••••"
        error={errores.contrasena}
      />
      {errores.general ? <Text style={estilos.error}>{errores.general}</Text> : null}
      <Boton texto="INICIAR SESIÓN" onPress={enviar} cargando={cargando} />
      <Pressable onPress={() => Alert.alert('Recuperar contraseña', 'Esta opción estará disponible con Firebase en el siguiente avance.')}>
        <Text style={estilos.enlace}>¿Olvidaste tu contraseña?</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Registro')}>
        <Text style={estilos.texto}>
          ¿No tienes una cuenta? <Text style={estilos.enlace}>Crear cuenta</Text>
        </Text>
      </Pressable>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  error: { color: colores.error, textAlign: 'center', marginBottom: espacio.s },
  enlace: { color: colores.primario, fontWeight: '600', textAlign: 'center', marginTop: espacio.m },
  texto: { color: colores.texto, textAlign: 'center', marginTop: espacio.m },
});
