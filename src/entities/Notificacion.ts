// Notificacion de la campanita
export interface Notificacion {
  id: string;
  tipo: "stock_bajo" | "sin_movimiento";
  nivel: "alerta" | "info";
  titulo: string;
  mensaje: string;
  fechaISO: string;
  hora: string;
}
