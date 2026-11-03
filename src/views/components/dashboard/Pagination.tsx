import { IoChevronBack, IoChevronForward } from "react-icons/io5";

// Paginacion de las tablas
export function Pagination({
  paginaActual,
  totalPaginas,
  onPagina,
  desde,
  hasta,
  total,
  sustantivo,
}: {
  paginaActual: number;
  totalPaginas: number;
  onPagina: (n: number) => void;
  desde: number;
  hasta: number;
  total: number;
  sustantivo: string;
}) {
  return (
    <div className="px-5 py-3 border-t border-[#E4E4E4] flex items-center justify-between gap-3 flex-wrap">
      <p className="text-xs text-[#575757]">
        Mostrando{" "}
        <span className="font-semibold text-[#000000]">{desde}–{hasta}</span> de{" "}
        <span className="font-semibold text-[#000000]">{total}</span> {sustantivo}
      </p>

      {totalPaginas > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPagina(Math.max(1, paginaActual - 1))}
            disabled={paginaActual === 1}
            aria-label="Página anterior"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E4E4E4] text-[#575757] hover:border-[#FFAD60] hover:text-[#FFAD60] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#E4E4E4] disabled:hover:text-[#575757]"
          >
            <IoChevronBack size={15} />
          </button>

          {Array.from({ length: totalPaginas }, (_, idx) => idx + 1).map((n) => (
            <button
              key={n}
              onClick={() => onPagina(n)}
              className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                n === paginaActual
                  ? "bg-[#FFAD60] text-white"
                  : "border border-[#E4E4E4] text-[#575757] hover:border-[#FFAD60] hover:text-[#FFAD60]"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => onPagina(Math.min(totalPaginas, paginaActual + 1))}
            disabled={paginaActual === totalPaginas}
            aria-label="Página siguiente"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E4E4E4] text-[#575757] hover:border-[#FFAD60] hover:text-[#FFAD60] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#E4E4E4] disabled:hover:text-[#575757]"
          >
            <IoChevronForward size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
