// Encabezado de marca, igual al de la barra superior de la versión web.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colores, espacio } from '../theme';

interface Props {
  etiqueta?: string; // texto pequeño café en mayúsculas (ej. "RESERVACIÓN")
  titulo?: string;
}

export default function Encabezado({ etiqueta, titulo }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.marca}>Alturas Reservas</Text>
      <Text style={estilos.lugar}>Mirador Las Alturas del Boquerón</Text>
      {etiqueta ? <Text style={estilos.etiqueta}>{etiqueta}</Text> : null}
      {titulo ? <Text style={estilos.titulo}>{titulo}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { marginBottom: espacio.l },
  marca: { fontSize: 26, fontWeight: '800', color: colores.primario },
  lugar: { fontSize: 13, color: colores.textoSuave },
  etiqueta: { marginTop: espacio.l, fontSize: 12, fontWeight: '700', letterSpacing: 2, color: colores.acento, textTransform: 'uppercase' },
  titulo: { fontSize: 26, fontWeight: '800', color: colores.texto, marginTop: espacio.xs },
});
