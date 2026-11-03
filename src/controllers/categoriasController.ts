import { store } from "@/models";
import { LIMITES, limpiarTexto, validarTexto } from "@/shared/validacion";
import type { Categoria, DatabaseShape } from "@/entities";
import { productosView } from "./productosController";

// Paleta de colores para los graficos
const PALETA_CATEGORIAS = [
  "#FFAD60", "#FFD898", "#F4A7B0", "#B3C9E8",
  "#A8D5BA", "#7EC8C8", "#C9A8E0", "#E0B3A8",
];

// Devuelve el nombre de la categoria validado y limpio
function normalizarNombreCategoria(nombre: string): string | null {
  const limpio = limpiarTexto(nombre, LIMITES.CATEGORIA_NOMBRE.max).trim();

  if (validarTexto(limpio, LIMITES.CATEGORIA_NOMBRE, "El nombre")) return null;

  return limpio;
}

// Agrega una categoria nueva
export function addCategoria(nombre: string): Categoria {
  const state = store.getState();
  const limpio = normalizarNombreCategoria(nombre);

  if (limpio === null) {
    throw new Error("El nombre de la categoría no es válido.");
  }

  // Si ya existe devolvemos la que estaba
  const existente = state.categorias.find(
    (c) => c.nombre.toLowerCase() === limpio.toLowerCase()
  );
  if (existente) return existente;

  const categoria: Categoria = {
    id: crypto.randomUUID(),
    negocio_id: state.negocios[0].id,
    nombre: limpio,
    origen: "manual",
    creado_en: new Date().toISOString(),
  };

  // Se actualiza el store
  store.setState({
    ...state,
    categorias: [...state.categorias, categoria],
  });
  return categoria;
}

// Cambia el nombre de una categoria
export function updateCategoria(id: string, nombre: string): boolean {
  const state = store.getState();
  const limpio = normalizarNombreCategoria(nombre);

  if (limpio === null) return false;

  // Revisa que no haya otra con el mismo nombre
  const duplicada = state.categorias.some(
    (c) => c.id !== id && c.nombre.toLowerCase() === limpio.toLowerCase()
  );

  if (duplicada) return false;

  // Se actualiza el store
  store.setState({
    ...state,
    categorias: state.categorias.map((c) => (c.id === id ? { ...c, nombre: limpio } : c)),
  });

  return true;
}

// Elimina una categoria
export function deleteCategoria(id: string) {
  const state = store.getState();

  // Se actualiza el store
  store.setState({
    ...state,
    categorias: state.categorias.filter((c) => c.id !== id),
    productos: state.productos.map((p) =>
      p.categoria_id === id ? { ...p, categoria_id: null } : p
    ),
  });
}

// Cuantos productos tiene cada categoria
export function productosPorCategoria(state: DatabaseShape): Map<string, number> {
  const conteo = new Map<string, number>();

  for (const p of state.productos) {
    if (p.descontinuado || !p.categoria_id) continue;
    conteo.set(p.categoria_id, (conteo.get(p.categoria_id) ?? 0) + 1);
  }

  return conteo;
}

// Stock por categoria
export interface StockCategoria {
  id: string;
  nombre: string;
  color: string;
  unidades: number;
  porcentaje: number;
}

// Agrupa el stock por categoria
export function stockPorCategoria(state: DatabaseShape): StockCategoria[] {
  const productos = productosView(state);

  const filas = state.categorias.map((cat, i) => {
    const unidades = productos
      .filter((p) => p.categoriaId === cat.id)
      .reduce((acc, p) => acc + p.stock, 0);
    return {
      id: cat.id,
      nombre: cat.nombre,
      color: PALETA_CATEGORIAS[i % PALETA_CATEGORIAS.length],
      unidades: Math.round(unidades),
      porcentaje: 0,
    };
  });

  const max = Math.max(1, ...filas.map((f) => f.unidades));

  return filas.map((f) => ({
    ...f,
    porcentaje: Math.round((f.unidades / max) * 100),
  }));
}
