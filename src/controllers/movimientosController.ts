import { store } from "@/models";
import { calcularEstado } from "./productosController";
import type { DatabaseShape, Movimiento, TipoMovimiento } from "@/entities";

// Signo que se muestra junto a la cantidad
export type SignoMovimiento = "+" | "−" | "±";

// Movimiento listo para mostrar en pantalla
export interface MovimientoVM {
  id: string;
  productoId: string;
  producto: string;
  tipo: TipoMovimiento;
  cantidad: number;
  signo: SignoMovimiento;
  unidad: string;
  stockResultante: number;
  fechaISO: string;
  hora: string;
}

// Calcula el signo de cada movimiento
function calcularSignos(movimientos: Movimiento[]): Map<string, SignoMovimiento> {
  const signos = new Map<string, SignoMovimiento>();
  const stockPrevio = new Map<string, number>();
  // Los ordenamos del mas viejo al mas nuevo
  const cronologico = [...movimientos].sort((a, b) => a.creado_en.localeCompare(b.creado_en));

  for (const m of cronologico) {
    if (m.tipo === "entrada") signos.set(m.id, "+");
    else if (m.tipo === "salida") signos.set(m.id, "−");
    else {
      const prev = stockPrevio.get(m.producto_id);
      signos.set(m.id, prev === undefined ? "±" : m.stock_resultante >= prev ? "+" : "−");
    }
    stockPrevio.set(m.producto_id, m.stock_resultante);
  }

  return signos;
}

// Arma el movimiento con el nombre del producto y su unidad
function aVM(state: DatabaseShape, m: Movimiento, signo: SignoMovimiento): MovimientoVM {
  const producto = state.productos.find((p) => p.id === m.producto_id);

  const um = state.unidades_medida.find(
    (u) => u.id === producto?.unidad_medida_id
  );

  const simbolo = um?.simbolo ?? "u.";

  return {
    id: m.id,
    productoId: m.producto_id,
    producto: producto?.nombre ?? "(producto eliminado)",
    tipo: m.tipo,
    cantidad: m.cantidad,
    signo,
    unidad: simbolo === "u." ? "uds." : simbolo,
    stockResultante: m.stock_resultante,
    fechaISO: m.creado_en.slice(0, 10),
    hora: m.creado_en.slice(11, 16),
  };
}

// Todos los movimientos del mas nuevo al mas viejo
export function movimientosView(state: DatabaseShape): MovimientoVM[] {
  const signos = calcularSignos(state.movimientos);

  return [...state.movimientos]
    .sort((a, b) => b.creado_en.localeCompare(a.creado_en))
    .map((m) => aVM(state, m, signos.get(m.id) ?? "±"));
}

// Ultimos movimientos registrados
export function movimientosRecientes(state: DatabaseShape, limite = 5): MovimientoVM[] {
  return movimientosView(state).slice(0, limite);
}

// Fecha del movimiento mas reciente
export function fechaReferencia(state: DatabaseShape): string {
  return state.movimientos.reduce(
    (max, m) => (m.creado_en > max ? m.creado_en : max),
    state.movimientos[0]?.creado_en ?? new Date().toISOString()
  ).slice(0, 10);
}

// Registra un movimiento y ajusta el stock del producto asociado
export function registrarMovimiento(input: {
  productoId: string;
  tipo: TipoMovimiento;
  cantidad: number;
}): Movimiento | null {
  const state = store.getState();
  const producto = state.productos.find((p) => p.id === input.productoId);

  if (!producto || input.cantidad <= 0) return null;

  const delta = input.tipo === "entrada" ? input.cantidad : -input.cantidad;
  const stock_resultante = Math.max(0, producto.stock_actual + delta);

  const movimiento: Movimiento = {
    id: crypto.randomUUID(),
    negocio_id: producto.negocio_id,
    producto_id: producto.id,
    factura_item_id: null,
    mensaje_id: null,
    perfil_id: state.perfiles[0]?.id ?? null,
    tipo: input.tipo,
    cantidad: input.cantidad,
    stock_resultante,
    creado_en: new Date().toISOString(),
  };

  // Se actualiza el store
  store.setState({
    ...state,
    movimientos: [movimiento, ...state.movimientos],
    productos: state.productos.map((p) => {
      if (p.id !== producto.id) return p;
      const next = { ...p, stock_actual: stock_resultante };
      next.estado = calcularEstado(next);
      return next;
    }),
  });

  return movimiento;
}
