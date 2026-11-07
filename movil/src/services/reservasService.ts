// Capa de datos: reservas en Cloud Firestore.
// reservas/{id}      → la reserva completa, ligada al uid de quien la creó (solo él la puede leer).
// ocupacion/{clave}  → una marca por mesa ocupada (sin datos personales) para que cualquier
//                      cliente pueda consultar disponibilidad sin ver reservas ajenas.
import {
  collection,
  doc,
  DocumentData,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import { MESAS } from '../data/mesas';
import { Reserva, TipoReserva, Usuario } from './tipos';

// Clave determinística: dos personas no pueden crear la misma marca de ocupación.
export const claveOcupacion = (fecha: string, hora: string, mesa: string) =>
  `${fecha}_${hora.replace(':', '')}_${mesa.replace(/\s/g, '')}`;

const aFecha = (v: unknown) => (v instanceof Timestamp ? v.toDate() : null);

function mapearReserva(id: string, d: DocumentData): Reserva {
  return {
    id,
    codigo: d.codigo ?? id.slice(0, 6).toUpperCase(),
    uid: d.uid,
    correo: d.correo,
    nombre: d.nombre ?? '',
    fecha: d.fecha,
    hora: d.hora,
    personas: d.personas,
    tipo: d.tipo,
    mesa: d.mesa,
    estado: d.estado,
    creadoEn: aFecha(d.creadoEn),
    canceladoEn: aFecha(d.canceladoEn),
  };
}

export class SinMesaError extends Error {
  constructor() {
    super('No hay mesas disponibles para esa fecha, hora y cantidad de personas');
  }
}

export const reservasService = {
  // Reservas del usuario autenticado, en tiempo real.
  escucharMisReservas(uid: string, alCambiar: (r: Reserva[]) => void, alFallar: (e: unknown) => void) {
    const q = query(collection(db, 'reservas'), where('uid', '==', uid));
    return onSnapshot(q, snap => alCambiar(snap.docs.map(d => mapearReserva(d.id, d.data()))), alFallar);
  },

  // Mesas ocupadas de un día, agrupadas por hora: { '12:00': Set('Mesa 01', ...) }.
  escucharOcupacion(fecha: string, alCambiar: (porHora: Record<string, Set<string>>) => void, alFallar: (e: unknown) => void) {
    const q = query(collection(db, 'ocupacion'), where('fecha', '==', fecha));
    return onSnapshot(
      q,
      snap => {
        const porHora: Record<string, Set<string>> = {};
        snap.docs.forEach(d => {
          const { hora, mesa } = d.data();
          (porHora[hora] ??= new Set()).add(mesa);
        });
        alCambiar(porHora);
      },
      alFallar,
    );
  },

  // Transacción: busca la mesa libre más pequeña y guarda reserva + ocupación juntas.
  // Si otra persona tomó la mesa un instante antes, Firestore reintenta y elige otra.
  async crear(usuario: Usuario, fecha: string, hora: string, personas: number, tipo: TipoReserva) {
    const candidatas = MESAS.filter(m => m.capacidad >= personas).sort((a, b) => a.capacidad - b.capacidad);
    const refReserva = doc(collection(db, 'reservas'));
    const codigo = refReserva.id.slice(0, 6).toUpperCase();

    return runTransaction(db, async tx => {
      let mesaLibre: string | null = null;
      for (const m of candidatas) {
        const snap = await tx.get(doc(db, 'ocupacion', claveOcupacion(fecha, hora, m.id)));
        if (!snap.exists()) {
          mesaLibre = m.id;
          break;
        }
      }
      if (!mesaLibre) throw new SinMesaError();

      tx.set(refReserva, {
        uid: usuario.uid,
        correo: usuario.correo,
        nombre: usuario.nombre,
        codigo,
        fecha,
        hora,
        personas,
        tipo,
        mesa: mesaLibre,
        estado: 'Confirmada',
        creadoEn: serverTimestamp(),
        canceladoEn: null,
      });
      tx.set(doc(db, 'ocupacion', claveOcupacion(fecha, hora, mesaLibre)), {
        fecha,
        hora,
        mesa: mesaLibre,
        uid: usuario.uid,
        reservaId: refReserva.id,
      });
      return { id: refReserva.id, mesa: mesaLibre };
    });
  },

  // Cancelar: la reserva queda en el historial como "Cancelada" y la mesa se libera.
  async cancelar(r: Reserva) {
    await runTransaction(db, async tx => {
      tx.update(doc(db, 'reservas', r.id), { estado: 'Cancelada', canceladoEn: serverTimestamp() });
      tx.delete(doc(db, 'ocupacion', claveOcupacion(r.fecha, r.hora, r.mesa)));
    });
  },
};
