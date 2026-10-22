import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colores, espacio, radio } from '../theme';

interface Props {
  texto: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'peligro';
  cargando?: boolean;
  deshabilitado?: boolean;
}

export default function Boton({ texto, onPress, variante = 'primario', cargando, deshabilitado }: Props) {
  const inactivo = deshabilitado || cargando;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={inactivo}
      style={({ pressed }) => [estilos.base, estilos[variante], (pressed || inactivo) && { opacity: 0.6 }]}
    >
      {cargando ? (
        <ActivityIndicator color={variante === 'secundario' ? colores.primario : '#fff'} />
      ) : (
        <Text style={[estilos.texto, variante === 'secundario' && { color: colores.primario }]}>{texto}</Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: { minHeight: 48, borderRadius: radio, alignItems: 'center', justifyContent: 'center', paddingHorizontal: espacio.m, marginVertical: espacio.s },
  primario: { backgroundColor: colores.primario },
  secundario: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colores.primario },
  peligro: { backgroundColor: colores.error },
  texto: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.5 },
});
