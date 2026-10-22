import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Pantalla from '../components/Pantalla';
import Encabezado from '../components/Encabezado';
import Tarjeta from '../components/Tarjeta';
import Boton from '../components/Boton';
import { useAuth } from '../context/AuthContext';
import { useReservas } from '../context/ReservasContext';
import { colores, espacio } from '../theme';

export default function PerfilScreen() {
  const { usuario, cerrarSesion } = useAuth();
  const { misReservas } = useReservas();
  const confirmadas = misReservas.filter(r => r.estado === 'Confirmada').length;

  const salir = () =>
    Alert.alert('Cerrar sesión', '¿Deseas cerrar tu sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: cerrarSesion },
    ]);

  return (
    <Pantalla>
      <Encabezado etiqueta="Tu cuenta" titulo="Mi perfil" />
      <Tarjeta>
        <Dato etiqueta="Nombre" valor={usuario?.nombre} />
        <Dato etiqueta="Correo" valor={usuario?.correo} />
        <Dato etiqueta="Teléfono" valor={usuario?.telefono} />
        <Dato etiqueta="Tipo de cuenta" valor={usuario?.rol === 'admin' ? 'Administrador' : 'Cliente'} />
        <Dato etiqueta="Reservas confirmadas" valor={String(confirmadas)} />
      </Tarjeta>
      <Boton texto="CERRAR SESIÓN" variante="peligro" onPress={salir} />
    </Pantalla>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string }) {
  return (
    <View style={{ marginBottom: espacio.m }}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  etiqueta: { fontSize: 13, color: colores.textoSuave },
  valor: { fontSize: 16, color: colores.texto, fontWeight: '600' },
});
