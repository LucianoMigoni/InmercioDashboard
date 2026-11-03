import { IoWarning, IoArrowForward, IoArrowUpOutline, IoArrowDownOutline, IoChevronBack, IoChevronForward, IoSwapVertical, IoStatsChartOutline, IoCubeOutline } from "react-icons/io5";
import { useState, type ComponentProps } from "react";
import { NavLink } from "react-router";
import { GradFlow } from "gradflow";
import { CardMovimiento, COLUMNAS_MOVIMIENTOS, DataTable } from "../../components/dashboard";
import { Button } from "../../components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../../components/ui/chart";
import { useIsCompact } from "../../components/ui/use-mobile";
import {
  cuentaView,
  entradasSalidasPorMes,
  fechaReferencia,
  movimientosRecientes,
  productosCriticos,
  productosView,
  stockPorCategoria,
} from "@/controllers";
import { useDatabase } from "@/models";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  Rectangle,
} from "recharts";

const areaChartConfig = {
  entradas: { label: "Entradas", color: "#A8D5BA" },
  salidas: { label: "Salidas", color: "#FFAD60" },
} satisfies ChartConfig;

const barChartConfig = {
  valor: { label: "Unidades" },
} satisfies ChartConfig;

const CATEGORIAS_POR_PAGINA = 5;
// Ancho del eje segun el largo de los nombres
const ANCHO_EJE_BASE = 80;
const ANCHO_EJE_AMPLIO = 104;
const MAX_LETRAS_SIN_AMPLIAR = 11;
const MAX_LETRAS_VISIBLES = 14;
const PREFIJO_PLACEHOLDER = "__placeholder_";

// Nombre de la categoria en el eje, recortado si es muy largo
function CategoriaTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const texto = String(payload?.value ?? "");
  // Las filas de relleno no llevan nombre
  if (texto.startsWith(PREFIJO_PLACEHOLDER)) return null;
  const display = texto.length > MAX_LETRAS_VISIBLES ? `${texto.slice(0, MAX_LETRAS_VISIBLES)}…` : texto;
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fill="#575757" fontSize={11}>
      <title>{texto}</title>
      {display}
    </text>
  );
}

// Indica si la fila es de relleno
function esFilaPlaceholder(payload?: ReadonlyArray<{ payload?: { cat?: string } }>) {
  return Boolean(payload?.[0]?.payload?.cat?.startsWith(PREFIJO_PLACEHOLDER));
}

// Tooltip que se oculta en las filas de relleno
function StockTooltipContent(props: ComponentProps<typeof ChartTooltipContent>) {
  if (esFilaPlaceholder(props.payload as ReadonlyArray<{ payload?: { cat?: string } }>)) return null;
  return <ChartTooltipContent {...props} />;
}

// Resaltado que se oculta en las filas de relleno
function StockTooltipCursor(
  props: ComponentProps<typeof Rectangle> & { payload?: ReadonlyArray<{ payload?: { cat?: string } }> }
) {
  if (esFilaPlaceholder(props.payload)) return null;
  return <Rectangle {...props} />;
}

// Mensaje cuando no hay datos
function EstadoVacio({
  icon: Icon,
  children,
}: {
  icon: typeof IoSwapVertical;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#F6F6F6] flex items-center justify-center">
        <Icon size={22} className="text-[#ADADAD]" />
      </div>
      <p className="text-sm font-medium text-[#575757]">{children}</p>
    </div>
  );
}

type CategoriaSort = "none" | "desc" | "asc";

