import type { DatabaseShape } from "@/entities";
import { fechaReferencia } from "./movimientosController";

const MESES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];
const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export interface PuntoEntradaSalida {
  label: string;
  entradas: number;
  salidas: number;
}

export interface PuntoVenta {
  label: string;
  ventas: number;
}

// Suma entradas y salidas agrupadas por fecha
function agruparEntradasSalidas(
  state: DatabaseShape,
  clave: (fechaISO: string) => string | null
): Map<string, { entradas: number; salidas: number }> {
  const grupos = new Map<string, { entradas: number; salidas: number }>();

  for (const m of state.movimientos) {
    if (m.tipo === "ajuste") continue;

    const k = clave(m.creado_en.slice(0, 10));
    if (k === null) continue;

    const g = grupos.get(k) ?? { entradas: 0, salidas: 0 };

    if (m.tipo === "entrada") g.entradas += m.cantidad;

    else g.salidas += m.cantidad;

    grupos.set(k, g);
  }
  return grupos;
}

// Entradas y salidas de cada mes del año
export function entradasSalidasPorMes(state: DatabaseShape): PuntoEntradaSalida[] {
  const ref = fechaReferencia(state);
  const anio = ref.slice(0, 4);
  const mesRef = Number(ref.slice(5, 7));

  const grupos = agruparEntradasSalidas(state, (f) =>
    f.startsWith(anio) ? f.slice(0, 7) : null
  );
  return Array.from({ length: mesRef }, (_, i) => {
    const g = grupos.get(`${anio}-${String(i + 1).padStart(2, "0")}`);
    return {
      label: MESES[i],
      entradas: Math.round(g?.entradas ?? 0),
      salidas: Math.round(g?.salidas ?? 0),
    };
  });
}

// Ultimos dias hasta la fecha de referencia
function ultimosDias(state: DatabaseShape, n: number): string[] {
  const ref = new Date(`${fechaReferencia(state)}T12:00:00Z`);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(ref);
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

// Entradas y salidas de la ultima semana
export function entradasSalidasSemana(state: DatabaseShape): PuntoEntradaSalida[] {
  const dias = ultimosDias(state, 7);
  const grupos = agruparEntradasSalidas(state, (f) => (dias.includes(f) ? f : null));
  return dias.map((f) => ({
    label: DIAS[new Date(`${f}T12:00:00Z`).getUTCDay()],
    entradas: Math.round(grupos.get(f)?.entradas ?? 0),
    salidas: Math.round(grupos.get(f)?.salidas ?? 0),
  }));
}

// Total vendido en un periodo
function montoVentas(state: DatabaseShape, filtro: (fechaISO: string) => boolean): number {
  let total = 0;
  for (const m of state.movimientos) {
    if (m.tipo !== "salida" || !filtro(m.creado_en.slice(0, 10))) continue;
    const producto = state.productos.find((p) => p.id === m.producto_id);
    total += m.cantidad * (producto?.precio_venta ?? 0);
  }
  return Math.round(total);
}

// Ventas por dia, semana y mes
export function ventasSeries(state: DatabaseShape): {
  diario: PuntoVenta[];
  semanal: PuntoVenta[];
  mensual: PuntoVenta[];
} {
  // Ultimos 7 dias
  const dias = ultimosDias(state, 7);
  const diario = dias.map((f) => ({
    label: DIAS[new Date(`${f}T12:00:00Z`).getUTCDay()],
    ventas: montoVentas(state, (x) => x === f),
  }));

  // Ultimas 6 semanas
  const semanal = Array.from({ length: 6 }, (_, i) => {
    const desde = ultimosDias(state, (6 - i) * 7)[0];
    const hasta = ultimosDias(state, (5 - i) * 7 + 1)[0];
    return {
      label: `S${i + 1}`,
      ventas: montoVentas(state, (x) => x >= desde && (i === 5 ? true : x < hasta)),
    };
  });

  // Todos los meses del año
  const anio = fechaReferencia(state).slice(0, 4);
  const meses = new Set<string>();
  for (const m of state.movimientos) {
    const f = m.creado_en.slice(0, 10);
    if (f.startsWith(anio)) meses.add(f.slice(0, 7));
  }
  const mensual = [...meses].sort().map((k) => ({
    label: MESES[Number(k.slice(5, 7)) - 1],
    ventas: montoVentas(state, (x) => x.startsWith(k)),
  }));

  return { diario, semanal, mensual };
}

export function pedidosCompletados(_state: DatabaseShape): number {
  return 0;
}
