# Alturas Reservas

Sistema web de reservas para el restaurante/mirador **Las Alturas del Boquerón**.

## Integrante

- **Gustavo Adolfo Navarro Martínez**
- **Carnet:** NM181601

## Etapa 3 – Avance 1: App móvil (Foro 1)

| Entregable | Enlace |
|---|---|
| Video del avance | [Ver video en OneDrive](https://1drv.ms/v/c/5b529b9580d641c0/IQD1IuRPBJrrSoJrk2uAqA6QAZKKdWjcn-m1bpN1CGanxZ0?e=bi9zc1) |
| Documento (PDF, APA 7) | [docs/DPS941_Etapa3_Avance1_NM181601.pdf](docs/DPS941_Etapa3_Avance1_NM181601.pdf) |
| Código fuente de la app móvil | [movil/](movil/) (React Native + Expo) |
| Mockups en Figma | [Alturas Reservas – mockups](https://www.figma.com/design/3tonEJ2ZBb598lqGJeahmz/Alturas-Reservas-mockups?node-id=0-1) |

Para ejecutar la app móvil:

```bash
cd movil
npm install
npx expo start
```

Luego se escanea el código QR con la aplicación **Expo Go** (Android o iOS).

## Descripción del proyecto

Alturas Reservas es una aplicación web desarrollada para facilitar la gestión de reservaciones.

El sistema permite a los clientes registrarse, iniciar sesión y realizar reservaciones. También cuenta con un usuario administrador que puede consultar y gestionar las reservaciones y visualizar la información de los usuarios registrados.

## Tecnologías utilizadas

- React
- Next.js
- TypeScript
- Tailwind CSS
- JavaScript
- API REST
- LocalStorage
- Git
- GitHub

## Funcionalidades

### Cliente

El usuario con rol **cliente** puede:

- Registrarse en el sistema.
- Iniciar sesión.
- Visualizar la página principal.
- Realizar reservaciones.
- Enviar los datos de una reservación mediante la API REST.

### Administrador

El usuario con rol **admin** cuenta con permisos adicionales:

- Acceder al panel de administración.
- Consultar las reservaciones registradas.
- Eliminar reservaciones.
- Gestionar la información del usuario registrado.

El acceso al panel de administración está restringido mediante la validación del rol del usuario.

## Roles del sistema

El sistema implementa dos roles diferenciados:

- **cliente:** puede registrarse, iniciar sesión y realizar reservaciones.
- **admin:** puede acceder al panel administrativo, consultar y eliminar reservaciones y gestionar usuarios.

## Autenticación

La autenticación se implementa mediante `localStorage` con fines académicos.

El sistema almacena la información del usuario registrado y del usuario que actualmente ha iniciado sesión.

Para diferenciar los permisos se utiliza el atributo:

```text
rol