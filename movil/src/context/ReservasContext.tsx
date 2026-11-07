// Estado global de las reservas (Context API) sincronizado con Firestore en tiempo real.
import React, { createContext, useContext, useEffect, useState } from 'react';
import { mensajeError } from '../services/authService';
import { reservasService, SinMesaError } from '../services/reservasService';
import { Reserva, TipoReserva } from '../services/tipos';
import { validarReserva } from '../logic/reservas';
import { useAuth } from './AuthContext';

interface ReservasValor {
  misReservas: Reserva[]; // de la más reciente a la más antigua
  cargando: boolean;
  error: string | null;
  crearReserva: (
    fecha: string,
    hora: string,
    personas: number,
    tipo: TipoReserva,
    ocupadas: Set<string>,
  ) => Promise<{ error: string | null; id?: string }>;
  cancelarReserva: (r: Reserva) => Promise<string | null>;
}

const ReservasContext = createContext<ReservasValor | undefined>(undefined);

export function ReservasProvider({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  const uid = usuario?.uid;
  const [misReservas, setMisReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setMisReservas([]);
      return;
    }
    setCargando(true);
    return reservasService.escucharMisReservas(
      uid,
      lista => {
        setMisReservas(lista.sort((a, b) => (a.fecha + a.hora < b.fecha + b.hora ? 1 : -1)));
        setCargando(false);
        setError(null);
      },
      e => {
        setError(mensajeError(e));
        setCargando(false);
      },
    );
  }, [uid]);

  const crearReserva: ReservasValor['crearReserva'] = async (fecha, hora, personas, tipo, ocupadas) => {
    if (!usuario) return { error: 'Debes iniciar sesión' };
    const invalida = validarReserva(misReservas, ocupadas, fecha, hora, personas);
    if (invalida) return { error: invalida };
    try {
      const { id } = await reservasService.crear(usuario, fecha, hora, personas, tipo);
      return { error: null, id };
    } catch (e) {
      return { error: e instanceof SinMesaError ? e.message : mensajeError(e) };
    }
  };

  const cancelarReserva = async (r: Reserva) => {
    try {
      await reservasService.cancelar(r);
      return null;
    } catch (e) {
      return mensajeError(e);
    }
  };

  return (
    <ReservasContext.Provider value={{ misReservas, cargando, error, crearReserva, cancelarReserva }}>
      {children}
    </ReservasContext.Provider>
  );
}

export function useReservas() {
  const ctx = useContext(ReservasContext);
  if (!ctx) throw new Error('useReservas debe usarse dentro de ReservasProvider');
  return ctx;
}
