// Limites de cada campo
export const LIMITES = {
  PRODUCTO_NOMBRE: { min: 2, max: 60 },
  CATEGORIA_NOMBRE: { min: 2, max: 60 },
  PERSONA_NOMBRE: { min: 2, max: 60 },
  NEGOCIO_NOMBRE: { min: 2, max: 60 },
  TELEFONO: { min: 6, max: 18, digitosMax: 13 },
  CUIT: { max: 13 },
  BUSQUEDA: { max: 100 },
  STOCK: { max: 1_000_000, decimales: 3 },
  PRECIO: { max: 100_000_000, decimales: 2 },
} as const;

// Caracteres que no se permiten
const TEXTO_NO_PERMITIDO = /[^\p{Script=Latin}0-9 .,()'%&/-]/gu;
const PERSONA_NO_PERMITIDO = /[^\p{Script=Latin} '-]/gu;
const TELEFONO_NO_PERMITIDO = /[^\d +()-]/g;

const CONTROL = /[\u0000-\u001F\u007F]/g;

// Saca los caracteres raros de un texto
export function limpiarTexto(valor: string, max: number): string {
  return valor.replace(CONTROL, "").replace(TEXTO_NO_PERMITIDO, "").replace(/\s{2,}/g, " ").slice(0, max);
}

export function limpiarNombrePersona(valor: string, max: number): string {
  return valor.replace(CONTROL, "").replace(PERSONA_NO_PERMITIDO, "").replace(/\s{2,}/g, " ").slice(0, max);
}

export function limpiarTelefono(valor: string): string {
  return valor.replace(TELEFONO_NO_PERMITIDO, "").slice(0, LIMITES.TELEFONO.max);
}

export function contieneCaracteresInvalidos(valor: string): boolean {
  return (
    new RegExp(CONTROL.source).test(valor) ||
    new RegExp(TEXTO_NO_PERMITIDO.source, "u").test(valor)
  );
}

// Valida el largo de un texto
export function validarTexto(
  valor: string,
  limites: { min: number; max: number },
  etiqueta: string
): string | null {
  const largo = valor.trim().length;

  if (largo < limites.min) {
    return `${etiqueta} debe tener al menos ${limites.min} caracteres.`;
  }

  if (largo > limites.max) {
    return `${etiqueta} no puede superar los ${limites.max} caracteres.`;
  }

  // Tiene que tener al menos una letra o un numero
  if (!/[\p{L}\p{N}]/u.test(valor)) {
    return `${etiqueta} debe incluir al menos una letra o un número.`;
  }

  return null;
}

// Redondea un numero y lo deja dentro del limite
export function acotarNumero(
  valor: number,
  tope: { max: number; decimales: number }
): number {
  if (!Number.isFinite(valor)) return 0;

  const factor = 10 ** tope.decimales;
  const redondeado = Math.round(valor * factor) / factor;

  return Math.min(Math.max(0, redondeado), tope.max);
}

// Valida un numero
export function validarNumero(
  valor: number,
  tope: { max: number },
  etiqueta: string
): string | null {
  if (!Number.isFinite(valor)) return `${etiqueta} no es un número válido.`;

  if (valor < 0) return `${etiqueta} no puede ser negativo.`;

  if (valor > tope.max) {
    return `${etiqueta} no puede superar ${tope.max.toLocaleString("es-AR")}.`;
  }

  return null;
}

// Limpia lo que se escribe en un campo numerico
export function limpiarCampoNumerico(
  valor: string,
  tope: { max: number; decimales: number }
): string {
  if (valor === "") return "";

  // No se permiten numeros negativos
  if (valor.trimStart().startsWith("-")) return "0";

  const n = Number(valor);

  if (!Number.isFinite(n)) return "";
  const acotado = acotarNumero(n, tope);

  return acotado === n ? valor : String(acotado);
}

// Bloquea el signo menos en los campos numericos
const TECLAS_BLOQUEADAS = ["-", "+", "e", "E"];

export function bloquearNegativos(e: {
  key: string;
  preventDefault: () => void;
}): void {
  if (TECLAS_BLOQUEADAS.includes(e.key)) e.preventDefault();
}

// Valida un CUIT
export function validarCuit(cuit: string): string | null {
  if (!cuit) return null;
  if (!/^\d{2}-\d{8}-\d$/.test(cuit)) {
    return "El CUIT debe estar completo (11 dígitos).";
  }
  return null;
}

// Valida un telefono
export function validarTelefono(telefono: string): string | null {
  if (!telefono) return null;

  if (new RegExp(TELEFONO_NO_PERMITIDO.source).test(telefono)) {
    return "El teléfono solo admite dígitos, espacios, «+», guiones y paréntesis.";
  }

  const digitos = telefono.replace(/\D/g, "").length;

  if (digitos < LIMITES.TELEFONO.min) {
    return `El teléfono debe tener al menos ${LIMITES.TELEFONO.min} dígitos.`;
  }

  if (digitos > LIMITES.TELEFONO.digitosMax) {
    return `El teléfono no puede tener más de ${LIMITES.TELEFONO.digitosMax} dígitos.`;
  }

  if (telefono.length > LIMITES.TELEFONO.max) {
    return `El teléfono no puede superar los ${LIMITES.TELEFONO.max} caracteres.`;
  }

  return null;
}
