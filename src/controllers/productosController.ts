import { store } from "@/models";
import { LIMITES, acotarNumero, contieneCaracteresInvalidos, validarNumero, validarTexto } from "@/shared/validacion";
import type { DatabaseShape, EstadoProducto, Movimiento, Producto, TipoMovimiento } from "@/entities";

// Crea un movimiento de stock
function nuevoMovimiento(
  state: DatabaseShape,
  producto: Producto,
  tipo: TipoMovimiento,
  cantidad: number,
  stockResultante: number
): Movimiento {
  return {
    id: crypto.randomUUID(),
    negocio_id: producto.negocio_id,
    producto_id: producto.id,
    factura_item_id: null,
    mensaje_id: null,
    perfil_id: state.perfiles[0]?.id ?? null,
    tipo,
    cantidad,
    stock_resultante: stockResultante,
    creado_en: new Date().toISOString(),
  };
}

// Textos de cada estado
export const ETIQUETA_ESTADO: Record<EstadoProducto, string> = {
  disponible: "Disponible",
  stock_bajo: "Stock Bajo",
  agotado: "Agotado",
  pausado: "Pausado",
  descontinuado: "Descontinuado",
};

// Calcula el estado del producto segun su stock
export function calcularEstado(
  p: Pick<Producto, "stock_actual" | "stock_minimo" | "pausado" | "descontinuado">
): EstadoProducto {
  if (p.descontinuado) return "descontinuado";
  if (p.pausado) return "pausado";
  if (p.stock_actual <= 0) return "agotado";
  if (p.stock_actual <= p.stock_minimo) return "stock_bajo";
  return "disponible";
}

// Producto listo para mostrar en pantalla
export interface ProductoVM {
  id: string;
  nombre: string;
  categoria: string;
  categoriaId: string | null;
  unidadMedida: string;
  tipoVenta: "unidad" | "peso";
  stock: number;
  minimo: number;
  precio: number;
  estado: EstadoProducto;
}

// Arma el producto con su categoria y unidad
function aVM(state: DatabaseShape, p: Producto): ProductoVM {
  const cat = state.categorias.find((c) => c.id === p.categoria_id);
  const um = state.unidades_medida.find((u) => u.id === p.unidad_medida_id);
  const simbolo = um?.simbolo ?? "u.";

  return {
    id: p.id,
    nombre: p.nombre,
    categoria: cat?.nombre ?? "Sin categoría",
    categoriaId: p.categoria_id,
    unidadMedida: simbolo,
    tipoVenta: simbolo === "u." ? "unidad" : "peso",
    stock: p.stock_actual,
    minimo: p.stock_minimo,
    precio: p.precio_venta ?? 0,
    estado: p.estado,
  };
}

// Lista de productos del inventario
export function productosView(state: DatabaseShape): ProductoVM[] {
  // Dejamos afuera los descontinuados
  return state.productos.filter((p) => !p.descontinuado).map((p) => aVM(state, p));
}

// Numeros para las tarjetas de stock
export function statsInventario(productos: ProductoVM[]) {
  return {
    total: productos.length,
    stockBajo: productos.filter((p) => p.estado === "stock_bajo").length,
    agotados: productos.filter((p) => p.estado === "agotado").length,
  };
}

// Valor total del inventario
export function valorInventario(productos: ProductoVM[]): number {
  let total = 0;
  for (const p of productos) {
    total += p.stock * p.precio;
  }
  return total;
}

// Productos con poco stock o agotados
export function productosCriticos(productos: ProductoVM[]): ProductoVM[] {
  return productos.filter((p) => p.estado === "stock_bajo" || p.estado === "agotado");
}

export interface DatosProducto {
  nombre: string;
  categoria: string;
  unidadMedida: string;
  stock: number;
  minimo: number;
  precio: number;
}

