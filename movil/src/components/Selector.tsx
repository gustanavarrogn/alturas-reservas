// Lista horizontal de opciones; reemplaza los "dropdown" del mockup por chips que se tocan con un dedo.
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colores, espacio, radio } from '../theme';

interface Opcion { valor: string; etiqueta: string; deshabilitada?: boolean; }

export default function Selector({ opciones, seleccion, onCambio }: { opciones: Opcion[]; seleccion: string; onCambio: (v: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: espacio.xs }}>
      {opciones.map(o => {
        const activa = o.valor === seleccion;
        return (
          <Pressable
            key={o.valor}
            disabled={o.deshabilitada}
            onPress={() => onCambio(o.valor)}
            style={[estilos.chip, activa && estilos.activa, o.deshabilitada && { opacity: 0.35 }]}
          >
            <Text style={[estilos.texto, activa && { color: '#fff' }]}>{o.etiqueta}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  chip: { backgroundColor: colores.superficie, borderWidth: 1, borderColor: colores.bordeCampo, borderRadius: radio, paddingHorizontal: espacio.m, paddingVertical: 10, marginRight: espacio.s },
  activa: { backgroundColor: colores.primario, borderColor: colores.primario },
  texto: { fontSize: 14, color: colores.texto, fontWeight: '600' },
});
