# Alturas Reservas

Sistema web de reservas para el restaurante/mirador **Las Alturas del Boquerón**.

## Integrante

- **Gustavo Adolfo Navarro Martínez**
- **Carnet:** NM181601

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