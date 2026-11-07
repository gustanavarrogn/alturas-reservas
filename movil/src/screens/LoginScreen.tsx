import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Pantalla from '../components/Pantalla';
import Encabezado from '../components/Encabezado';
import CampoTexto from '../components/CampoTexto';
import Boton from '../components/Boton';
import BotonGoogle from '../components/BotonGoogle';
import { useAuth } from '../context/AuthContext';
import { validarCorreo } from '../logic/validaciones';
import { AuthStackParams } from '../navigation/AppNavigator';
import { colores, espacio } from '../theme';

type Props = NativeStackScreenProps<AuthStackParams, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { iniciarSesion, recuperarContrasena } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState<{ correo?: string | null; contrasena?: string | null; general?: string | null }>({});
  const [aviso, setAviso] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const enviar = async () => {
    setAviso(null);
    const e = { correo: validarCorreo(correo), contrasena: contrasena ? null : 'Ingresa tu contraseña' };
    setErrores(e);
    if (e.correo || e.contrasena) return;
    setCargando(true);
    const error = await iniciarSesion(correo, contrasena);
    setCargando(false);
    if (error) setErrores({ general: error });
    // Si no hay error, onAuthStateChanged cambia la navegación a las pestañas principales.
  };

  // Firebase envía un correo con el enlace para crear una nueva contraseña.
  const recuperar = async () => {
    setAviso(null);
    const errorCorreo = validarCorreo(correo);
    if (errorCorreo) {
      setErrores({ correo: 'Escribe tu correo para enviarte el enlace de recuperación' });
      return;
    }
    const error = await recuperarContrasena(correo);
    if (error) setErrores({ general: error });
    else {
      setErrores({});
      setAviso(`Si existe una cuenta con ${correo.trim()}, te enviamos un enlace para restablecer tu contraseña.`);
    }
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
      {aviso ? <Text style={estilos.aviso}>{aviso}</Text> : null}
      <Boton texto="INICIAR SESIÓN" onPress={enviar} cargando={cargando} />

      <View style={estilos.separador}>
        <View style={estilos.linea} />
        <Text style={estilos.o}>o</Text>
        <View style={estilos.linea} />
      </View>
      <BotonGoogle onError={general => setErrores({ general })} />

      <Pressable onPress={recuperar}>
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
  aviso: { color: colores.primario, textAlign: 'center', marginBottom: espacio.s },
  enlace: { color: colores.primario, fontWeight: '600', textAlign: 'center', marginTop: espacio.m },
  texto: { color: colores.texto, textAlign: 'center', marginTop: espacio.m },
  separador: { flexDirection: 'row', alignItems: 'center', marginVertical: espacio.s },
  linea: { flex: 1, height: 1, backgroundColor: colores.borde },
  o: { marginHorizontal: espacio.s, color: colores.textoSuave },
});
