import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Tarjeta from './Tarjeta';
import { Reserva } from '../services/almacenamiento';
import { formatoFecha, formatoHora } from '../logic/reservas';
import { colores, espacio } from '../theme';

// Muestra los mismos datos que la vista de reserva confirmada de la web: fecha, hora, personas y tipo.
export default function TarjetaReserva({ reserva, children }: { reserva: Reserva; children?: React.ReactNode }) {
  const confirmada = reserva.estado === 'Confirmada';
  return (
    <Tarjeta>
      <View style={estilos.fila}>
        <Text style={estilos.numero}>Reserva #{reserva.id}</Text>
        <Text style={[estilos.estado, confirmada ? estilos.confirmada : estilos.cancelada]}>{reserva.estado}</Text>
      </View>
      <View style={estilos.grid}>
        <Dato etiqueta="Fecha" valor={formatoFecha(reserva.fecha)} />
        <Dato etiqueta="Hora" valor={formatoHora(reserva.hora)} />
        <Dato etiqueta="Personas" valor={String(reserva.personas)} />
        <Dato etiqueta="Tipo" valor={reserva.tipo} />
        <Dato etiqueta="Mesa" valor={reserva.mesa} />
      </View>
      {children}
    </Tarjeta>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={estilos.dato}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: espacio.s },
  numero: { fontSize: 16, fontWeight: '700', color: colores.texto },
  estado: { fontSize: 12, fontWeight: '700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  confirmada: { backgroundColor: colores.exitoFondo, color: colores.primario },
  cancelada: { backgroundColor: '#FDECEC', color: colores.error },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dato: { width: '50%', marginBottom: espacio.s },
  etiqueta: { fontSize: 12, color: colores.textoSuave },
  valor: { fontSize: 15, fontWeight: '600', color: colores.texto },
});
