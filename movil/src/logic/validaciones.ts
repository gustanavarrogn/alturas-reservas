// Capa de lógica: validaciones de formularios.
// Cada función devuelve un mensaje de error o null si el valor es válido.

export const validarCorreo = (correo: string): string | null => {
  if (!correo.trim()) return 'Ingresa tu correo electrónico';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim())) return 'El correo no tiene un formato válido';
  return null;
};

export const validarContrasena = (contrasena: string): string | null => {
  if (!contrasena) return 'Ingresa tu contraseña';
  if (contrasena.length < 8) return 'Debe tener al menos 8 caracteres';
  if (!/[A-Za-z]/.test(contrasena) || !/\d/.test(contrasena)) return 'Debe incluir letras y números';
  return null;
};

export const validarNombre = (nombre: string): string | null => {
  if (!nombre.trim()) return 'Ingresa tu nombre completo';
  if (nombre.trim().length < 3) return 'El nombre es demasiado corto';
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nombre.trim())) return 'Usa solo letras';
  return null;
};

// Teléfono de El Salvador: 8 dígitos que empiezan con 2, 6 o 7.
export const validarTelefono = (telefono: string): string | null => {
  const limpio = telefono.replace(/[\s-]/g, '');
  if (!limpio) return 'Ingresa tu teléfono';
  if (!/^[267]\d{7}$/.test(limpio)) return 'Debe tener 8 dígitos (ej. 7123-4567)';
  return null;
};

export const validarConfirmacion = (a: string, b: string): string | null =>
  a !== b ? 'Las contraseñas no coinciden' : null;