export function Principal() {
  const state = useDatabase();
  const productos = productosView(state);
  const usuario = cuentaView(state);
  const isCompact = useIsCompact();

  // Entradas y salidas por mes
  const areaDataCompleto = entradasSalidasPorMes(state).map((d) => ({
    mes: d.label,
    entradas: d.entradas,
    salidas: d.salidas,
  }));
  // En pantallas chicas mostramos solo los ultimos 6 meses
  const areaData = isCompact ? areaDataCompleto.slice(-6) : areaDataCompleto;
  // Si no hubo movimientos mostramos un mensaje en lugar del grafico
  const hayFlujo = areaDataCompleto.some((d) => d.entradas > 0 || d.salidas > 0);

  // Stock por categoria
  const [catSort, setCatSort] = useState<CategoriaSort>("none");
  const [catPage, setCatPage] = useState(0);

  const barDataCompleto = stockPorCategoria(state).map((c) => ({
    cat: c.nombre,
    valor: c.unidades,
    color: c.color,
  }));
  // Revisa si hay alguna categoria con stock
  const hayStock = barDataCompleto.some((c) => c.valor > 0);

  // Ordena por cantidad de stock
  const barDataOrdenado = [...barDataCompleto];
  if (catSort === "desc") barDataOrdenado.sort((a, b) => b.valor - a.valor);
  else if (catSort === "asc") barDataOrdenado.sort((a, b) => a.valor - b.valor);

  // Muestra 5 categorias por pagina
  const totalPaginas = Math.max(1, Math.ceil(barDataOrdenado.length / CATEGORIAS_POR_PAGINA));
  const paginaActual = Math.min(catPage, totalPaginas - 1);
  const barData = barDataOrdenado.slice(
    paginaActual * CATEGORIAS_POR_PAGINA,
    paginaActual * CATEGORIAS_POR_PAGINA + CATEGORIAS_POR_PAGINA
  );

  // Completa con filas vacias para que siempre haya 5 barras
  const barDataChart = [...barData];
  while (barDataChart.length < CATEGORIAS_POR_PAGINA) {
    barDataChart.push({
      cat: `${PREFIJO_PLACEHOLDER}${barDataChart.length}`,
      valor: 0,
      color: "transparent",
    });
  }

  // Si hay nombres largos agrandamos el eje
  const maxLetras = barData.reduce(
    (max, e) => Math.max(max, Math.min(e.cat.length, MAX_LETRAS_VISIBLES)),
    0
  );
  const anchoEje = maxLetras > MAX_LETRAS_SIN_AMPLIAR ? ANCHO_EJE_AMPLIO : ANCHO_EJE_BASE;

  const ordenarPorStock = () =>
    setCatSort((prev) => (prev === "none" ? "desc" : prev === "desc" ? "asc" : "none"));

  // Ultimos movimientos
  const operacionesRecientes = movimientosRecientes(state, 5);

  // Tomamos como hoy la fecha del ultimo movimiento
  const hoyISO = fechaReferencia(state);
  const movimientosHoy = state.movimientos.filter(
    (m) => m.creado_en.slice(0, 10) === hoyISO
  );
  // Cantidad de entradas y salidas de hoy
  const entradasHoy = movimientosHoy.filter((m) => m.tipo === "entrada").length;
  const salidasHoy = movimientosHoy.filter((m) => m.tipo === "salida").length;

  const metricCards = [
    {
      label: "Entradas de hoy",
      value: entradasHoy.toLocaleString("es-AR"),
      icon: IoArrowUpOutline,
      color: "text-white",
      bg: "bg-[#A8D5BA]",
    },
    {
      label: "Salidas de hoy",
      value: salidasHoy.toLocaleString("es-AR"),
      icon: IoArrowDownOutline,
      color: "text-white",
      bg: "bg-[#F28B82]",
    },
    {
      label: "Artículos con bajo stock",
      value: String(productosCriticos(productos).length),
      icon: IoWarning,
      color: "text-white",
      bg: "bg-[#F5C543]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner de bienvenida */}
      <div
        className="rounded-2xl overflow-hidden relative p-6 text-white"
        style={{
          background: "linear-gradient(120deg, #F59538 0%, #E8801E 45%, #F0A040 100%)",
          boxShadow: "0 2px 8px rgba(200,95,10,0.08)",
        }}
      >
        {/* Fondo animado */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-70 mix-blend-overlay [&_canvas]:!w-full [&_canvas]:!h-full [&_canvas]:!object-cover [&>div]:!w-full [&>div]:!h-full">
          <GradFlow config={{
            color1: { r: 245, g: 149, b: 56 },
            color2: { r: 232, g: 128, b: 30 },
            color3: { r: 240, g: 160, b: 64 },
            speed: 0.15,
            scale: 1,
            type: 'stripe',
            noise: 0.05
          }} />
        </div>

        <div className="relative z-10">
          <p className="text-white/80 text-sm mb-1">Buenos días,</p>
          <h2 className="text-white mb-1">{usuario.nombre} {usuario.apellido} 👋</h2>
          <p className="text-white/80 text-sm max-w-md">
            Tu sistema de gestión de stock está funcionando correctamente. Revisa los indicadores clave a continuación.
          </p>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-5 flex items-center gap-4"
              style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.035)" }}
            >
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={22} className={card.color} />
              </div>
              <div>
                <p className="text-xs text-[#575757] font-medium">{card.label}</p>
                <p className="text-[#000000] font-bold text-lg leading-tight">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Grafico de entradas y salidas */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 min-w-0 flex flex-col max-h-[420px]" style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.035)" }}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
            <div>
              <h3 className="text-[#000000]">Entradas vs. Salidas</h3>
              <p className="text-xs text-[#575757]">Movimientos del inventario por mes</p>
            </div>
            {hayFlujo && (
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded-full" style={{ background: "#A8D5BA" }} />
                  <span className="text-xs text-[#575757]">Entradas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded-full" style={{ background: "#FFAD60" }} />
                  <span className="text-xs text-[#575757]">Salidas</span>
                </div>
              </div>
            )}
          </div>
          {hayFlujo ? (
            <ChartContainer config={areaChartConfig} className="flex-1 min-h-[200px] w-full">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-entradas)" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="var(--color-entradas)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSalidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-salidas)" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="var(--color-salidas)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="mes" tick={{ fill: "#575757", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis width={35} tick={{ fill: "#575757", fontSize: 11 }} axisLine={false} tickLine={false} padding={{ bottom: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="entradas" name="Entradas" stroke="var(--color-entradas)" strokeWidth={2.5} fill="url(#colorEntradas)" dot={false} />
                <Area type="monotone" dataKey="salidas" name="Salidas" stroke="var(--color-salidas)" strokeWidth={2.5} fill="url(#colorSalidas)" dot={false} />
              </AreaChart>
            </ChartContainer>
          ) : (
            <EstadoVacio icon={IoStatsChartOutline}>Todavía no hay movimientos registrados</EstadoVacio>
          )}
        </div>

        {/* Grafico de stock por categoria */}
        <div className="bg-white rounded-2xl p-5 min-w-0 flex flex-col max-h-[420px]" style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.035)" }}>
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[#000000]">Stock por Categoría</h3>
              <p className="text-xs text-[#575757]">Unidades disponibles</p>
            </div>
            {hayStock && (
              <button
                type="button"
                onClick={ordenarPorStock}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                  catSort === "none"
                    ? "border-[#E4E4E4] text-[#575757] hover:bg-[#F6F6F6]"
                    : "border-[#FFAD60] text-[#F5923E] bg-[#FFF4E8]"
                }`}
                title="Ordenar por cantidad de stock"
              >
                <IoSwapVertical size={13} />
                {catSort === "desc" ? "Mayor" : catSort === "asc" ? "Menor" : "Ordenar"}
              </button>
            )}
          </div>
          {hayStock ? (
            <>
              <ChartContainer config={barChartConfig} className="h-[200px] w-full">
                <BarChart data={barDataChart} layout="vertical" margin={{ top: 5, right: 8, left: 0, bottom: 5 }}>
                  <XAxis type="number" tick={{ fill: "#575757", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="cat" type="category" tick={<CategoriaTick />} axisLine={false} tickLine={false} width={anchoEje} />
                  <ChartTooltip cursor={<StockTooltipCursor />} content={<StockTooltipContent />} />
                  <Bar dataKey="valor" name="Unidades" radius={[0, 6, 6, 0]}>
                    {barDataChart.map((entry) => (
                      <Cell key={entry.cat} fill={entry.color ?? "#FFAD60"} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
              {/* Leyenda de categorias */}
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {barData.map((entry) => (
                  <div key={entry.cat} className="flex items-center gap-1.5 min-w-0" title={entry.cat}>
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.color }} />
                    <span className="text-xs text-[#575757] truncate">{entry.cat}</span>
                  </div>
                ))}
              </div>
              {/* Paginacion de categorias */}
              {totalPaginas > 1 && (
                <div className="mt-3 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCatPage((p) => Math.max(0, p - 1))}
                    disabled={paginaActual === 0}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-[#E4E4E4] text-[#575757] hover:bg-[#F6F6F6] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    aria-label="Categorías anteriores"
                  >
                    <IoChevronBack size={14} />
                  </button>
                  <span className="text-xs text-[#575757] font-medium tabular-nums">
                    {paginaActual + 1} / {totalPaginas}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCatPage((p) => Math.min(totalPaginas - 1, p + 1))}
                    disabled={paginaActual === totalPaginas - 1}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-[#E4E4E4] text-[#575757] hover:bg-[#F6F6F6] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    aria-label="Categorías siguientes"
                  >
                    <IoChevronForward size={14} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <EstadoVacio icon={IoCubeOutline}>Todavía no hay stock para mostrar</EstadoVacio>
          )}
        </div>
      </div>

      {/* Movimientos recientes */}
      <div className="bg-white rounded-2xl overflow-hidden min-w-0" style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.035)" }}>
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#E4E4E4]">
          <div>
            <h3 className="text-[#000000]">Entradas/Salidas recientes</h3>
            <p className="text-xs text-[#575757]">Últimas 5 operaciones registradas</p>
          </div>
          <Button asChild variant="link" size="sm" className="p-0 h-auto text-xs font-semibold text-[#FFAD60] hover:underline">
            <NavLink to="/dashboard/inventario">
              Ver todo <IoArrowForward size={12} />
            </NavLink>
          </Button>
        </div>
        {/* Tabla de movimientos */}
        <DataTable
          columnas={COLUMNAS_MOVIMIENTOS}
          filas={operacionesRecientes}
          filaKey={(m) => m.id}
          vacio={{ icon: IoSwapVertical, mensaje: "Todavía no hay movimientos registrados" }}
          renderCard={(m) => <CardMovimiento movimiento={m} />}
        />
      </div>
    </div>
  );
}
