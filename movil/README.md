# Alturas Reservas – App móvil (React Native + Expo)

Aplicación móvil del proyecto de cátedra DPS941 para la **Cafetería Mirador Las Alturas del Boquerón**.
Avance 1 (Etapa 3): pantallas principales en React Native con navegación, autenticación y validaciones,
basadas en los mockups de Figma de la Etapa 1 y con la misma identidad visual de la versión web (Etapa 2).

## Funcionalidades del avance

- Inicio de sesión y registro con validación de todos los campos
- Sesión persistente y cierre de sesión con confirmación
- Navegación inferior: Inicio, Reservas, Menú, Perfil
- Reservar mesa: fecha, número de personas, tipo de reservación (Almuerzo, Cena, Celebración, Otro) y hora, con consulta de disponibilidad en tiempo real
- Pantalla de reserva confirmada, igual a la de la versión web
- Asignación automática de la mesa más pequeña donde cabe el grupo
- Mis reservas: próximas reservas, cancelación (hasta 2 h antes) e historial
- Menú por categorías y perfil del usuario

## Reglas de negocio implementadas

| Regla | Dónde |
|---|---|
| Mínimo 1 hora de anticipación y máximo 30 días | `src/logic/reservas.ts` |
| Una reserva confirmada por cliente por día | `src/logic/reservas.ts` |
| No se asigna una mesa ya ocupada en la misma fecha y hora | `src/logic/reservas.ts` |
| Cancelación permitida solo hasta 2 horas antes | `src/logic/reservas.ts` |
| Correo, contraseña (8+ caracteres, letras y números), nombre y teléfono de El Salvador | `src/logic/validaciones.ts` |

## Arquitectura por capas

```
src/
├── screens/      Capa de UI: pantallas
├── components/   Capa de UI: componentes reutilizables (Boton, CampoTexto, Selector, TarjetaReserva...)
├── navigation/   Navegación (stack de autenticación + tabs)
├── context/      Estado global con Context API (AuthContext, ReservasContext)
├── logic/        Capa de lógica: reglas de negocio y validaciones
├── services/     Capa de datos: persistencia (AsyncStorage; Firebase en el Avance 2)
├── data/         Datos base: mesas, horarios y menú
└── theme/        Paleta compartida con la web (verde #315C45, café #8B6F47, beige #F7F3EC)
```

## Instalación

```bash
npx create-expo-app@latest alturas-reservas --template blank-typescript
cd alturas-reservas
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage
```

Copiar `App.tsx` y la carpeta `src/` de este repositorio, y luego:

```bash
npx expo start
```

Escanear el código QR con **Expo Go** (Android/iOS) o presionar `a` para abrir el emulador de Android.

## Mockups (Figma – Etapa 1)

Pantallas móviles: Inicio, Inicio de sesión, Reservar mesa y Mis reservas.

## Integrante

Gustavo Adolfo Navarro Martínez – NM181601
