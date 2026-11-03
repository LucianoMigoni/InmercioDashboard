// Tipos de movimiento
export type TipoMovimiento = "entrada" | "salida" | "ajuste";

// Tabla de movimientos
export interface Movimiento {
  id: string;
  negocio_id: string;
  producto_id: string;
  factura_item_id: string | null;
  mensaje_id: string | null;
  perfil_id: string | null;
  tipo: TipoMovimiento;
  cantidad: number;
  stock_resultante: number;
  creado_en: string;
}
