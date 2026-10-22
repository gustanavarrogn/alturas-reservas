import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Pantalla from '../components/Pantalla';
import Selector from '../components/Selector';
import Boton from '../components/Boton';
import { useReservas } from '../context/ReservasContext';
import { useAuth } from '../context/AuthContext';
import { HORAS, MAX_PERSONAS } from '../data/mesas';
import { TIPOS_RESERVA, TipoReserva } from '../services/almacenamiento';
import Encabezado from '../components/Encabezado';
import Tarjeta from '../components/Tarjeta';
import { buscarMesa, formatoHora, horaNoDisponible, proximosDias, validarReserva } from '../logic/reservas';
import { ReservasStackParams } from '../navigation/AppNavigator';
import { colores, espacio, radio } from '../theme';

type Props = NativeStackScreenProps<ReservasStackParams, 'Reservar'>;
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function ReservarScreen({ navigation }: Props) {
  const { usuario } = useAuth();
  const { todas, crearReserva } = useReservas();
  const dias = useMemo(() => proximosDias(14), []);
  const [fecha, setFecha] = useState(dias[0]);
  const [hora, setHora] = useState('');
  const [personas, setPersonas] = useState(2);
  const [tipo, setTipo] = useState<TipoReserva>('Almuerzo');
  const [guardando, setGuardando] = useState(false);

  // La disponibilidad se recalcula cada vez que cambia la fecha, la hora o las personas.
  const errorDisponibilidad = hora && usuario ? validarReserva(todas, usuario.correo, fecha, hora, personas) : null;
  const mesa = hora ? buscarMesa(todas, fecha, hora, personas) : null;

  const opcionesFecha = dias.map(d => {
    const [a, m, dia] = d.split('-').map(Number);
    return { valor: d, etiqueta: `${DIAS_SEMANA[new Date(a, m - 1, dia).getDay()]} ${String(dia).padStart(2, '0')}/${String(m).padStart(2, '0')}` };
  });
  // Se deshabilitan las horas que ya pasaron y las que no tienen mesa para ese grupo.
  const opcionesHora = HORAS.map(h => ({
    valor: h,
    etiqueta: formatoHora(h),
    deshabilitada: horaNoDisponible(fecha, h) || !buscarMesa(todas, fecha, h, personas),
  }));

  const confirmar = async () => {
    setGuardando(true);
    const { error, reserva } = await crearReserva(fecha, hora, personas, tipo);
    setGuardando(false);
    if (error || !reserva) {
      Alert.alert('No se pudo reservar', error ?? 'Intenta de nuevo');
      return;
    }
    // replace: el usuario no puede volver atrás al formulario ya enviado.
    navigation.replace('Confirmacion', { id: reserva.id });
  };

  return (
    <Pantalla>
      <Encabezado etiqueta="Reservación" titulo="Reserva tu mesa" />
      <Tarjeta>
      <Text style={estilos.etiqueta}>Fecha</Text>
      <Selector opciones={opcionesFecha} seleccion={fecha} onCambio={v => { setFecha(v); setHora(''); }} />

      <Text style={estilos.etiqueta}>Número de personas</Text>
      <View style={estilos.contador}>
        <Pressable accessibilityLabel="Menos personas" style={estilos.botonContador} onPress={() => { setPersonas(p => Math.max(1, p - 1)); setHora(''); }}>
          <Ionicons name="remove" size={22} color={colores.primario} />
        </Pressable>
        <Text style={estilos.personas}>{personas} {personas === 1 ? 'persona' : 'personas'}</Text>
        <Pressable accessibilityLabel="Más personas" style={estilos.botonContador} onPress={() => { setPersonas(p => Math.min(MAX_PERSONAS, p + 1)); setHora(''); }}>
          <Ionicons name="add" size={22} color={colores.primario} />
        </Pressable>
      </View>

      <Text style={estilos.etiqueta}>Tipo de reservación</Text>
      <Selector opciones={TIPOS_RESERVA.map(t => ({ valor: t, etiqueta: t }))} seleccion={tipo} onCambio={v => setTipo(v as TipoReserva)} />

      <Text style={estilos.etiqueta}>Hora</Text>
      <Selector opciones={opcionesHora} seleccion={hora} onCambio={setHora} />

      <Text style={estilos.etiqueta}>Disponibilidad</Text>
      <View style={estilos.disponibilidad}>
        {!hora ? (
          <Text style={estilos.textoSuave}>Selecciona una hora para consultar disponibilidad</Text>
        ) : errorDisponibilidad ? (
          <Text style={{ color: colores.error }}>✕ {errorDisponibilidad}</Text>
        ) : (
          <Text style={{ color: colores.exito, fontWeight: '600' }}>✓ Mesa disponible ({mesa?.id}, {mesa?.capacidad} personas)</Text>
        )}
      </View>

      <Boton texto="CONFIRMAR RESERVA" onPress={confirmar} cargando={guardando} deshabilitado={!hora || !!errorDisponibilidad} />
      </Tarjeta>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  etiqueta: { fontSize: 15, fontWeight: '600', color: colores.texto, marginTop: espacio.m, marginBottom: espacio.xs },
  contador: { flexDirection: 'row', alignItems: 'center', backgroundColor: colores.superficie, borderWidth: 1, borderColor: colores.bordeCampo, borderRadius: radio, alignSelf: 'flex-start' },
  botonContador: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  personas: { fontSize: 16, minWidth: 110, textAlign: 'center', color: colores.texto },
  disponibilidad: { backgroundColor: colores.superficieSuave, borderWidth: 1, borderColor: colores.borde, borderRadius: radio, padding: espacio.m, marginBottom: espacio.m },
  textoSuave: { color: colores.textoSuave },
});
