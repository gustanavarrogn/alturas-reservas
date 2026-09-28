import { NextResponse } from "next/server";

let reservas: any[] = [];

export async function GET() {
  return NextResponse.json({
    mensaje: "Reservas obtenidas correctamente",
    reservas,
  });
}

export async function POST(request: Request) {
  const datos = await request.json();

  const nuevaReserva = {
    id: reservas.length + 1,
    ...datos,
  };

  reservas.push(nuevaReserva);

  return NextResponse.json({
    mensaje: "Reserva recibida correctamente",
    reserva: nuevaReserva,
  });
}
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));

  const indice = reservas.findIndex((reserva) => reserva.id === id);

  if (indice === -1) {
    return NextResponse.json(
      { mensaje: "Reserva no encontrada" },
      { status: 404 }
    );
  }

  reservas.splice(indice, 1);

  return NextResponse.json({
    mensaje: "Reserva eliminada correctamente",
  });
}