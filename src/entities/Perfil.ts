// Tabla de perfiles
export interface Perfil {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  foto_url: string | null;
  email: string;
  creado_en: string;
}
