import { useState, type ReactNode } from "react";
import { IoFilter, IoChevronDown } from "react-icons/io5";
import { useDismissable } from "./useDismissable";

// Menu desplegable de filtros
export function FilterPanel({
  activos,
  onLimpiar,
  children,
}: {
  activos: number;
  onLimpiar: () => void;
  children: ReactNode;
}) {
  const [abierto, setAbierto] = useState(false);
  const ref = useDismissable<HTMLDivElement>(abierto, () => setAbierto(false));

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className={`flex items-center gap-2 h-9 px-3.5 text-sm rounded-xl border bg-white transition-colors cursor-pointer ${
            abierto || activos > 0
              ? "border-[#FFAD60] text-[#FFAD60]"
              : "border-[#E4E4E4] text-[#575757] hover:border-[#FFAD60] hover:text-[#FFAD60]"
          }`}
        >
          <IoFilter size={15} />
          <span className="font-medium">Filtros</span>
          {activos > 0 && (
            <span className="min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-[#FFAD60] text-white text-[10px] font-semibold">
              {activos}
            </span>
          )}
          <IoChevronDown
            size={14}
            className={`transition-transform ${abierto ? "rotate-180" : ""}`}
          />
        </button>

        {abierto && (
          <div
            className="absolute left-0 top-full mt-2 z-30 w-72 bg-white rounded-2xl border border-[#E4E4E4] p-4 space-y-4"
            style={{ boxShadow: "0 8px 24px rgba(71,11,0,0.10)" }}
          >
            {children}

            {activos > 0 && (
              <button
                type="button"
                onClick={onLimpiar}
                className="w-full text-xs font-medium text-[#575757] hover:text-[#FFAD60] transition-colors pt-1 cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {activos > 0 && (
        <button
          type="button"
          onClick={onLimpiar}
          className="text-xs font-medium text-[#575757] hover:text-[#FFAD60] transition-colors cursor-pointer"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}

// Titulo de cada filtro
export function FilterLabel({ children }: { children: ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-[#575757] mb-1.5">{children}</label>
  );
}
