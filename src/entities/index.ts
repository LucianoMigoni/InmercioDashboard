export * from "./catalogos";
export * from "./Perfil";
export * from "./Negocio";
export * from "./Suscripcion";
export * from "./Producto";
export * from "./Movimiento";
export * from "./Notificacion";

import type { Plan, Rubro, UnidadMedida } from "./catalogos";
import type { Perfil } from "./Perfil";
import type { Negocio, NegocioPerfil, NegocioTelefono, PreferenciasNotificaciones } from "./Negocio";
import type { Cobro, MetodoPago, Suscripcion } from "./Suscripcion";
import type { Categoria, Producto } from "./Producto";
import type { Movimiento } from "./Movimiento";

// Base de datos completa
export interface DatabaseShape {
  version: number;
  // Catalogos
  rubros: Rubro[];
  unidades_medida: UnidadMedida[];
  planes: Plan[];
  // Cuenta y negocio
  negocios: Negocio[];
  perfiles: Perfil[];
  negocio_perfiles: NegocioPerfil[];
  negocio_telefonos: NegocioTelefono[];
  preferencias_notificaciones: PreferenciasNotificaciones[];
  // Facturacion
  suscripciones: Suscripcion[];
  metodos_pago: MetodoPago[];
  cobros: Cobro[];
  // Inventario
  categorias: Categoria[];
  productos: Producto[];
  movimientos: Movimiento[];
}
