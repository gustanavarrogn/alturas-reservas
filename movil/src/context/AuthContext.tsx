// Estado global de la sesión (Context API) conectado a Firebase Authentication.
// onAuthStateChanged restaura la sesión al abrir la app y el perfil se escucha en tiempo real.
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { authService, DatosRegistro, mensajeError } from '../services/authService';
import { Usuario } from '../services/tipos';

// Las acciones devuelven un mensaje de error o null si todo salió bien.
type Resultado = Promise<string | null>;

interface AuthValor {
  usuario: Usuario | null;
  correoVerificado: boolean;
  cargando: boolean;
  iniciarSesion: (correo: string, contrasena: string) => Resultado;
  registrarse: (datos: DatosRegistro) => Resultado;
  iniciarConGoogle: (idToken?: string) => Resultado;
  recuperarContrasena: (correo: string) => Resultado;
  reenviarVerificacion: () => Resultado;
  actualizarPerfil: (datos: { nombre: string; telefono: string }) => Resultado;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthValor | undefined>(undefined);

async function intentar(accion: () => Promise<unknown>): Resultado {
  try {
    await accion();
    return null;
  } catch (e) {
    return mensajeError(e);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let dejarDeEscucharPerfil: (() => void) | undefined;
    const dejarDeEscucharAuth = onAuthStateChanged(auth, user => {
      dejarDeEscucharPerfil?.();
      setFirebaseUser(user);
      if (!user) {
        setUsuario(null);
        setCargando(false);
        return;
      }
      // Recién registrado el documento puede tardar un instante; el snapshot avisa cuando exista.
      dejarDeEscucharPerfil = authService.escucharPerfil(
        user.uid,
        perfil => {
          setUsuario(perfil);
          if (perfil) setCargando(false);
        },
        () => setCargando(false),
      );
      // Si en 8 s no aparece el perfil, se deja de mostrar la pantalla de carga.
      setTimeout(() => setCargando(false), 8000);
    });
    return () => {
      dejarDeEscucharPerfil?.();
      dejarDeEscucharAuth();
    };
  }, []);

  const valor: AuthValor = {
    usuario,
    correoVerificado: firebaseUser?.emailVerified ?? false,
    cargando,
    iniciarSesion: (correo, contrasena) => intentar(() => authService.iniciarSesion(correo, contrasena)),
    registrarse: datos => intentar(() => authService.registrar(datos)),
    iniciarConGoogle: idToken => intentar(() => authService.iniciarConGoogle(idToken)),
    recuperarContrasena: correo => intentar(() => authService.recuperarContrasena(correo)),
    reenviarVerificacion: () => intentar(authService.reenviarVerificacion),
    actualizarPerfil: datos =>
      usuario ? intentar(() => authService.actualizarPerfil(usuario.uid, datos)) : Promise.resolve('Debes iniciar sesión'),
    cerrarSesion: async () => {
      await authService.cerrarSesion();
    },
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
