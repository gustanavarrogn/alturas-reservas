// Capa de datos: persistencia local con AsyncStorage.
// En el Foro 2 esta capa se reemplaza por Firebase Auth + Firestore sin tocar las pantallas.
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Rol = 'cliente' | 'admin';

export interface Usuario {
  nombre: string;
  correo: string;
  telefono: string;
  contrasena: string; // temporal: en el Foro 2 la contraseña la maneja Firebase Auth
  rol: Rol; // mismos roles que la versión web
}

export type EstadoReserva = 'Confirmada' | 'Cancelada';

// Mismos tipos de reservación que el formulario web.
export const TIPOS_RESERVA = ['Almuerzo', 'Cena', 'Celebración', 'Otro'] as const;
export type TipoReserva = (typeof TIPOS_RESERVA)[number];

export interface Reserva {
  id: string;
  correo: string;
  fecha: string; // AAAA-MM-DD
  hora: string; // HH:MM
  personas: number;
  tipo: TipoReserva;
  mesa: string;
  estado: EstadoReserva;
}

const K_USUARIOS = '@alturas/usuarios';
const K_SESION = '@alturas/sesion';
const K_RESERVAS = '@alturas/reservas';

async function leer<T>(clave: string, porDefecto: T): Promise<T> {
  const valor = await AsyncStorage.getItem(clave);
  return valor ? (JSON.parse(valor) as T) : porDefecto;
}

export const almacenamiento = {
  obtenerUsuarios: () => leer<Usuario[]>(K_USUARIOS, []),
  guardarUsuarios: (u: Usuario[]) => AsyncStorage.setItem(K_USUARIOS, JSON.stringify(u)),
  obtenerSesion: () => leer<string | null>(K_SESION, null),
  guardarSesion: (correo: string) => AsyncStorage.setItem(K_SESION, JSON.stringify(correo)),
  borrarSesion: () => AsyncStorage.removeItem(K_SESION),
  obtenerReservas: () => leer<Reserva[]>(K_RESERVAS, []),
  guardarReservas: (r: Reserva[]) => AsyncStorage.setItem(K_RESERVAS, JSON.stringify(r)),
};
