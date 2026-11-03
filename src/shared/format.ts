const MESES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

// Muestra la fecha como 25 May, 2026
export function formatFechaCorta(fechaISO: string): string {
  const [y, m, d] = fechaISO.split("-").map(Number);

  if (!y || !m || !d) return fechaISO;

  return `${d} ${MESES[m - 1]}, ${y}`;
}

// Agrega los guiones al CUIT
export function formatCuit(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);

  if (d.length <= 2) return d;

  if (d.length <= 10) return `${d.slice(0, 2)}-${d.slice(2)}`;

  return `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10)}`;
}

// Muestra un monto en pesos
export function formatARS(v: number): string {
  return `$${Math.round(v).toLocaleString("es-AR")}`;
}
