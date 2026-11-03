import type { DatabaseShape, Notificacion } from "@/entities";
import { fechaReferencia } from "./movimientosController";

const DIA_MS = 24 * 60 * 60 * 1000;

// Arma las notificaciones segun las preferencias
export function generarNotificaciones(state: DatabaseShape): Notificacion[] {
  const prefs = state.preferencias_notificaciones[0];
  const hoy = fechaReferencia(state);
  const notifs: Notificacion[] = [];

  const vivos = state.productos.filter((p) => !p.descontinuado && !p.pausado);

  const ultimoMovDe = (productoId: string) =>
    state.movimientos.find((m) => m.producto_id === productoId);

  // Alertas de stock bajo o agotado
  if (prefs?.avisar_stock_bajo) {
    for (const p of vivos) {
      if (p.estado !== "stock_bajo" && p.estado !== "agotado") continue;

      const um = state.unidades_medida.find((u) => u.id === p.unidad_medida_id);
      const unidad = um?.simbolo ?? "u.";
      const mov = ultimoMovDe(p.id);
      const agotado = p.estado === "agotado";
      notifs.push({
        id: `stock-${p.id}`,
        tipo: "stock_bajo",
        nivel: "alerta",
        titulo: agotado ? `Producto agotado: ${p.nombre}` : `Stock bajo: ${p.nombre}`,
        mensaje: agotado
          ? `${p.nombre} se quedó sin existencias. Conviene reabastecer cuanto antes.`
          : `Quedan ${p.stock_actual} ${unidad} (mínimo ${p.stock_minimo} ${unidad}).`,
        fechaISO: mov?.creado_en.slice(0, 10) ?? hoy,
        hora: mov?.creado_en.slice(11, 16) ?? new Date().toTimeString().slice(0, 5),
      });
    }
  }

  // Alertas de productos sin movimiento
  if (prefs?.avisar_sin_movimiento) {
    const refMs = new Date(`${hoy}T00:00:00Z`).getTime();
    for (const p of vivos) {
      const mov = ultimoMovDe(p.id);
      const desde = mov ? mov.creado_en.slice(0, 10) : p.creado_en.slice(0, 10);
      const dias = Math.floor((refMs - new Date(`${desde}T00:00:00Z`).getTime()) / DIA_MS);

      if (dias < prefs.dias_sin_movimiento_umbral) continue;

      notifs.push({
        id: `sinmov-${p.id}`,
        tipo: "sin_movimiento",
        nivel: "info",
        titulo: `Sin movimiento: ${p.nombre}`,
        mensaje: `No registra entradas ni salidas hace ${dias} días. Revisá si sigue en góndola.`,
        fechaISO: desde,
        hora: "08:00",
      });
    }
  }

  // Las mas nuevas primero
  return notifs.sort((a, b) =>
    (b.fechaISO + b.hora).localeCompare(a.fechaISO + a.hora)
  );
}
