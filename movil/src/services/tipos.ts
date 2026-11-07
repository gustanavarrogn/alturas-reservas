// Modelo de datos compartido por la app y Firestore.
// Colecciones: usuarios/{uid}, reservas/{id}, ocupacion/{fecha_hora_mesa}.

export type Rol = 'cliente' | 'admin';
export type Proveedor = 'password' | 'google';

// Documento usuarios/{uid}. La contraseña ya no se guarda: la maneja Firebase Authentication.
export interface Usuario {
  uid: string;
  nombre: string;
  correo: string;
  telefono: string;
  rol: Rol; // mismos roles que la versión web
  proveedor: Proveedor;
  creadoEn: Date | null;
}

export type EstadoReserva = 'Confirmada' | 'Cancelada';

// Mismos tipos de reservación que el formulario web.
export const TIPOS_RESERVA = ['Almuerzo', 'Cena', 'Celebración', 'Otro'] as const;
export type TipoReserva = (typeof TIPOS_RESERVA)[number];

// Documento reservas/{id}, asociado al usuario autenticado por su uid.
export interface Reserva {
  id: string; // id del documento en Firestore
  codigo: string; // código corto que se muestra al cliente (#A1B2C3)
  uid: string;
  correo: string;
  nombre: string;
  fecha: string; // AAAA-MM-DD
  hora: string; // HH:MM
  personas: number;
  tipo: TipoReserva;
  mesa: string;
  estado: EstadoReserva;
  creadoEn: Date | null;
  canceladoEn: Date | null;
}
