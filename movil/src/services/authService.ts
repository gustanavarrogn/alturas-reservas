// Capa de datos: autenticación con Firebase Authentication y perfil en Firestore (usuarios/{uid}).
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Proveedor, Usuario } from './tipos';

export interface DatosRegistro {
  nombre: string;
  correo: string;
  telefono: string;
  contrasena: string;
}

const refUsuario = (uid: string) => doc(db, 'usuarios', uid);

// Crea el documento del perfil la primera vez que alguien entra (por ejemplo, con Google).
async function asegurarPerfil(user: User, proveedor: Proveedor, extra?: { nombre: string; telefono: string }) {
  const ref = refUsuario(user.uid);
  const existe = await getDoc(ref);
  if (existe.exists()) return;
  await setDoc(ref, {
    nombre: extra?.nombre ?? user.displayName ?? '',
    correo: (user.email ?? '').toLowerCase(),
    telefono: extra?.telefono ?? '',
    rol: 'cliente', // desde la app móvil siempre se crea un cliente (las reglas lo exigen)
    proveedor,
    creadoEn: serverTimestamp(),
  });
}

export const authService = {
  async registrar(datos: DatosRegistro) {
    const correo = datos.correo.trim().toLowerCase();
    const nombre = datos.nombre.trim();
    const { user } = await createUserWithEmailAndPassword(auth, correo, datos.contrasena);
    await updateProfile(user, { displayName: nombre });
    await asegurarPerfil(user, 'password', { nombre, telefono: datos.telefono.replace(/[\s-]/g, '') });
    // La verificación no bloquea el uso de la app; solo se informa en el perfil.
    sendEmailVerification(user).catch(() => undefined);
  },

  async iniciarSesion(correo: string, contrasena: string) {
    await signInWithEmailAndPassword(auth, correo.trim().toLowerCase(), contrasena);
  },

  // Web: ventana emergente de Google. Móvil: el idToken lo obtiene expo-auth-session.
  async iniciarConGoogle(idToken?: string) {
    const { user } = idToken
      ? await signInWithCredential(auth, GoogleAuthProvider.credential(idToken))
      : await signInWithPopup(auth, new GoogleAuthProvider());
    await asegurarPerfil(user, 'google');
  },

  recuperarContrasena: (correo: string) => sendPasswordResetEmail(auth, correo.trim().toLowerCase()),

  reenviarVerificacion: async () => {
    if (auth.currentUser) await sendEmailVerification(auth.currentUser);
  },

  async actualizarPerfil(uid: string, datos: { nombre: string; telefono: string }) {
    const nombre = datos.nombre.trim();
    await updateDoc(refUsuario(uid), { nombre, telefono: datos.telefono.replace(/[\s-]/g, ''), actualizadoEn: serverTimestamp() });
    if (auth.currentUser) await updateProfile(auth.currentUser, { displayName: nombre });
  },

  cerrarSesion: () => signOut(auth),

  // Escucha en tiempo real el perfil del usuario.
  escucharPerfil(uid: string, alCambiar: (u: Usuario | null) => void, alFallar: (e: unknown) => void) {
    return onSnapshot(
      refUsuario(uid),
      snap => {
        if (!snap.exists()) return alCambiar(null);
        const d = snap.data();
        alCambiar({
          uid,
          nombre: d.nombre ?? '',
          correo: d.correo ?? '',
          telefono: d.telefono ?? '',
          rol: d.rol === 'admin' ? 'admin' : 'cliente',
          proveedor: d.proveedor === 'google' ? 'google' : 'password',
          creadoEn: d.creadoEn instanceof Timestamp ? d.creadoEn.toDate() : null,
        });
      },
      alFallar,
    );
  },
};

// Traduce los códigos de error de Firebase a mensajes para el usuario.
export function mensajeError(e: unknown): string {
  const codigo = (e as { code?: string })?.code ?? '';
  const mensajes: Record<string, string> = {
    'auth/invalid-credential': 'Correo o contraseña incorrectos',
    'auth/wrong-password': 'Correo o contraseña incorrectos',
    'auth/user-not-found': 'Correo o contraseña incorrectos',
    'auth/invalid-email': 'El correo no tiene un formato válido',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo',
    'auth/weak-password': 'La contraseña es demasiado débil',
    'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e intenta de nuevo',
    'auth/network-request-failed': 'Sin conexión a internet. Revisa tu red',
    'auth/popup-closed-by-user': 'Se cerró la ventana de Google antes de terminar',
    'auth/cancelled-popup-request': 'Se cerró la ventana de Google antes de terminar',
    'auth/account-exists-with-different-credential': 'Ese correo ya está registrado con otro método de inicio de sesión',
    'auth/requires-recent-login': 'Por seguridad, vuelve a iniciar sesión',
    'permission-denied': 'No tienes permiso para realizar esta acción',
    unavailable: 'Sin conexión con el servidor. Intenta de nuevo',
  };
  return mensajes[codigo] ?? 'Ocurrió un error inesperado. Intenta de nuevo';
}
