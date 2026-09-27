"use client";

import { useState } from "react";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const registrarse = () => {
  if (!nombre || !correo || !password || !confirmarPassword) {
    alert("Completa todos los campos.");
    return;
  }

  if (!correo.includes("@")) {
    alert("Ingresa un correo electrónico válido.");
    return;
  }

  if (password.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  if (password !== confirmarPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  localStorage.setItem(
  "usuarioRegistrado",
  JSON.stringify({
    nombre,
    correo,
    password,
  })
);

alert("Cuenta creada correctamente.");
window.location.href = "/login";
};

  return (
    <main className="min-h-screen bg-[#f7f3ec] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#315c45]">
            Crear una cuenta
          </h1>

          <p className="mt-2 text-gray-600">
            Regístrate en Alturas Reservas
          </p>
        </div>

        <div className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Nombre completo
            </label>

            <input
              type="text"
              placeholder="Ej. Gustavo Navarro"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-[#315c45]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-[#315c45]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-[#315c45]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Confirmar contraseña
            </label>

            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-[#315c45]"
            />
          </div>

          <button
            onClick={registrarse}
            className="w-full rounded-lg bg-[#315c45] px-6 py-3 font-semibold text-white hover:bg-[#264936]"
          >
            Crear cuenta
          </button>

        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = "/login"}
            className="text-sm font-semibold text-[#315c45] hover:underline"
          >
            ← Volver a iniciar sesión
          </button>
        </div>

      </div>
    </main>
  );
}