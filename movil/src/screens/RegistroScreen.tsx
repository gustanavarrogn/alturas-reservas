import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Pantalla from '../components/Pantalla';
import Encabezado from '../components/Encabezado';
import CampoTexto from '../components/CampoTexto';
import Boton from '../components/Boton';
import { useAuth } from '../context/AuthContext';
import { validarConfirmacion, validarContrasena, validarCorreo, validarNombre, validarTelefono } from '../logic/validaciones';
import { AuthStackParams } from '../navigation/AppNavigator';
import { colores, espacio } from '../theme';

type Props = NativeStackScreenProps<AuthStackParams, 'Registro'>;
type Campos = 'nombre' | 'correo' | 'telefono' | 'contrasena' | 'confirmacion';

export default function RegistroScreen({ navigation }: Props) {
  const { registrarse } = useAuth();
  const [datos, setDatos] = useState<Record<Campos, string>>({ nombre: '', correo: '', telefono: '', contrasena: '', confirmacion: '' });
  const [errores, setErrores] = useState<Partial<Record<Campos | 'general', string | null>>>({});
  const [cargando, setCargando] = useState(false);

  const cambiar = (campo: Campos) => (valor: string) => setDatos(d => ({ ...d, [campo]: valor }));

  const enviar = async () => {
    const e = {
      nombre: validarNombre(datos.nombre),
      correo: validarCorreo(datos.correo),
      telefono: validarTelefono(datos.telefono),
      contrasena: validarContrasena(datos.contrasena),
      confirmacion: validarConfirmacion(datos.contrasena, datos.confirmacion),
    };
    setErrores(e);
    if (Object.values(e).some(Boolean)) return;
    setCargando(true);
    const error = await registrarse({ nombre: datos.nombre, correo: datos.correo, telefono: datos.telefono, contrasena: datos.contrasena });
    setCargando(false);
    if (error) setErrores({ general: error });
  };

  return (
    <Pantalla>
      <Encabezado etiqueta="Regístrate" titulo="Crear una cuenta" />
      <CampoTexto etiqueta="Nombre completo" value={datos.nombre} onChangeText={cambiar('nombre')} autoCapitalize="words" error={errores.nombre} />
      <CampoTexto etiqueta="Correo electrónico" value={datos.correo} onChangeText={cambiar('correo')} keyboardType="email-address" autoCapitalize="none" error={errores.correo} />
      <CampoTexto etiqueta="Teléfono" value={datos.telefono} onChangeText={cambiar('telefono')} keyboardType="phone-pad" placeholder="7123-4567" maxLength={9} error={errores.telefono} />
      <CampoTexto etiqueta="Contraseña" value={datos.contrasena} onChangeText={cambiar('contrasena')} secureTextEntry placeholder="Mínimo 8 caracteres, letras y números" error={errores.contrasena} />
      <CampoTexto etiqueta="Confirmar contraseña" value={datos.confirmacion} onChangeText={cambiar('confirmacion')} secureTextEntry error={errores.confirmacion} />
      {errores.general ? <Text style={estilos.error}>{errores.general}</Text> : null}
      <Boton texto="CREAR CUENTA" onPress={enviar} cargando={cargando} />
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={estilos.texto}>
          ¿Ya tienes cuenta? <Text style={estilos.enlace}>Iniciar sesión</Text>
        </Text>
      </Pressable>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  error: { color: colores.error, textAlign: 'center', marginBottom: espacio.s },
  enlace: { color: colores.primario, fontWeight: '600' },
  texto: { color: colores.texto, textAlign: 'center', marginTop: espacio.m },
});
