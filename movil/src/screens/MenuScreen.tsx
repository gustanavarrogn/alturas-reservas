import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Pantalla from '../components/Pantalla';
import Encabezado from '../components/Encabezado';
import Tarjeta from '../components/Tarjeta';
import { MENU } from '../data/menu';
import { colores, espacio } from '../theme';

export default function MenuScreen() {
  return (
    <Pantalla>
      <Encabezado etiqueta="Gastronomía" titulo="Nuestro menú" />
      {MENU.map(categoria => (
        <Tarjeta key={categoria.nombre}>
          <Text style={estilos.titulo}>{categoria.nombre}</Text>
          {categoria.productos.map(p => (
            <View key={p.nombre} style={estilos.fila}>
              <Text style={estilos.producto}>{p.nombre}</Text>
              <Text style={estilos.precio}>${p.precio.toFixed(2)}</Text>
            </View>
          ))}
        </Tarjeta>
      ))}
      <Text style={estilos.nota}>Precios de referencia. El menú se administrará desde el panel web.</Text>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  titulo: { fontSize: 17, fontWeight: '700', color: colores.primario, marginBottom: espacio.s },
  fila: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  producto: { fontSize: 15, color: colores.texto },
  precio: { fontSize: 15, fontWeight: '600', color: colores.texto },
  nota: { color: colores.textoSuave, fontSize: 13, textAlign: 'center' },
});
