// De donde salio la categoria
export type OrigenCategoria = "manual" | "sugerida" | "ia";

// Tabla de categorias
export interface Categoria {
  id: string;
  negocio_id: string;
  nombre: string;
  origen: OrigenCategoria;
  creado_en: string;
}

// Estados de un producto
export type EstadoProducto =
  | "disponible"
  | "stock_bajo"
  | "agotado"
  | "pausado"
  | "descontinuado";

// Tabla de productos
export interface Producto {
  id: string;
  negocio_id: string;
  categoria_id: string | null;
  unidad_medida_id: string;
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
  precio_venta: number | null;
  pausado: boolean;
  descontinuado: boolean;
  estado: EstadoProducto;
  creado_en: string;
}
