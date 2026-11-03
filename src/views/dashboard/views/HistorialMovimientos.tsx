import { useEffect, useMemo, useState } from "react";
import { IoTrendingUp, IoTrendingDown, IoArrowUpOutline, IoArrowDownOutline, IoOptions, IoSwapVertical } from "react-icons/io5";
import { Dropdown } from "../../components/ui/dropdown";
import { CardMovimiento, COLUMNAS_MOVIMIENTOS, DataTable, FilterPanel, FilterLabel, Pagination, SearchInput, type CampoMovimiento } from "../../components/dashboard";
import { movimientosView } from "@/controllers";
import { LIMITES, bloquearNegativos, limpiarCampoNumerico } from "@/shared/validacion";
import type { TipoMovimiento } from "@/entities";

import { useDatabase } from "@/models";

type FiltroTipo = "todos" | TipoMovimiento;
type FiltroFecha = "todos" | "7dias" | "15dias" | "30dias";
// Columnas por las que se puede ordenar
type CampoOrden = CampoMovimiento;

const POR_PAGINA = 50;

const FILTROS_TIPO: { id: FiltroTipo; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "entrada", label: "Entradas" },
  { id: "salida", label: "Salidas" },
  { id: "ajuste", label: "Ajustes" },
];

const FILTROS_FECHA: { id: FiltroFecha; label: string; dias: number | null }[] = [
  { id: "todos", label: "Todo", dias: null },
  { id: "7dias", label: "Últimos 7 d", dias: 7 },
  { id: "15dias", label: "Últimos 15 d", dias: 15 },
  { id: "30dias", label: "Último mes", dias: 30 },
];

