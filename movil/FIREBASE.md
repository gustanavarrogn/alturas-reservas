# Configurar Firebase para Alturas Reservas (móvil)

Toma unos 10 minutos. Solo se hace una vez.

## 1. Crear el proyecto

1. Entra a <https://console.firebase.google.com> con tu cuenta de Google y pulsa **Crear un proyecto**.
2. Nombre: `alturas-reservas`. Google Analytics no es necesario (se puede desactivar).

## 2. Registrar la app web y copiar las claves

La app usa el SDK web de Firebase (funciona en Expo Go, Android, iOS y web).

1. En la página del proyecto pulsa el ícono **`</>`** (Web). Apodo: `alturas-movil`. No marques Hosting.
2. Firebase muestra un bloque `firebaseConfig`. En la carpeta `movil/`, copia `.env.example` como `.env` y pega cada valor:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=alturas-reservas.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=alturas-reservas
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=alturas-reservas.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
EXPO_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abc123
```

`.env` no se sube a GitHub (está en `.gitignore`).

## 3. Activar Authentication

1. **Compilación > Authentication > Comenzar**.
2. En **Método de acceso** habilita **Correo electrónico/contraseña**.
3. Habilita **Google**: elige un correo de asistencia y guarda. Abre de nuevo el proveedor Google, despliega
   **Configuración del SDK web** y copia el **ID de cliente web** en `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
4. En **Configuración > Dominios autorizados** verifica que esté `localhost` (para `npx expo start --web`).

## 4. Crear Cloud Firestore y publicar las reglas

1. **Compilación > Firestore Database > Crear base de datos**. Ubicación: la que sugiera (por ejemplo `nam5`). Modo: **producción**.
2. Pestaña **Reglas**: borra el contenido, pega todo el archivo [`firestore.rules`](firestore.rules) y pulsa **Publicar**.

No hace falta crear colecciones a mano: `usuarios`, `reservas` y `ocupacion` se crean solas con el primer registro y la primera reserva.

## 5. Ejecutar

```bash
cd movil
npm install
npx expo start -c        # -c limpia la caché para que lea el .env nuevo
```

- **Expo Go (teléfono):** registro, inicio de sesión por correo, recuperación de contraseña, reservas, historial y perfil.
- **Web (`npx expo start --web` o tecla `w`):** todo lo anterior más **Continuar con Google** (ventana emergente de Google).

### Google dentro de la app de Android (opcional)

Expo Go no permite el inicio de sesión con Google en el teléfono; hace falta un *development build*:

1. En Google Cloud Console (mismo proyecto) crea un **ID de cliente OAuth de tipo Android** con el paquete
   `com.alturas.reservas` y la huella SHA-1 de tu certificado de depuración.
2. Pégalo en `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`.
3. Ejecuta `npx expo run:android` (requiere Android Studio) o `eas build --profile development --platform android`.

## Estructura de datos

| Colección | Documento | Campos |
|---|---|---|
| `usuarios` | `{uid}` | nombre, correo, telefono, rol (`cliente`/`admin`), proveedor (`password`/`google`), creadoEn |
| `reservas` | id automático | uid, correo, nombre, codigo, fecha, hora, personas, tipo, mesa, estado, creadoEn, canceladoEn |
| `ocupacion` | `AAAA-MM-DD_HHMM_MesaNN` | fecha, hora, mesa, uid, reservaId |

Para probar el rol administrador, cambia a mano el campo `rol` de tu documento en `usuarios` a `admin` desde la consola
(la app no lo permite por las reglas de seguridad).
