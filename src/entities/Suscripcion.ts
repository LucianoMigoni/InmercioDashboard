// Estados de una suscripcion
export type EstadoSuscripcion = "trial" | "activa" | "morosa" | "cancelada";

// Tabla de suscripciones
export interface Suscripcion {
  id: string;
  negocio_id: string;
  plan_id: string;
  estado: EstadoSuscripcion;
  inicio_trial: string;
  dias_trial: number;
  fin_trial: string;
  proxima_fecha_cobro: string | null;
  creado_en: string;
}

// Tabla de metodos de pago
export interface MetodoPago {
  id: string;
  negocio_id: string;
  mp_customer_id: string;
  mp_card_id: string;
  ultimos_4_digitos: string;
  marca: string;
  vencimiento: string;
  activo: boolean;
  creado_en: string;
}

// Estados de un cobro
export type EstadoCobro = "pendiente" | "aprobado" | "rechazado";

// Tabla de cobros
export interface Cobro {
  id: string;
  negocio_id: string;
  suscripcion_id: string;
  emisor_id: string | null;
  monto_ars: number;
  estado: EstadoCobro;
  mp_payment_id: string | null;
  creado_en: string;
}
