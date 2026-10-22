// Estado global de la sesión (Context API).
import React, { createContext, useContext, useEffect, useState } from 'react';
import { almacenamiento, Usuario } from '../services/almacenamiento';

type DatosRegistro = Omit<Usuario, 'rol'>;

interface AuthValor {
  usuario: Usuario | null;
  cargando: boolean;
  iniciarSesion: (correo: string, contrasena: string) => Promise<string | null>;
  registrarse: (datos: DatosRegistro) => Promise<string | null>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthValor | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // Al abrir la app se restaura la sesión guardada.
  useEffect(() => {
    (async () => {
      const correo = await almacenamiento.obtenerSesion();
      if (correo) {
        const usuarios = await almacenamiento.obtenerUsuarios();
        setUsuario(usuarios.find(u => u.correo === correo) ?? null);
      }
      setCargando(false);
    })();
  }, []);

  const iniciarSesion = async (correo: string, contrasena: string) => {
    const usuarios = await almacenamiento.obtenerUsuarios();
    const encontrado = usuarios.find(u => u.correo === correo.trim().toLowerCase());
    // Mismo mensaje en ambos casos para no revelar qué correos están registrados.
    if (!encontrado || encontrado.contrasena !== contrasena) return 'Correo o contraseña incorrectos';
    await almacenamiento.guardarSesion(encontrado.correo);
    setUsuario(encontrado);
    return null;
  };

  const registrarse = async (datos: DatosRegistro) => {
    const usuarios = await almacenamiento.obtenerUsuarios();
    const correo = datos.correo.trim().toLowerCase();
    if (usuarios.some(u => u.correo === correo)) return 'Ya existe una cuenta con ese correo';
    // Todo registro desde la app móvil crea un cliente; el admin solo entra por el panel web.
    const nuevo: Usuario = { ...datos, correo, nombre: datos.nombre.trim(), rol: 'cliente' };
    await almacenamiento.guardarUsuarios([...usuarios, nuevo]);
    await almacenamiento.guardarSesion(correo);
    setUsuario(nuevo);
    return null;
  };

  const cerrarSesion = async () => {
    await almacenamiento.borrarSesion();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, registrarse, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
