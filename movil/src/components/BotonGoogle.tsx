// Botón "Continuar con Google".
// Web: Firebase abre la ventana emergente de Google (signInWithPopup).
// Android/iOS: expo-auth-session obtiene el idToken de Google y Firebase lo valida (signInWithCredential).
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { googleClientIds } from '../services/firebase';
import { colores, espacio, radio } from '../theme';

WebBrowser.maybeCompleteAuthSession();

interface Props {
  onError: (mensaje: string | null) => void;
}

export default function BotonGoogle({ onError }: Props) {
  if (Platform.OS === 'web') return <BotonGoogleWeb onError={onError} />;
  const idNativo = Platform.OS === 'android' ? googleClientIds.androidClientId : googleClientIds.iosClientId;
  if (!idNativo) {
    return (
      <View>
        <Apariencia deshabilitado onPress={() => undefined} />
        <Text style={estilos.nota}>
          Para usar Google en el teléfono agrega el ID de cliente OAuth de {Platform.OS === 'android' ? 'Android' : 'iOS'} en el
          archivo .env (ver README).
        </Text>
      </View>
    );
  }
  return <BotonGoogleNativo onError={onError} />;
}

function BotonGoogleWeb({ onError }: Props) {
  const { iniciarConGoogle } = useAuth();
  const [cargando, setCargando] = useState(false);
  const entrar = async () => {
    onError(null);
    setCargando(true);
    const error = await iniciarConGoogle();
    setCargando(false);
    if (error) onError(error);
  };
  return <Apariencia onPress={entrar} cargando={cargando} />;
}

function BotonGoogleNativo({ onError }: Props) {
  const { iniciarConGoogle } = useAuth();
  const [cargando, setCargando] = useState(false);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: googleClientIds.androidClientId,
    iosClientId: googleClientIds.iosClientId,
    webClientId: googleClientIds.webClientId,
  });

  useEffect(() => {
    if (!response) return;
    if (response.type === 'success') {
      const idToken = response.params.id_token;
      (async () => {
        const error = await iniciarConGoogle(idToken);
        setCargando(false);
        if (error) onError(error);
      })();
    } else {
      setCargando(false);
      if (response.type === 'error') onError('No se pudo iniciar sesión con Google');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const entrar = () => {
    onError(null);
    setCargando(true);
    promptAsync().catch(() => setCargando(false));
  };

  return <Apariencia onPress={entrar} cargando={cargando} deshabilitado={!request} />;
}

function Apariencia({ onPress, cargando, deshabilitado }: { onPress: () => void; cargando?: boolean; deshabilitado?: boolean }) {
  const inactivo = deshabilitado || cargando;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={inactivo}
      style={({ pressed }) => [estilos.boton, (pressed || inactivo) && { opacity: 0.6 }]}
    >
      <Ionicons name="logo-google" size={20} color="#DB4437" />
      <Text style={estilos.texto}>{cargando ? 'Conectando con Google…' : 'Continuar con Google'}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    minHeight: 48,
    borderRadius: radio,
    borderWidth: 1,
    borderColor: colores.bordeCampo,
    backgroundColor: colores.superficie,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.s,
    marginVertical: espacio.s,
  },
  texto: { fontSize: 15, fontWeight: '600', color: colores.texto },
  nota: { fontSize: 12, color: colores.textoSuave, textAlign: 'center' },
});
