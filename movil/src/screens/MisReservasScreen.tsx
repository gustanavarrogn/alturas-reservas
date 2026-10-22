import React from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Pantalla from '../components/Pantalla';
import Encabezado from '../components/Encabezado';
import Boton from '../components/Boton';
import TarjetaReserva from '../components/TarjetaReserva';
import { useReservas } from '../context/ReservasContext';
import { esProxima, formatoFecha, puedeCancelar } from '../logic/reservas';
import { Reserva } from '../services/almacenamiento';
import { ReservasStackParams } from '../navigation/AppNavigator';
import { colores, espacio } from '../theme';

type Props = NativeStackScreenProps<ReservasStackParams, 'MisReservas'>;

export default function MisReservasScreen({ navigation }: Props) {
  const { misReservas, cancelarReserva } = useReservas();
  const proximas = misReservas.filter(esProxima);
  const historial = misReservas.filter(r => !esProxima(r));

  const confirmarCancelacion = (r: Reserva) =>
    Alert.alert('Cancelar reserva', `¿Seguro que quieres cancelar la reserva #${r.id} del ${formatoFecha(r.fecha)}?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', style: 'destructive', onPress: () => cancelarReserva(r.id) },
    ]);

  return (
    <Pantalla>
      <Encabezado etiqueta="Tus visitas" titulo="Mis reservas" />
      <Boton texto="NUEVA RESERVA" onPress={() => navigation.navigate('Reservar')} />

      {proximas.length === 0 ? <Text style={estilos.vacio}>No tienes reservas próximas.</Text> : null}
      {proximas.map(r => (
        <TarjetaReserva key={r.id} reserva={r}>
          {puedeCancelar(r) ? (
            <Boton texto="Cancelar reserva" variante="secundario" onPress={() => confirmarCancelacion(r)} />
          ) : (
            <Text style={estilos.nota}>Ya no se puede cancelar (faltan menos de 2 horas).</Text>
          )}
        </TarjetaReserva>
      ))}

      <Text style={estilos.seccion}>Historial de reservas</Text>
      {historial.length === 0 ? <Text style={estilos.vacio}>Aún no hay reservas en tu historial.</Text> : null}
      {historial.map(r => (
        <TarjetaReserva key={r.id} reserva={r} />
      ))}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  seccion: { fontSize: 18, fontWeight: '600', marginTop: espacio.l, marginBottom: espacio.m, color: colores.texto },
  vacio: { color: colores.textoSuave, marginVertical: espacio.s },
  nota: { color: colores.textoSuave, fontSize: 13, marginTop: espacio.s },
});
