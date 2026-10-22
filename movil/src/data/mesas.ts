// Capa de datos: mesas de la cafetería (las mismas del mockup "Gestión de mesas").
export interface Mesa {
  id: string;
  capacidad: number;
}

export const MESAS: Mesa[] = [
  { id: 'Mesa 01', capacidad: 4 },
  { id: 'Mesa 02', capacidad: 2 },
  { id: 'Mesa 03', capacidad: 4 },
  { id: 'Mesa 04', capacidad: 2 },
  { id: 'Mesa 05', capacidad: 6 },
  { id: 'Mesa 06', capacidad: 4 },
  { id: 'Mesa 07', capacidad: 2 },
  { id: 'Mesa 08', capacidad: 4 },
];

// Horario de atención para reservas.
export const HORAS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
export const MAX_PERSONAS = 6; // la mesa más grande es de 6 personas
