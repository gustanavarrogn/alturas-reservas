// Mesas ocupadas de una fecha, en tiempo real desde Firestore (colección ocupacion).
import { useEffect, useState } from 'react';
import { reservasService } from '../services/reservasService';

const VACIO = new Set<string>();

export function useOcupacion(fecha: string) {
  const [porHora, setPorHora] = useState<Record<string, Set<string>>>({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    setPorHora({});
    return reservasService.escucharOcupacion(
      fecha,
      datos => {
        setPorHora(datos);
        setCargando(false);
      },
      () => setCargando(false),
    );
  }, [fecha]);

  return { cargando, ocupadasEn: (hora: string) => porHora[hora] ?? VACIO };
}
