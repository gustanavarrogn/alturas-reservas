// Mis reservas + historial: se leen de Firestore en tiempo real y se filtran por estado.
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Pantalla from '../components/Pantalla';
import Encabezado from '../components/Encabezado';
import Boton from '../components/Boton';
import Selector from '../components/Selector';
import TarjetaReserva from '../components/TarjetaReserva';
import { avisar, confirmar } from '../components/dialogo';
import { useReservas } from '../context/ReservasContext';
import { esCompletada, esProxima, formatoFecha, puedeCancelar } from '../logic/reservas';
import { Reserva } from '../services/tipos';
import { ReservasStackParams } from '../navigation/AppNavigator';
import { colores, espacio } from '../theme';

type Props = NativeStackScreenProps<ReservasStackParams, 'MisReservas'>;
type Filtro = 'todas' | 'completadas' | 'canceladas';

const FILTROS: { valor: Filtro; etiqueta: string }[] = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'completadas', etiqueta: 'Completadas' },
  { valor: 'canceladas', etiqueta: 'Canceladas' },
];

export default function MisReservasScreen({ navigation }: Props) {
  const { misReservas, cargando, error, cancelarReserva } = useReservas();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [cancelando, setCancelando] = useState<string | null>(null);

  // Las próximas se muestran de la más cercana a la más lejana.
  const proximas = misReservas.filter(esProxima).reverse();
  const historial = misReservas
    .filter(r => !esProxima(r))
    .filter(r => (filtro === 'completadas' ? esCompletada(r) : filtro === 'canceladas' ? r.estado === 'Cancelada' : true));

  const confirmarCancelacion = (r: Reserva) =>
    confirmar('Cancelar reserva', `¿Seguro que quieres cancelar la reserva #${r.codigo} del ${formatoFecha(r.fecha)}?`, 'Sí, cancelar', async () => {
      setCancelando(r.id);
      const e = await cancelarReserva(r);
      setCancelando(null);
      if (e) avisar('No se pudo cancelar', e);
    });

  return (
    <Pantalla>
      <Encabezado etiqueta="Tus visitas" titulo="Mis reservas" />
      <Boton texto="NUEVA RESERVA" onPress={() => navigation.navigate('Reservar')} />

      {error ? <Text style={estilos.error}>{error}</Text> : null}
      {cargando ? <ActivityIndicator color={colores.primario} style={{ marginVertical: espacio.l }} /> : null}

      <Text style={estilos.seccion}>Próximas</Text>
      {!cargando && proximas.length === 0 ? <Text style={estilos.vacio}>No tienes reservas próximas.</Text> : null}
      {proximas.map(r => (
        <TarjetaReserva key={r.id} reserva={r} detalle>
          {puedeCancelar(r) ? (
            <Boton texto="Cancelar reserva" variante="secundario" cargando={cancelando === r.id} onPress={() => confirmarCancelacion(r)} />
          ) : (
            <Text style={estilos.nota}>Ya no se puede cancelar (faltan menos de 2 horas).</Text>
          )}
        </TarjetaReserva>
      ))}

      <Text style={estilos.seccion}>Historial de reservas</Text>
      <Selector opciones={FILTROS} seleccion={filtro} onCambio={v => setFiltro(v as Filtro)} />
      {!cargando && historial.length === 0 ? <Text style={estilos.vacio}>No hay reservas en esta sección del historial.</Text> : null}
      {historial.map(r => (
        <TarjetaReserva key={r.id} reserva={r} detalle />
      ))}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  seccion: { fontSize: 18, fontWeight: '600', marginTop: espacio.l, marginBottom: espacio.m, color: colores.texto },
  vacio: { color: colores.textoSuave, marginVertical: espacio.s },
  nota: { color: colores.textoSuave, fontSize: 13, marginTop: espacio.s },
  error: { color: colores.error, marginVertical: espacio.s },
});