function validarDatosProducto(
  state: DatabaseShape,
  datos: Partial<DatosProducto>,
  idActual?: string
): Partial<DatosProducto> {
  const out = { ...datos };

  if (out.nombre !== undefined) {
    out.nombre = out.nombre.trim();
    const nombre = out.nombre;
    const duplicado = state.productos.some(
      (p) =>
        !p.descontinuado &&
        p.id !== idActual &&
        p.nombre.toLowerCase() === nombre.toLowerCase()
    );

    const error = validarTexto(nombre, LIMITES.PRODUCTO_NOMBRE, "El nombre del producto") ?? (contieneCaracteresInvalidos(nombre) ? "El nombre del producto tiene caracteres no permitidos." : null) ?? (duplicado ? "Ya existe un producto con ese nombre." : null);

    if (error) throw new Error(error);
  }

  for (const [campo, etiqueta, tope] of [
    ["stock", "El stock", LIMITES.STOCK],
    ["minimo", "El stock mínimo", LIMITES.STOCK],
    ["precio", "El precio", LIMITES.PRECIO],
  ] as const) {
    const valor = out[campo];
    if (valor === undefined) continue;

    const error = validarNumero(valor, tope, etiqueta);
    if (error) throw new Error(error);

    out[campo] = acotarNumero(valor, tope);
  }

  return out;
}

// Busca los ids de categoria y unidad
function resolverFKs(state: DatabaseShape, datos: DatosProducto) {
  const categoria_id =
    state.categorias.find((c) => c.nombre === datos.categoria)?.id ?? null;

  const unidad_medida_id =
    state.unidades_medida.find((u) => u.simbolo === datos.unidadMedida)?.id ??
    state.unidades_medida.find((u) => u.simbolo === "u.")!.id;

  return { categoria_id, unidad_medida_id };
}

// Agrega un producto nuevo
export function addProducto(entrada: DatosProducto): Producto {
  const state = store.getState();
  const datos = validarDatosProducto(state, entrada) as DatosProducto;

  const base = {
    stock_actual: datos.stock,
    stock_minimo: datos.minimo,
    pausado: false,
    descontinuado: false,
  };

  const producto: Producto = {
    id: crypto.randomUUID(),
    negocio_id: state.negocios[0].id,
    ...resolverFKs(state, datos),
    nombre: datos.nombre,
    ...base,
    precio_venta: datos.precio,
    estado: calcularEstado(base),
    creado_en: new Date().toISOString(),
  };

  const movimientos =
    datos.stock > 0
      ? [nuevoMovimiento(state, producto, "entrada", datos.stock, datos.stock), ...state.movimientos]
      : state.movimientos;

  // Se actualiza el store
  store.setState({
    ...state,
    productos: [...state.productos, producto],
    movimientos,
  });

  return producto;
}

// Modifica un producto
export function updateProducto(id: string, entrada: Partial<DatosProducto>) {
  const state = store.getState();
  const datos = validarDatosProducto(state, entrada, id);
  const actual = state.productos.find((p) => p.id === id);

  if (!actual) return;

  const fks = datos.categoria !== undefined || datos.unidadMedida !== undefined;

  const next: Producto = {
    ...actual,
    ...(datos.nombre !== undefined && { nombre: datos.nombre }),
    ...(datos.stock !== undefined && { stock_actual: datos.stock }),
    ...(datos.minimo !== undefined && { stock_minimo: datos.minimo }),
    ...(datos.precio !== undefined && { precio_venta: datos.precio }),
    ...(fks && resolverFKs(state, { ...aVM(state, actual), ...datos })),
  };

  next.estado = calcularEstado(next);

  const delta = next.stock_actual - actual.stock_actual;

  const movimientos =
    delta !== 0
      ? [
        nuevoMovimiento(
          state,
          next,
          delta > 0 ? "entrada" : "salida",
          Math.abs(delta),
          next.stock_actual
        ),
        ...state.movimientos,
      ]
      : state.movimientos;

  // Se actualiza el store
  store.setState({
    ...state,
    productos: state.productos.map((p) => (p.id === id ? next : p)),
    movimientos,
  });
}

// Elimina un producto
export function deleteProducto(id: string) {
  const state = store.getState();
  const tieneMovimientos = state.movimientos.some((m) => m.producto_id === id);

  if (tieneMovimientos) {
    store.setState({
      ...state,
      productos: state.productos.map((p) =>
        p.id === id
          ? { ...p, descontinuado: true, estado: "descontinuado" as const }
          : p
      ),
    });
  } else {
    // Se actualiza el store
    store.setState({
      ...state,
      productos: state.productos.filter((p) => p.id !== id),
    });
  }
}
