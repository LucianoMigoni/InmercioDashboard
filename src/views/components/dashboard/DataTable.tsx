import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { SortIcon } from "./SortIcon";

// Tabla que usan todas las vistas del dashboard

export type Columna<T, C extends string = string> = {
  // Nombre de la columna
  campo: C;
  label: string;
  ordenable?: boolean;
  // Clases extra para la celda
  className?: string;
  render: (fila: T) => ReactNode;
};

export type TablaVaciaProps = {
  icon: IconType;
  mensaje: ReactNode;
};

// Mensaje cuando la tabla esta vacia
export function TablaVacia({ icon: Icon, mensaje }: TablaVaciaProps) {
  return (
    <div className="py-12 flex flex-col items-center gap-3 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#F6F6F6] flex items-center justify-center">
        <Icon size={22} className="text-[#ADADAD]" />
      </div>
      <p className="text-sm font-medium text-[#575757]">{mensaje}</p>
    </div>
  );
}

export function DataTable<T, C extends string = string>({
  columnas,
  filas,
  filaKey,
  ordenCampo,
  ordenDir = "asc",
  onOrden,
  vacio,
  renderCard,
}: {
  columnas: Columna<T, C>[];
  filas: T[];
  filaKey: (fila: T) => string;
  // Orden actual de la tabla
  ordenCampo?: C;
  ordenDir?: "asc" | "desc";
  onOrden?: (campo: C) => void;
  vacio: TablaVaciaProps;
  // Tarjeta que se muestra en celular
  renderCard?: (fila: T) => ReactNode;
}) {
  const sinDatos = filas.length === 0;

  return (
    <>
      {/* Tarjetas en celular */}
      {renderCard && (
        <div className="md:hidden">
          {sinDatos ? (
            <TablaVacia {...vacio} />
          ) : (
            <div className="divide-y divide-[#E4E4E4]">
              {filas.map((fila) => (
                <div key={filaKey(fila)}>{renderCard(fila)}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tabla en pantallas grandes */}
      <div className={`${renderCard ? "hidden md:block" : ""} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F6F6F6] border-b border-[#E4E4E4]">
              {columnas.map((col) => {
                const ordenable = Boolean(col.ordenable && onOrden);
                return (
                  <th
                    key={col.campo}
                    onClick={ordenable ? () => onOrden?.(col.campo) : undefined}
                    className={`text-left px-5 py-3 text-xs font-semibold text-[#575757] uppercase tracking-wider ${
                      ordenable ? "cursor-pointer hover:text-[#FFAD60] select-none" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {ordenable && (
                        <SortIcon active={ordenCampo === col.campo} dir={ordenDir} />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sinDatos ? (
              <tr>
                <td colSpan={columnas.length}>
                  <TablaVacia {...vacio} />
                </td>
              </tr>
            ) : (
              filas.map((fila, i) => (
                <tr
                  key={filaKey(fila)}
                  className={`border-b border-[#E4E4E4] hover:bg-[#F6F6F6] transition-colors ${
                    i === filas.length - 1 ? "border-none" : ""
                  }`}
                >
                  {columnas.map((col) => (
                    <td key={col.campo} className={`px-5 py-3.5 ${col.className ?? ""}`}>
                      {col.render(fila)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