export function HistorialMovimientos() {
  const state = useDatabase();
  const movimientos = movimientosView(state);
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos");
  const [filtroFecha, setFiltroFecha] = useState<FiltroFecha>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState<CampoOrden>("fecha");
  const [ordenDir, setOrdenDir] = useState<"asc" | "desc">("desc");
  const [pagina, setPagina] = useState(1);
  const [cantMin, setCantMin] = useState("");
  const [cantMax, setCantMax] = useState("");

  const hoy = movimientos.reduce(
    (max, m) => (m.fechaISO > max ? m.fechaISO : max),
    movimientos[0]?.fechaISO ?? new Date().toISOString().slice(0, 10)
  );
  const diasDesde = (fechaISO: string) =>
    Math.floor((new Date(hoy).getTime() - new Date(fechaISO).getTime()) / 86_400_000);

  const minNum = cantMin === "" ? null : Number(cantMin);
  const maxNum = cantMax === "" ? null : Number(cantMax);

  const filtrados = useMemo(() => {
    const lista = movimientos.filter((m) => {
      if (filtroTipo !== "todos" && m.tipo !== filtroTipo) return false;
      const diasConfig = FILTROS_FECHA.find((f) => f.id === filtroFecha);
      if (diasConfig?.dias !== null && diasConfig?.dias !== undefined && diasDesde(m.fechaISO) > diasConfig.dias) return false;
      if (busqueda && !m.producto.toLowerCase().includes(busqueda.toLowerCase())) return false;
      if (minNum !== null && m.cantidad < minNum) return false;
      if (maxNum !== null && m.cantidad > maxNum) return false;
      return true;
    });

    const factor = ordenDir === "asc" ? 1 : -1;
    return lista.sort((a, b) => {
      switch (ordenCampo) {
        case "producto":
          return factor * a.producto.localeCompare(b.producto);
        case "tipo":
          return factor * a.tipo.localeCompare(b.tipo);
        case "cantidad":
          return factor * (a.cantidad - b.cantidad);
        case "fecha":
        default:
          return factor * `${a.fechaISO} ${a.hora}`.localeCompare(`${b.fechaISO} ${b.hora}`);
      }
    });
  }, [movimientos, filtroTipo, filtroFecha, busqueda, minNum, maxNum, ordenCampo, ordenDir]);

  const filtrosActivos =
    (filtroTipo !== "todos" ? 1 : 0) +
    (filtroFecha !== "todos" ? 1 : 0) +
    (cantMin !== "" || cantMax !== "" ? 1 : 0);

  function limpiarFiltros() {
    setFiltroTipo("todos");
    setFiltroFecha("todos");
    setCantMin("");
    setCantMax("");
  }

  const totalEntradas = filtrados.filter((m) => m.tipo === "entrada").length;
  const totalSalidas = filtrados.filter((m) => m.tipo === "salida").length;

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);
  const desde = filtrados.length === 0 ? 0 : (paginaActual - 1) * POR_PAGINA + 1;
  const hasta = (paginaActual - 1) * POR_PAGINA + visibles.length;

  // Vuelve a la primera pagina cuando cambian los filtros
  useEffect(() => {
    setPagina(1);
  }, [filtroTipo, filtroFecha, busqueda, minNum, maxNum, ordenCampo, ordenDir]);

  function toggleOrden(campo: CampoOrden) {
    if (ordenCampo === campo) {
      setOrdenDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setOrdenCampo(campo);
      setOrdenDir(campo === "fecha" ? "desc" : "asc");
    }
  }

  return (
    <div className="space-y-6">

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4" style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.035)" }}>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFAD60] flex items-center justify-center flex-shrink-0">
            <IoSwapVertical size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-[#575757] font-medium">Total Movimientos</p>
            <p className="text-[#000000] font-bold text-xl leading-tight">{filtrados.length}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <IoTrendingUp size={11} className="text-[#FFAD60]" />
              <span className="text-xs font-medium text-[#FFAD60]">+3 esta semana</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4" style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.035)" }}>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#A8D5BA] flex items-center justify-center flex-shrink-0">
            <IoArrowUpOutline size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-[#575757] font-medium">Entradas</p>
            <p className="text-[#000000] font-bold text-xl leading-tight">{totalEntradas}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <IoTrendingUp size={11} className="text-[#FFAD60]" />
              <span className="text-xs font-medium text-[#FFAD60]">+2 esta semana</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4" style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.035)" }}>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#F28B82] flex items-center justify-center flex-shrink-0">
            <IoArrowDownOutline size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-[#575757] font-medium">Salidas</p>
            <p className="text-[#000000] font-bold text-xl leading-tight">{totalSalidas}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <IoTrendingDown size={11} className="text-amber-400" />
              <span className="text-xs font-medium text-amber-400">–1 vs. semana ant.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl min-w-0" style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.035)" }}>

        {/* Barra de herramientas */}
        <div className="px-5 py-4 flex flex-col gap-3 border-b border-[#E4E4E4]">
          {/* Titulo y buscador */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h3 className="text-[#000000]">Registro de Movimientos</h3>
              <p className="text-xs text-[#575757] mt-0.5">Historial de entradas y salidas del inventario</p>
            </div>
            <SearchInput
              value={busqueda}
              onChange={setBusqueda}
              placeholder="Buscar producto..."
              className="flex-shrink-0"
            />
          </div>

          {/* Filtros */}
          <FilterPanel activos={filtrosActivos} onLimpiar={limpiarFiltros}>
            <div>
              <FilterLabel>Tipo de movimiento</FilterLabel>
              <Dropdown
                value={filtroTipo}
                options={FILTROS_TIPO.map((f) => ({ value: f.id, label: f.label }))}
                onSelect={(v) => setFiltroTipo(v as FiltroTipo)}
              />
            </div>

            <div>
              <FilterLabel>Período</FilterLabel>
              <Dropdown
                value={filtroFecha}
                options={FILTROS_FECHA.map((f) => ({ value: f.id, label: f.label }))}
                onSelect={(v) => setFiltroFecha(v as FiltroFecha)}
              />
            </div>

            <div>
              <FilterLabel>Cantidad</FilterLabel>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={LIMITES.STOCK.max}
                  value={cantMin}
                  onKeyDown={bloquearNegativos}
                  onChange={(e) => setCantMin(limpiarCampoNumerico(e.target.value, LIMITES.STOCK))}
                  placeholder="Mín."
                  className="w-full text-sm border border-[#E4E4E4] rounded-xl px-3 py-2 bg-[#F6F6F6] text-[#000000] placeholder-[#ADADAD] focus:outline-none focus:border-[#FFAD60] focus:ring-1 focus:ring-[#FFAD60]/15"
                />
                <span className="text-[#ADADAD] text-sm">–</span>
                <input
                  type="number"
                  min={0}
                  max={LIMITES.STOCK.max}
                  value={cantMax}
                  onKeyDown={bloquearNegativos}
                  onChange={(e) => setCantMax(limpiarCampoNumerico(e.target.value, LIMITES.STOCK))}
                  placeholder="Máx."
                  className="w-full text-sm border border-[#E4E4E4] rounded-xl px-3 py-2 bg-[#F6F6F6] text-[#000000] placeholder-[#ADADAD] focus:outline-none focus:border-[#FFAD60] focus:ring-1 focus:ring-[#FFAD60]/15"
                />
              </div>
            </div>
          </FilterPanel>
        </div>

        <DataTable
          columnas={COLUMNAS_MOVIMIENTOS}
          filas={visibles}
          filaKey={(m) => m.id}
          ordenCampo={ordenCampo}
          ordenDir={ordenDir}
          onOrden={toggleOrden}
          vacio={{
            icon: movimientos.length === 0 ? IoSwapVertical : IoOptions,
            mensaje:
              movimientos.length === 0
                ? "Todavía no hay movimientos registrados"
                : "Sin movimientos para los filtros seleccionados",
          }}
          renderCard={(m) => <CardMovimiento movimiento={m} />}
        />

        <Pagination
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onPagina={setPagina}
          desde={desde}
          hasta={hasta}
          total={filtrados.length}
          sustantivo="movimientos"
        />
      </div>
    </div>
  );
}
