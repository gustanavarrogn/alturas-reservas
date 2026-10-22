// Estado global de las reservas (Context API).
import React, { createContext, useContext, useEffect, useState } from 'react';
import { almacenamiento, Reserva, TipoReserva } from '../services/almacenamiento';
import { buscarMesa, validarReserva } from '../logic/reservas';
import { useAuth } from './AuthContext';

interface ReservasValor {
  todas: Reserva[];
  misReservas: Reserva[];
  crearReserva: (fecha: string, hora: string, personas: number, tipo: TipoReserva) => Promise<{ error: string | null; reserva?: Reserva }>;
  cancelarReserva: (id: string) => Promise<void>;
}

const ReservasContext = createContext<ReservasValor | undefined>(undefined);

export function ReservasProvider({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  const [todas, setTodas] = useState<Reserva[]>([]);

  useEffect(() => {
    almacenamiento.obtenerReservas().then(setTodas);
  }, []);

  const misReservas = usuario
    ? todas
        .filter(r => r.correo === usuario.correo)
        .sort((a, b) => (a.fecha + a.hora < b.fecha + b.hora ? 1 : -1))
    : [];

  const guardar = async (lista: Reserva[]) => {
    setTodas(lista);
    await almacenamiento.guardarReservas(lista);
  };

  const crearReserva = async (fecha: string, hora: string, personas: number, tipo: TipoReserva) => {
    if (!usuario) return { error: 'Debes iniciar sesión' };
    const error = validarReserva(todas, usuario.correo, fecha, hora, personas);
    if (error) return { error };
    const mesa = buscarMesa(todas, fecha, hora, personas)!;
    const reserva: Reserva = {
      id: String(todas.length + 1).padStart(3, '0'),
      correo: usuario.correo,
      fecha,
      hora,
      personas,
      tipo,
      mesa: mesa.id,
      estado: 'Confirmada',
    };
    await guardar([...todas, reserva]);
    return { error: null, reserva };
  };

  const cancelarReserva = async (id: string) => {
    await guardar(todas.map(r => (r.id === id ? { ...r, estado: 'Cancelada' } : r)));
  };

  return (
    <ReservasContext.Provider value={{ todas, misReservas, crearReserva, cancelarReserva }}>
      {children}
    </ReservasContext.Provider>
  );
}

export function useReservas() {
  const ctx = useContext(ReservasContext);
  if (!ctx) throw new Error('useReservas debe usarse dentro de ReservasProvider');
  return ctx;
}
