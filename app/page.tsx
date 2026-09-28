"use client";

import { useEffect, useRef } from "react";
import { useState } from "react";
export default function Home() {
    const reservaRef = useRef<HTMLDivElement>(null);
    const [mostrarReserva, setMostrarReserva] = useState(false);
    const [reservaConfirmada, setReservaConfirmada] = useState(false);
    const [formData, setFormData] = useState({
  nombre: "",
  telefono: "",
  fecha: "",
  hora: "",
  personas: "",
  tipo: "Almuerzo",
});
const [usuario, setUsuario] = useState("");
const [rol, setRol] = useState("");

useEffect(() => {
  const usuarioGuardado = localStorage.getItem("usuario");

  if (usuarioGuardado) {
    const datos = JSON.parse(usuarioGuardado);
    setUsuario(datos.nombre);
    setRol(datos.rol);
  }
}, []);
if (reservaConfirmada) {
  return (
    <main className="min-h-screen bg-[#f7f3ec] flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f2ec]">
          <span className="text-4xl">✓</span>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-[#315c45]">
          ¡Reserva confirmada!
        </h1>

        <p className="mt-3 text-gray-600">
          Tu solicitud de reserva ha sido registrada correctamente.
        </p>

        <div className="rounded-2xl bg-[#f7f3ec] p-6 text-[#2f2a24]">
          <p className="text-sm text-gray-500">
            Reserva para
          </p>

          <p className="mt-1 text-lg font-bold text-[#2f2a24]">
            {formData.nombre}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Fecha</p>
             <p className="font-semibold text-[#2f2a24]">
 {formData.fecha}
</p>
            </div>

            <div>
              <p className="text-gray-500">Hora</p>
              <p className="font-semibold text-[#2f2a24]">
 {formData.hora}
</p>
            </div>

            <div>
              <p className="text-gray-500">Personas</p>
              <p className="font-semibold">{formData.personas}</p>
            </div>

            <div>
              <p className="text-gray-500">Tipo</p>
              <p className="font-semibold">{formData.tipo}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
  setReservaConfirmada(false);
  setMostrarReserva(false);

  setFormData({
    nombre: "",
    telefono: "",
    fecha: "",
    hora: "",
    personas: "",
    tipo: "Almuerzo",
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}}
          className="mt-8 rounded-lg bg-[#315c45] px-8 py-3 font-semibold text-white hover:bg-[#264936]"
        >
          Aceptar
        </button>

      </div>
    </main>
  );
}
  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#2f2a24]">

      {/* NAVBAR */}
      <header className="border-b border-[#ddd3c5] bg-white/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-2xl font-bold text-[#315c45]">
              Alturas Reservas
            </h1>
            <p className="text-xs text-gray-500">
              Mirador Las Alturas del Boquerón
            </p>
          </div>

          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <a href="/" className="hover:text-[#315c45]">
              Inicio
            </a>
            <a href="#menu" className="hover:text-[#315c45]">
              Menú
            </a>
            <button
  onClick={() => {
    setMostrarReserva(true);

    setTimeout(() => {
      reservaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }}
  className="hover:text-[#315c45]"
>
  Reservas
</button>
            <a href="#contacto" className="hover:text-[#315c45]">
              Contacto
            </a>
          </nav>

         {usuario ? (
  <div className="flex items-center gap-3">
    <span className="text-sm font-semibold text-[#315c45]">
      Hola, {usuario}
    </span>
    {rol === "admin" && (
  <span className="rounded-lg bg-[#315c45] px-3 py-1 text-xs font-semibold text-white">
    Administrador
  </span>
)}

    <button
      onClick={() => {
        localStorage.removeItem("usuario");
        window.location.href = "/login";
      }}
      className="rounded-lg border border-[#315c45] px-5 py-2 text-sm font-semibold text-[#315c45] hover:bg-[#315c45] hover:text-white"
    >
      Cerrar sesión
    </button>
  </div>
) : (
  <a
    href="/login"
    className="rounded-lg bg-[#315c45] px-5 py-2 text-sm font-semibold text-white hover:bg-[#264936]"
  >
    Iniciar sesión
  </a>
)}

        </div>
      </header>
{rol === "admin" && (
  <section className="bg-[#315c45] py-8">
    <div className="mx-auto max-w-6xl px-6">
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#315c45]">
          Panel de administración
        </h2>

        <p className="mt-2 text-[#2f2a24]">
          Acceso exclusivo para el administrador.
        </p>

        <div className="mt-5 flex flex-wrap gap-4">
         <button
  onClick={() => {
    window.location.href = "/admin";
  }}
  className="rounded-lg bg-[#315c45] px-5 py-3 font-semibold text-white hover:bg-[#264936]"
>
  Gestionar reservas
</button>

          <button
            className="rounded-lg border border-[#315c45] px-5 py-3 font-semibold text-[#315c45] hover:bg-[#315c45] hover:text-white"
          >
            Gestionar usuarios
          </button>
        </div>
      </div>
    </div>
  </section>
)}

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">

        <div>
          <p className="mb-3 font-semibold uppercase tracking-widest text-[#8b6f47]">
            Bienvenido
          </p>

          <h2 className="text-5xl font-bold leading-tight md:text-6xl">
            Una experiencia
            <span className="block text-[#315c45]">
              sobre las alturas
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
            Disfruta de una experiencia gastronómica única en el
            Mirador Las Alturas del Boquerón. Reserva tu mesa de forma
            rápida y sencilla.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
 onClick={() => {
  setMostrarReserva(true);

  setTimeout(() => {
    reservaRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 100);
}}
  className="rounded-lg bg-[#315c45] px-7 py-3 font-semibold text-white shadow-md hover:bg-[#264936]"
>
  Reservar mesa
</button>

<a
  href="#menu"
   className="rounded-lg border border-[#315c45] px-7 py-3 font-semibold text-[#315c45] hover:bg-[#315c45] hover:text-white"
   >
  Ver menú
</a>
          </div>
        </div>


        {/* IMAGEN / ESPACIO VISUAL */}
        <div className="flex h-[420px] items-center justify-center rounded-3xl bg-gradient-to-br from-[#315c45] to-[#8b6f47] shadow-xl">
          <div className="text-center text-white">
            <div className="text-7xl">🏔️</div>
            <h3 className="mt-5 text-3xl font-bold">
              Las Alturas
            </h3>
            <p className="mt-2 text-white/80">
              Mirador del Boquerón
            </p>
          </div>
        </div>

      </section>


      {/* SERVICIOS */}
      <section id="menu" className="bg-white py-16">

        <div className="mx-auto max-w-6xl px-6">

          <div className="mb-12 text-center">
            <p className="font-semibold uppercase tracking-widest text-[#8b6f47]">
              Nuestra experiencia
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Todo lo que necesitas
            </h2>
          </div>


          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-[#e3ddd4] bg-[#faf8f4] p-8 text-center shadow-sm">
              <div className="text-4xl">🍽️</div>

              <h3 className="mt-4 text-xl font-bold">
                Gastronomía
              </h3>

              <p className="mt-3 text-gray-600">
                Disfruta nuestro menú en un ambiente agradable.
              </p>
            </div>


            <div className="rounded-2xl border border-[#e3ddd4] bg-[#faf8f4] p-8 text-center shadow-sm">
              <div className="text-4xl">📅</div>

              <h3 className="mt-4 text-xl font-bold">
                Reservas
              </h3>

              <p className="mt-3 text-gray-600">
                Reserva tu mesa de manera rápida y sencilla.
              </p>
            </div>


            <div className="rounded-2xl border border-[#e3ddd4] bg-[#faf8f4] p-8 text-center shadow-sm">
              <div className="text-4xl">🌋</div>

              <h3 className="mt-4 text-xl font-bold">
                Vista panorámica
              </h3>

              <p className="mt-3 text-gray-600">
                Vive una experiencia con una vista espectacular.
              </p>
            </div>

          </div>

        </div>

      </section>

{/* RESERVAS */}
{mostrarReserva && (
  <section className="bg-[#f7f3ec] py-16">
    <div className="mx-auto max-w-3xl px-6">

      <div
  ref={reservaRef}
  className="rounded-2xl bg-white p-8 shadow-lg"
>

        <div className="mb-8 text-center">
          <p className="font-semibold uppercase tracking-widest text-[#8b6f47]">
            Reservación
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Reserva tu mesa
          </h2>

          <p className="mt-3 text-gray-600">
            Completa los datos para solicitar tu reservación.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Nombre completo
            </label>

            <input
  type="text"
  placeholder="Escribe tu nombre"
  value={formData.nombre}
  onChange={(e) =>
    setFormData({ ...formData, nombre: e.target.value })
  }
  className="w-full rounded-lg border border-gray-300 px-4 text-base"
style={{ height: "48px" }}
/>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Teléfono
            </label>

            <input
              type="tel"
              placeholder="Ej. 7000-0000"
              value={formData.telefono}
onChange={(e) =>
  setFormData({ ...formData, telefono: e.target.value })
}
              className="w-full h-12 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#315c45]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Fecha
            </label>

            <input
              type="date"
              value={formData.fecha}
onChange={(e) =>
  setFormData({ ...formData, fecha: e.target.value })
}
              className="w-full h-12 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#315c45]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Hora
            </label>

            <input
              type="time"
              value={formData.hora}
onChange={(e) =>
  setFormData({ ...formData, hora: e.target.value })
}
              className="w-full h-12 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#315c45]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Número de personas
            </label>

            <input
              type="number"
              min="1"
              max="20"
              placeholder="Ej. 4"
              value={formData.personas}
onChange={(e) =>
  setFormData({ ...formData, personas: e.target.value })
}
              className="w-full h-12 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#315c45]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Tipo de reservación
            </label>

            <select
            value={formData.tipo}
onChange={(e) =>
  setFormData({ ...formData, tipo: e.target.value })
}
              className="w-full h-12 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#315c45]"
            >
              <option>Almuerzo</option>
              <option>Cena</option>
              <option>Celebración</option>
              <option>Otro</option>
            </select>
          </div>

        </div>

        <div className="mt-8 flex justify-center gap-4">

          <button
            onClick={() => setMostrarReserva(false)}
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
        onClick={async () => {
  const respuesta = await fetch("/api/reservas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (respuesta.ok) {
    setReservaConfirmada(true);
  } else {
    alert("Ocurrió un error al enviar la reservación.");
  }
}}
            className="rounded-lg bg-[#315c45] px-6 py-3 font-semibold text-white hover:bg-[#264936]"
          >
            Confirmar reservación
          </button>

        </div>

      </div>

    </div>
  </section>
)}
      {/* CTA */}
      <section className="bg-[#315c45] py-16 text-center text-white">

        <h2 className="text-3xl font-bold">
          ¿Listo para vivir la experiencia?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-white/80">
          Reserva tu mesa y disfruta de una experiencia diferente
          en Las Alturas del Boquerón.
        </p>

        <button
  onClick={() => {
    setMostrarReserva(true);

    setTimeout(() => {
      reservaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }}
 className="mt-7 rounded-lg bg-white text-[#315c45] px-8 py-3 font-bold ..."
>
  Reservar ahora
        </button>

      </section>


      {/* FOOTER */}
      <footer id="contacto" className="bg-[#24221f] px-6 py-8 text-center text-white">

        <h3 className="font-bold">
          Alturas Reservas
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          Mirador Las Alturas del Boquerón
        </p>

        <p className="mt-4 text-xs text-gray-500">
          © 2026 Alturas Reservas. Todos los derechos reservados.
        </p>

      </footer>

    </main>
  );
}