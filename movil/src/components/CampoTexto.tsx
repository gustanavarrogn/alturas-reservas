import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colores, espacio, radio } from '../theme';

interface Props extends TextInputProps {
  etiqueta: string;
  error?: string | null;
}

// Campo con etiqueta arriba y mensaje de error debajo, como en el mockup de login.
export default function CampoTexto({ etiqueta, error, ...props }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput
        placeholderTextColor={colores.textoSuave}
        style={[estilos.input, !!error && { borderColor: colores.error }]}
        {...props}
      />
      {error ? <Text style={estilos.error}>{error}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { marginBottom: espacio.m },
  etiqueta: { fontSize: 14, fontWeight: '600', color: colores.texto, marginBottom: espacio.xs },
  input: { backgroundColor: colores.superficie, borderRadius: radio, borderWidth: 1, borderColor: colores.bordeCampo, paddingHorizontal: espacio.m, minHeight: 48, fontSize: 16, color: colores.texto },
  error: { color: colores.error, fontSize: 13, marginTop: espacio.xs },
});
