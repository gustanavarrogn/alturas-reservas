"use client";

import { useState } from "react";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

 const iniciarSesion = () => {
  if (!correo || !password) {
    alert("Completa todos los campos.");
    return;
  }

  const usuarioGuardado = localStorage.getItem("usuarioRegistrado");

  if (!usuarioGuardado) {
    alert("No existe ninguna cuenta registrada.");
    return;
  }

  const usuario = JSON.parse(usuarioGuardado);

  if (correo !== usuario.correo || password !== usuario.password) {
    alert("Correo o contraseña incorrectos.");
    return;
  }

  alert(`Bienvenido, ${usuario.nombre}.`);
  localStorage.setItem("usuario", JSON.stringify(usuario));
window.location.href = "/";
};

  return (
    <main className="min-h-screen bg-[#f7f3ec] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#315c45]">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-gray-600">
            Accede a Alturas Reservas
          </p>
        </div>

        <div className="mt-8 space-y-5">

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
              placeholder="Escribe tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-[#315c45]"
            />
          </div>

          <button
            onClick={iniciarSesion}
            className="w-full rounded-lg bg-[#315c45] px-6 py-3 font-semibold text-white hover:bg-[#264936]"
          >
            Iniciar sesión
          </button>

        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = "/"}
            className="text-sm font-semibold text-[#315c45] hover:underline"
          >
            ← Volver al inicio
          </button>
        </div>
<div className="mt-4 text-center">
  <button
  onClick={() => window.location.href = "/registro"}
    className="text-sm font-semibold text-[#315c45] hover:underline"
  >
    Crear una cuenta
  </button>
</div>
      </div>
    </main>
  );
}