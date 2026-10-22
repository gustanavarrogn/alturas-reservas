// Pantalla de reserva confirmada: replica la vista de confirmación de la versión web.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Pantalla from '../components/Pantalla';
import Tarjeta from '../components/Tarjeta';
import Boton from '../components/Boton';
import TarjetaReserva from '../components/TarjetaReserva';
import { useReservas } from '../context/ReservasContext';
import { ReservasStackParams } from '../navigation/AppNavigator';
import { colores, espacio } from '../theme';

type Props = NativeStackScreenProps<ReservasStackParams, 'Confirmacion'>;

export default function ConfirmacionScreen({ navigation, route }: Props) {
  const { misReservas } = useReservas();
  const reserva = misReservas.find(r => r.id === route.params.id);

  return (
    <Pantalla>
      <Tarjeta estilo={estilos.centro}>
        <View style={estilos.circulo}>
          <Text style={estilos.check}>✓</Text>
        </View>
        <Text style={estilos.titulo}>¡Reserva confirmada!</Text>
        <Text style={estilos.texto}>Tu reserva ha sido registrada correctamente. Te esperamos en Las Alturas del Boquerón.</Text>
      </Tarjeta>
      {reserva ? <TarjetaReserva reserva={reserva} /> : null}
      <Boton texto="VER MIS RESERVAS" onPress={() => navigation.navigate('MisReservas')} />
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  centro: { alignItems: 'center', paddingVertical: espacio.xl },
  circulo: { width: 80, height: 80, borderRadius: 40, backgroundColor: colores.exitoFondo, alignItems: 'center', justifyContent: 'center' },
  check: { fontSize: 38, color: colores.primario },
  titulo: { fontSize: 24, fontWeight: '800', color: colores.primario, marginTop: espacio.m },
  texto: { color: colores.textoSuave, textAlign: 'center', marginTop: espacio.s, lineHeight: 22 },
});
