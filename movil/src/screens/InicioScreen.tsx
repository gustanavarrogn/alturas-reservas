// Inicio: misma estructura que la portada web (bienvenida, botones, bloque visual y servicios).
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import Pantalla from '../components/Pantalla';
import Boton from '../components/Boton';
import Tarjeta from '../components/Tarjeta';
import TarjetaReserva from '../components/TarjetaReserva';
import { useAuth } from '../context/AuthContext';
import { useReservas } from '../context/ReservasContext';
import { esProxima } from '../logic/reservas';
import { TabParams } from '../navigation/AppNavigator';
import { colores, espacio, radioGrande, sombra } from '../theme';

type Props = BottomTabScreenProps<TabParams, 'Inicio'>;

const SERVICIOS = [
  { icono: '🍽️', titulo: 'Gastronomía', texto: 'Disfruta nuestro menú en un ambiente agradable.' },
  { icono: '📅', titulo: 'Reservas', texto: 'Reserva tu mesa de manera rápida y sencilla.' },
  { icono: '🌋', titulo: 'Vista panorámica', texto: 'Vive una experiencia con una vista espectacular.' },
];

export default function InicioScreen({ navigation }: Props) {
  const { usuario } = useAuth();
  const { misReservas } = useReservas();
  // La reserva más cercana en el tiempo (misReservas viene de la más nueva a la más antigua).
  const proxima = [...misReservas].reverse().find(esProxima);

  return (
    <Pantalla>
      <Text style={estilos.saludo}>Hola, {usuario?.nombre.split(' ')[0]}</Text>
      <Text style={estilos.etiqueta}>Bienvenido</Text>
      <Text style={estilos.titulo}>
        Una experiencia{'\n'}
        <Text style={{ color: colores.primario }}>sobre las alturas</Text>
      </Text>
      <Text style={estilos.texto}>Disfruta de una experiencia gastronómica única en el Mirador Las Alturas del Boquerón.</Text>

      <Boton texto="RESERVAR MESA" onPress={() => navigation.navigate('Reservas', { screen: 'Reservar' })} />
      <Boton texto="VER MENÚ" variante="secundario" onPress={() => navigation.navigate('Menu')} />

      {/* Bloque visual de la portada; en la versión final se reemplaza por una foto del mirador */}
      <View style={estilos.visual}>
        <Text style={{ fontSize: 56 }}>🏔️</Text>
        <Text style={estilos.visualTitulo}>Las Alturas</Text>
        <Text style={estilos.visualTexto}>Mirador del Boquerón</Text>
      </View>

      {proxima ? (
        <>
          <Text style={estilos.seccion}>Tu próxima reserva</Text>
          <TarjetaReserva reserva={proxima} />
        </>
      ) : null}

      <Text style={estilos.seccion}>Nuestra experiencia</Text>
      {SERVICIOS.map(s => (
        <Tarjeta key={s.titulo} estilo={estilos.servicio}>
          <Text style={{ fontSize: 30 }}>{s.icono}</Text>
          <View style={{ flex: 1 }}>
            <Text style={estilos.servicioTitulo}>{s.titulo}</Text>
            <Text style={estilos.servicioTexto}>{s.texto}</Text>
          </View>
        </Tarjeta>
      ))}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  saludo: { fontSize: 15, fontWeight: '600', color: colores.primario, marginBottom: espacio.l },
  etiqueta: { fontSize: 12, fontWeight: '700', letterSpacing: 2, color: colores.acento, textTransform: 'uppercase' },
  titulo: { fontSize: 34, fontWeight: '800', color: colores.texto, lineHeight: 40, marginTop: espacio.s },
  texto: { fontSize: 16, color: colores.textoSuave, lineHeight: 24, marginVertical: espacio.m },
  visual: { height: 220, borderRadius: radioGrande, backgroundColor: colores.primario, alignItems: 'center', justifyContent: 'center', marginVertical: espacio.l, borderBottomWidth: 8, borderBottomColor: colores.acento, ...sombra },
  visualTitulo: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: espacio.s },
  visualTexto: { color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  seccion: { fontSize: 18, fontWeight: '700', color: colores.texto, marginBottom: espacio.m },
  servicio: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  servicioTitulo: { fontSize: 16, fontWeight: '700', color: colores.texto },
  servicioTexto: { fontSize: 14, color: colores.textoSuave, marginTop: 2 },
});
