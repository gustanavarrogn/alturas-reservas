"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
 const [usuario, setUsuario] = useState("");
 const [usuarioRegistrado, setUsuarioRegistrado] = useState<any>(null);
const [reservas, setReservas] = useState<any[]>([]);

  useEffect(() => {
  const cargarDatos = async () => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      window.location.href = "/";
      return;
    }

    const datos = JSON.parse(usuarioGuardado);

    if (datos.rol !== "admin") {
      window.location.href = "/";
      return;
    }

    setUsuario(datos.nombre);
    const usuarioRegistradoGuardado =
  localStorage.getItem("usuarioRegistrado");

if (usuarioRegistradoGuardado) {
  setUsuarioRegistrado({
  ...JSON.parse(usuarioRegistradoGuardado),
  rol: JSON.parse(usuarioRegistradoGuardado).rol || "cliente",
});
}

    const respuesta = await fetch("/api/reservas");
    const datosReservas = await respuesta.json();

    setReservas(datosReservas.reservas);
  };

  cargarDatos();
}, []);

  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#2f2a24]">
      <header className="border-b border-[#e5ded2] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-[#315c45]">
              Alturas Reservas
            </h1>
            <p className="text-sm text-[#315c45]">
              Panel de administración
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[#315c45]">
              Hola, {usuario}
            </span>

            <button
              onClick={() => {
                localStorage.removeItem("usuario");
                window.location.href = "/login";
              }}
              className="rounded-lg border border-[#315c45] px-4 py-2 text-sm font-semibold text-[#315c45] hover:bg-[#315c45] hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-3xl font-bold text-[#315c45]">
          Dashboard
        </h2>

        <p className="mt-2 text-[#2f2a24]">
          Resumen general del sistema de reservas.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">
              Reservas
            </p>
            <p className="mt-2 text-4xl font-bold text-[#315c45]">
              0
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">
              Clientes
            </p>
            <p className="mt-2 text-4xl font-bold text-[#315c45]">
              0
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">
              Disponibilidad
            </p>
            <p className="mt-2 text-4xl font-bold text-[#315c45]">
              Disponible
            </p>
          </div>
        </div>
<div className="mt-8 rounded-2xl bg-white p-6 shadow-md">
  <h3 className="text-xl font-bold text-[#315c45]">
    Reservas registradas
  </h3>

  {reservas.length === 0 ? (
    <p className="mt-4 text-gray-500">
      No hay reservas registradas.
    </p>
  ) : (
    <div className="mt-4 space-y-4">
      {reservas.map((reserva) => (
        <div
          key={reserva.id}
          className="rounded-xl border border-[#e5ded2] p-4"
        >
          <p>
            <strong>Nombre:</strong> {reserva.nombre}
          </p>

          <p>
            <strong>Teléfono:</strong> {reserva.telefono}
          </p>

          <p>
            <strong>Fecha:</strong> {reserva.fecha}
          </p>

          <p>
            <strong>Hora:</strong> {reserva.hora}
          </p>

          <p>
            <strong>Personas:</strong> {reserva.personas}
          </p>

          <p>
            <strong>Tipo:</strong> {reserva.tipo}
          </p>
          <div className="mt-4">
  <button
    onClick={async () => {
        console.log("ID de reserva:", reserva.id);
      const respuesta = await fetch(
        `/api/reservas?id=${reserva.id}`,
        {
          method: "DELETE",
        }
      );

      if (respuesta.ok) {
        window.location.reload();
      } else {
        alert("No se pudo eliminar la reserva.");
      }
    }}
    className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
  >
    Eliminar reserva
  </button>
</div>
        </div>
      ))}
    </div>
  )}
</div>
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">
          <h3 className="text-xl font-bold text-[#315c45]">
            Administración
          </h3>

          <div className="mt-5 flex flex-wrap gap-4">
            <button className="rounded-lg bg-[#315c45] px-5 py-3 font-semibold text-white hover:bg-[#264936]">
              Gestionar reservas
            </button>

            <button
  onClick={() => {
    if (usuarioRegistrado) {
      alert(
        `Usuario registrado:\n\nNombre: ${usuarioRegistrado.nombre}\nCorreo: ${usuarioRegistrado.correo}\nRol: ${usuarioRegistrado.rol}`
      );
    } else {
      alert("No hay usuarios registrados.");
    }
  }}
  className="rounded-lg border border-[#315c45] px-5 py-3 font-semibold text-[#315c45] hover:bg-[#315c45] hover:text-white"
>
  Gestionar usuarios
</button>
          </div>
        </div>
      </section>
    </main>
  );
}