import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Tarjeta from './Tarjeta';
import { Reserva } from '../services/tipos';
import { esCompletada, formatoFecha, formatoFechaHora, formatoHora } from '../logic/reservas';
import { colores, espacio } from '../theme';

// Muestra los mismos datos que la vista de reserva confirmada de la web: fecha, hora, personas y tipo,
// más las marcas de tiempo que guarda Firestore (registro y cancelación).
export default function TarjetaReserva({ reserva, children, detalle }: { reserva: Reserva; children?: React.ReactNode; detalle?: boolean }) {
  const completada = esCompletada(reserva);
  const etiquetaEstado = completada ? 'Completada' : reserva.estado;
  const estiloEstado = reserva.estado === 'Cancelada' ? estilos.cancelada : completada ? estilos.completada : estilos.confirmada;
  return (
    <Tarjeta>
      <View style={estilos.fila}>
        <Text style={estilos.numero}>Reserva #{reserva.codigo}</Text>
        <Text style={[estilos.estado, estiloEstado]}>{etiquetaEstado}</Text>
      </View>
      <View style={estilos.grid}>
        <Dato etiqueta="Fecha" valor={formatoFecha(reserva.fecha)} />
        <Dato etiqueta="Hora" valor={formatoHora(reserva.hora)} />
        <Dato etiqueta="Personas" valor={String(reserva.personas)} />
        <Dato etiqueta="Tipo" valor={reserva.tipo} />
        <Dato etiqueta="Mesa" valor={reserva.mesa} />
      </View>
      {detalle && reserva.creadoEn ? <Text style={estilos.meta}>Registrada: {formatoFechaHora(reserva.creadoEn)}</Text> : null}
      {detalle && reserva.canceladoEn ? <Text style={estilos.meta}>Cancelada: {formatoFechaHora(reserva.canceladoEn)}</Text> : null}
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
  completada: { backgroundColor: '#F1ECE4', color: colores.acento },
  cancelada: { backgroundColor: '#FDECEC', color: colores.error },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dato: { width: '50%', marginBottom: espacio.s },
  etiqueta: { fontSize: 12, color: colores.textoSuave },
  valor: { fontSize: 15, fontWeight: '600', color: colores.texto },
  meta: { fontSize: 12, color: colores.textoSuave, marginTop: 2 },
});
