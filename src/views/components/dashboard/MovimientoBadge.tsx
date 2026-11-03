import {
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoRemoveOutline,
} from "react-icons/io5";
import type { TipoMovimiento } from "@/entities";

// Etiqueta con el tipo de movimiento
const ESTILOS: Record<TipoMovimiento, { icono: typeof IoArrowUpOutline; colores: string; label: string }> = {
  entrada: { icono: IoArrowUpOutline,   colores: "bg-[#E5F4EC] text-[#2E8B57]", label: "Entrada" },
  salida:  { icono: IoArrowDownOutline, colores: "bg-[#FDECEA] text-[#F28B82]", label: "Salida" },
  ajuste:  { icono: IoRemoveOutline,    colores: "bg-[#EFEFEF] text-[#575757]", label: "Ajuste" },
};

export function MovimientoBadge({
  tipo,
  compact = false,
}: {
  tipo: TipoMovimiento;
  compact?: boolean;
}) {
  const { icono: Icono, colores, label } = ESTILOS[tipo];

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${colores} ${
        compact ? "gap-1 text-[11px] px-2 py-0.5" : "gap-1.5 text-xs px-2.5 py-1"
      }`}
    >
      <Icono size={compact ? 10 : 11} />
      {label}
    </span>
  );
}
