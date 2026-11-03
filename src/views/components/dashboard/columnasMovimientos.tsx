import { MovimientoBadge } from "./MovimientoBadge";
import type { Columna } from "./DataTable";
import { formatFechaCorta } from "@/shared/format";
import type { MovimientoVM } from "@/controllers";

// Columnas de la tabla de movimientos

export type CampoMovimiento = "producto" | "tipo" | "cantidad" | "fecha";

export const COLUMNAS_MOVIMIENTOS: Columna<MovimientoVM, CampoMovimiento>[] = [
  {
    campo: "producto",
    label: "Producto",
    ordenable: true,
    render: (m) => (
      <>
        <p className="font-medium text-[#000000] leading-tight">{m.producto}</p>
        {/* Id acortado */}
        <p className="text-xs text-[#ADADAD] mt-0.5 uppercase">{m.id.slice(0, 8)}</p>
      </>
    ),
  },
  {
    campo: "tipo",
    label: "Tipo",
    ordenable: true,
    render: (m) => <MovimientoBadge tipo={m.tipo} />,
  },
  {
    campo: "cantidad",
    label: "Cantidad",
    ordenable: true,
    className: "font-semibold text-[#000000] whitespace-nowrap",
    render: (m) => (
      <>
        {m.signo}{m.cantidad}{" "}
        <span className="text-xs font-normal text-[#575757]">{m.unidad}</span>
      </>
    ),
  },
  {
    campo: "fecha",
    label: "Fecha",
    ordenable: true,
    className: "whitespace-nowrap",
    render: (m) => (
      <>
        <p className="text-xs font-medium text-[#000000]">{formatFechaCorta(m.fechaISO)}</p>
        <p className="text-xs text-[#ADADAD]">{m.hora}</p>
      </>
    ),
  },
];

// Tarjeta de movimiento en celular
export function CardMovimiento({ movimiento: m }: { movimiento: MovimientoVM }) {
  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-[#000000] text-sm leading-tight break-words">{m.producto}</p>
        <p className="text-[11px] text-[#ADADAD] mt-0.5">{formatFechaCorta(m.fechaISO)} · {m.hora}</p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <MovimientoBadge tipo={m.tipo} compact />
        <span className="text-sm font-semibold text-[#000000] whitespace-nowrap">
          {m.signo}{m.cantidad}{" "}
          <span className="text-xs font-normal text-[#575757]">{m.unidad}</span>
        </span>
      </div>
    </div>
  );
}
