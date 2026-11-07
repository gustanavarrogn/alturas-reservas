// Módulo de perfil: datos guardados en Firestore (usuarios/{uid}), edición y estado de la cuenta.
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Pantalla from '../components/Pantalla';
import Encabezado from '../components/Encabezado';
import Tarjeta from '../components/Tarjeta';
import Boton from '../components/Boton';
import CampoTexto from '../components/CampoTexto';
import { confirmar } from '../components/dialogo';
import { useAuth } from '../context/AuthContext';
import { useReservas } from '../context/ReservasContext';
import { esCompletada, esProxima } from '../logic/reservas';
import { validarNombre, validarTelefono } from '../logic/validaciones';
import { colores, espacio, radio } from '../theme';

export default function PerfilScreen() {
  const { usuario, correoVerificado, cerrarSesion, actualizarPerfil, reenviarVerificacion } = useAuth();
  const { misReservas } = useReservas();
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(usuario?.nombre ?? '');
  const [telefono, setTelefono] = useState(usuario?.telefono ?? '');
  const [errores, setErrores] = useState<{ nombre?: string | null; telefono?: string | null; general?: string | null }>({});
  const [aviso, setAviso] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Las cuentas creadas con Google no tienen teléfono: se pide completarlo.
  const faltaTelefono = !!usuario && !usuario.telefono;
  useEffect(() => {
    if (faltaTelefono) setEditando(true);
  }, [faltaTelefono]);

  const iniciarEdicion = () => {
    setNombre(usuario?.nombre ?? '');
    setTelefono(usuario?.telefono ?? '');
    setErrores({});
    setAviso(null);
    setEditando(true);
  };

  const guardar = async () => {
    const e = { nombre: validarNombre(nombre), telefono: validarTelefono(telefono) };
    setErrores(e);
    if (e.nombre || e.telefono) return;
    setGuardando(true);
    const error = await actualizarPerfil({ nombre, telefono });
    setGuardando(false);
    if (error) setErrores({ general: error });
    else {
      setEditando(false);
      setAviso('Perfil actualizado en la nube.');
    }
  };

  const reenviar = async () => {
    const error = await reenviarVerificacion();
    setAviso(error ?? `Te enviamos un correo de verificación a ${usuario?.correo}.`);
  };

  const salir = () => confirmar('Cerrar sesión', '¿Deseas cerrar tu sesión?', 'Cerrar sesión', cerrarSesion);

  const resumen = {
    proximas: misReservas.filter(esProxima).length,
    completadas: misReservas.filter(esCompletada).length,
    canceladas: misReservas.filter(r => r.estado === 'Cancelada').length,
  };

  return (
    <Pantalla>
      <Encabezado etiqueta="Tu cuenta" titulo="Mi perfil" />

      {faltaTelefono ? (
        <View style={estilos.banner}>
          <Text style={estilos.bannerTexto}>Completa tu teléfono para que la cafetería pueda contactarte sobre tus reservas.</Text>
        </View>
      ) : null}

      <Tarjeta>
        {editando ? (
          <>
            <CampoTexto etiqueta="Nombre completo" value={nombre} onChangeText={setNombre} autoCapitalize="words" error={errores.nombre} />
            <CampoTexto etiqueta="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" placeholder="7123-4567" maxLength={9} error={errores.telefono} />
            {errores.general ? <Text style={estilos.error}>{errores.general}</Text> : null}
            <Boton texto="GUARDAR CAMBIOS" onPress={guardar} cargando={guardando} />
            {!faltaTelefono ? <Boton texto="Cancelar" variante="secundario" onPress={() => setEditando(false)} /> : null}
          </>
        ) : (
          <>
            <Dato etiqueta="Nombre" valor={usuario?.nombre} />
            <Dato etiqueta="Correo" valor={usuario?.correo} />
            <Dato etiqueta="Teléfono" valor={usuario?.telefono} />
            <Boton texto="Editar perfil" variante="secundario" onPress={iniciarEdicion} />
          </>
        )}
      </Tarjeta>

      <Tarjeta>
        <Dato etiqueta="Tipo de cuenta" valor={usuario?.rol === 'admin' ? 'Administrador' : 'Cliente'} />
        <Dato etiqueta="Método de acceso" valor={usuario?.proveedor === 'google' ? 'Cuenta de Google' : 'Correo y contraseña'} />
        <Dato etiqueta="Correo verificado" valor={correoVerificado ? 'Sí' : 'Pendiente'} />
        {!correoVerificado && usuario?.proveedor === 'password' ? (
          <Boton texto="Reenviar verificación" variante="secundario" onPress={reenviar} />
        ) : null}
      </Tarjeta>

      <Tarjeta>
        <Text style={estilos.subtitulo}>Mis reservas</Text>
        <View style={estilos.resumen}>
          <Contador numero={resumen.proximas} texto="Próximas" />
          <Contador numero={resumen.completadas} texto="Completadas" />
          <Contador numero={resumen.canceladas} texto="Canceladas" />
        </View>
      </Tarjeta>

      {aviso ? <Text style={estilos.aviso}>{aviso}</Text> : null}
      <Boton texto="CERRAR SESIÓN" variante="peligro" onPress={salir} />
    </Pantalla>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string }) {
  return (
    <View style={{ marginBottom: espacio.m }}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <Text style={estilos.valor}>{valor || '—'}</Text>
    </View>
  );
}

function Contador({ numero, texto }: { numero: number; texto: string }) {
  return (
    <View style={estilos.contador}>
      <Text style={estilos.numero}>{numero}</Text>
      <Text style={estilos.etiqueta}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  etiqueta: { fontSize: 13, color: colores.textoSuave },
  valor: { fontSize: 16, color: colores.texto, fontWeight: '600' },
  subtitulo: { fontSize: 16, fontWeight: '700', color: colores.texto, marginBottom: espacio.s },
  resumen: { flexDirection: 'row', justifyContent: 'space-between' },
  contador: { flex: 1, alignItems: 'center' },
  numero: { fontSize: 24, fontWeight: '800', color: colores.primario },
  error: { color: colores.error, textAlign: 'center', marginBottom: espacio.s },
  aviso: { color: colores.primario, textAlign: 'center', marginBottom: espacio.s },
  banner: { backgroundColor: '#FFF6E5', borderColor: '#F0D9A8', borderWidth: 1, borderRadius: radio, padding: espacio.m, marginBottom: espacio.m },
  bannerTexto: { color: colores.acento },
});
