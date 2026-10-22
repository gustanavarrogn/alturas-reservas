// Contenedor blanco con borde y sombra, equivalente a las tarjetas "rounded-2xl shadow-md" de la web.
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colores, espacio, radioGrande, sombra } from '../theme';

export default function Tarjeta({ children, estilo }: { children: React.ReactNode; estilo?: StyleProp<ViewStyle> }) {
  return <View style={[estilos.tarjeta, estilo]}>{children}</View>;
}

const estilos = StyleSheet.create({
  tarjeta: { backgroundColor: colores.superficie, borderRadius: radioGrande, borderWidth: 1, borderColor: colores.borde, padding: espacio.m, marginBottom: espacio.m, ...sombra },
});
