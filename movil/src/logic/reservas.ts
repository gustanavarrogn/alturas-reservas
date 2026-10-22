// Capa de lógica: reglas de negocio de las reservas.
import { MESAS, MAX_PERSONAS, Mesa } from '../data/mesas';
import { Reserva } from '../services/almacenamiento';

const DIAS_ANTICIPACION = 30;

// Devuelve los próximos días disponibles para reservar (AAAA-MM-DD).
export function proximosDias(cantidad = 14): string[] {
  const dias: string[] = [];
  const hoy = new Date();
  for (let i = 0; i < cantidad; i++) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i);
    dias.push(aISO(d));
  }
  return dias;
}

export function aISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${dia}`;
}

export function formatoFecha(iso: string): string {
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

export function formatoHora(hora: string): string {
  const [h, min] = hora.split(':').map(Number);
  const sufijo = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${String(min).padStart(2, '0')} ${sufijo}`;
}

// Mesas ocupadas por reservas confirmadas en la misma fecha y hora.
function mesasOcupadas(reservas: Reserva[], fecha: string, hora: string): Set<string> {
  return new Set(
    reservas.filter(r => r.estado === 'Confirmada' && r.fecha === fecha && r.hora === hora).map(r => r.mesa),
  );
}

// Asigna la mesa libre más pequeña donde caben las personas,
// para no ocupar una mesa de 6 con una pareja.
export function buscarMesa(reservas: Reserva[], fecha: string, hora: string, personas: number): Mesa | null {
  const ocupadas = mesasOcupadas(reservas, fecha, hora);
  const candidatas = MESAS.filter(m => m.capacidad >= personas && !ocupadas.has(m.id)).sort(
    (a, b) => a.capacidad - b.capacidad,
  );
  return candidatas[0] ?? null;
}

// Valida todas las reglas antes de confirmar. Devuelve un mensaje de error o null.
export function validarReserva(
  reservas: Reserva[],
  correo: string,
  fecha: string,
  hora: string,
  personas: number,
): string | null {
  if (!fecha) return 'Selecciona una fecha';
  if (!hora) return 'Selecciona una hora';
  if (personas < 1 || personas > MAX_PERSONAS) return `El número de personas debe estar entre 1 y ${MAX_PERSONAS}`;

  const ahora = new Date();
  const [a, m, d] = fecha.split('-').map(Number);
  const [h, min] = hora.split(':').map(Number);
  const inicio = new Date(a, m - 1, d, h, min);
  if (inicio.getTime() < ahora.getTime() + 60 * 60 * 1000) return 'La reserva debe hacerse con al menos 1 hora de anticipación';
  const limite = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + DIAS_ANTICIPACION);
  if (inicio > limite) return `Solo se puede reservar con hasta ${DIAS_ANTICIPACION} días de anticipación`;

  const duplicada = reservas.some(r => r.correo === correo && r.fecha === fecha && r.estado === 'Confirmada');
  if (duplicada) return 'Ya tienes una reserva confirmada para ese día';

  if (!buscarMesa(reservas, fecha, hora, personas)) return 'No hay mesas disponibles para esa fecha, hora y cantidad de personas';
  return null;
}

// True si la fecha y hora ya pasaron o faltan menos de 60 minutos.
export function horaNoDisponible(fecha: string, hora: string): boolean {
  const [a, m, d] = fecha.split('-').map(Number);
  const [h, min] = hora.split(':').map(Number);
  return new Date(a, m - 1, d, h, min).getTime() < Date.now() + 60 * 60 * 1000;
}

// Una reserva solo se puede cancelar si faltan al menos 2 horas.
export function puedeCancelar(r: Reserva): boolean {
  if (r.estado !== 'Confirmada') return false;
  const [a, m, d] = r.fecha.split('-').map(Number);
  const [h, min] = r.hora.split(':').map(Number);
  return new Date(a, m - 1, d, h, min).getTime() - Date.now() >= 2 * 60 * 60 * 1000;
}

export function esProxima(r: Reserva): boolean {
  const [a, m, d] = r.fecha.split('-').map(Number);
  const [h, min] = r.hora.split(':').map(Number);
  return r.estado === 'Confirmada' && new Date(a, m - 1, d, h, min).getTime() >= Date.now();
}
