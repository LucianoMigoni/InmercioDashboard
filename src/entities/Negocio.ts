// Tabla de negocios
export interface Negocio {
  id: string;
  nombre: string;
  cuit: string | null;
  rubro_id: string;
  activo: boolean;
  creado_en: string;
}

// Roles dentro de un negocio
export type RolMiembro = "propietario" | "administrador" | "empleado";

// Relacion entre negocios y perfiles
export interface NegocioPerfil {
  id: string;
  negocio_id: string;
  perfil_id: string;
  rol: RolMiembro;
  creado_en: string;
}

// Telefonos del negocio
export interface NegocioTelefono {
  id: string;
  negocio_id: string;
  negocio_perfil_id: string | null;
  numero: string;
  activo: boolean;
  ultimo_resumen_enviado_en: string | null;
  creado_en: string;
}

// Preferencias de notificaciones
export interface PreferenciasNotificaciones {
  id: string;
  negocio_id: string;
  perfil_id: string;
  email_activo: boolean;
  avisar_stock_bajo: boolean;
  avisar_sin_movimiento: boolean;
  dias_sin_movimiento_umbral: number;
  avisar_pedidos: boolean;
  creado_en: string;
}
