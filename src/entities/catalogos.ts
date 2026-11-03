// Tabla de rubros
export interface Rubro {
  id: string;
  nombre: string;
}

// Tabla de unidades de medida
export interface UnidadMedida {
  id: string;
  nombre: string;
  simbolo: string;
}

// Cada cuanto se cobra un plan
export type PeriodicidadPlan = "mensual" | "trimestral" | "anual";

// Tabla de planes
export interface Plan {
  id: string;
  nombre: string;
  periodicidad: PeriodicidadPlan;
  precio_ars: number;
  limite_usuarios: number;

  // Lo que incluye el plan
  caracteristicas: {
    productos_max: number;
    analisis_ia: boolean;
    soporte_prioritario: boolean;
    descripcion: string;
  };

  activo: boolean;
  creado_en: string;
}
