// Alert.alert no muestra nada en la versión web, así que en web se usan los diálogos del navegador.
import { Alert, Platform } from 'react-native';

export function avisar(titulo: string, mensaje: string) {
  if (Platform.OS === 'web') window.alert(`${titulo}\n\n${mensaje}`);
  else Alert.alert(titulo, mensaje);
}

export function confirmar(titulo: string, mensaje: string, textoOk: string, alAceptar: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensaje}`)) alAceptar();
    return;
  }
  Alert.alert(titulo, mensaje, [
    { text: 'No', style: 'cancel' },
    { text: textoOk, style: 'destructive', onPress: alAceptar },
  ]);
}
