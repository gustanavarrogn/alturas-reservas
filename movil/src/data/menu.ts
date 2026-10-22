// Categorías del menú según la información pública de la cafetería (Etapa 1, módulo de menú).
export interface Producto { nombre: string; precio: number; }
export interface Categoria { nombre: string; productos: Producto[]; }

export const MENU: Categoria[] = [
  { nombre: 'Café de altura', productos: [{ nombre: 'Americano', precio: 1.75 }, { nombre: 'Capuchino', precio: 2.5 }, { nombre: 'Latte', precio: 2.75 }] },
  { nombre: 'Bebidas frías', productos: [{ nombre: 'Frappé de café', precio: 3.5 }, { nombre: 'Limonada', precio: 2.0 }] },
  { nombre: 'Desayunos', productos: [{ nombre: 'Desayuno típico', precio: 5.5 }, { nombre: 'Pancakes', precio: 4.75 }] },
  { nombre: 'Almuerzos', productos: [{ nombre: 'Pollo a la plancha', precio: 8.5 }, { nombre: 'Lomito de res', precio: 10.0 }] },
  { nombre: 'Postres', productos: [{ nombre: 'Pastel de chocolate', precio: 3.25 }, { nombre: 'Flan', precio: 2.75 }] },
];
