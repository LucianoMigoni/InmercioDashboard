import { useState } from "react";
import { IoTrendingUp, IoTrendingDown, IoCube, IoWarning, IoCart, IoChevronBack, IoChevronForward, IoArrowUpOutline, IoArrowDownOutline } from "react-icons/io5";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../../components/ui/chart";
import {
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  entradasSalidasSemana,
  pedidosCompletados,
  productosCriticos,
  productosView,
  stockPorCategoria,
  valorInventario,
  ventasSeries,
  type PuntoVenta,
} from "@/controllers";
import { useDatabase } from "@/models";
import { formatARS } from "@/shared/format";

const entradasSalidasConfig = {
  entradas: { label: "Entradas", color: "#FFAD60" },
  salidas: { label: "Salidas", color: "#7EC8C8" },
} satisfies ChartConfig;

const formatARSCorto = (v: number) =>
  v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}M`
    : `$${(v / 1000).toFixed(0)}K`;

type TabKey = "diario" | "semanal" | "mensual";

const TABS: { key: TabKey; label: string }[] = [
  { key: "diario", label: "Diario" },
  { key: "semanal", label: "Semanal" },
  { key: "mensual", label: "Mensual" },
];

const TAB_META: Record<TabKey, { subtitle: string; statLabel: string; stat: (d: PuntoVenta[]) => number }> = {
  diario: { subtitle: "Últimos 7 días", statLabel: "Mejor día", stat: (d) => Math.max(...d.map((x) => x.ventas)) },
  semanal: { subtitle: "Últimas 6 semanas", statLabel: "Mejor semana", stat: (d) => Math.max(...d.map((x) => x.ventas)) },
  mensual: { subtitle: "Últimos 6 meses", statLabel: "Total acumulado", stat: (d) => d.reduce((a, x) => a + x.ventas, 0) },
};

const ventasChartConfig = {
  ventas: { label: "Ventas", color: "#FFAD60" },
} satisfies ChartConfig;

const radialChartConfig = {
  value: { label: "Nivel" },
} satisfies ChartConfig;

export function Resumen() {
  const state = useDatabase();
  const productos = productosView(state);
  const [activeTab, setActiveTab] = useState<TabKey>("semanal");
  const [radialInicio, setRadialInicio] = useState(0);

  // Datos para los graficos
  const lineData = entradasSalidasSemana(state);
  const chartData = ventasSeries(state)[activeTab];
  const meta = TAB_META[activeTab];
  const radialData = stockPorCategoria(state);

  // Carrusel de categorias de a 4
  const RADIAL_VISIBLE = 4;
  const total = radialData.length;
  const hayCarrusel = total > RADIAL_VISIBLE;
  const visibles = hayCarrusel
    ? Array.from({ length: RADIAL_VISIBLE }, (_, i) => radialData[(radialInicio + i) % total])
    : radialData;
  const moverRadial = (dir: 1 | -1) =>
    setRadialInicio((prev) => (prev + dir + total) % total);

  const kpiRows = [
    {
      label: "Valor Total del Inventario",
      value: formatARS(valorInventario(productos)),
      sub: "Actualizado hoy",
      icon: IoCube,
      color: "text-white",
      bg: "bg-[#FFAD60]",
      up: true,
      change: "+2.8%",
    },
    {
      label: "Pedidos Completados",
      value: String(pedidosCompletados(state)),
      sub: "Este mes",
      icon: IoCart,
      color: "text-white",
      bg: "bg-[#A8D5BA]",
      up: true,
      change: "+5.4%",
    },
    {
      label: "Artículos en Stock Mínimo",
      value: String(productosCriticos(productos).length),
      sub: "Requieren reabastecimiento",
      icon: IoWarning,
      color: "text-white",
      bg: "bg-[#F28B82]",
      up: false,
      change: "–1 vs ayer",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpiRows.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-2xl p-5 min-w-0" style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.035)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center`}>
                  <Icon size={20} className={k.color} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${k.up ? "text-[#FFAD60]" : "text-amber-400"}`}>
                  {k.up ? <IoTrendingUp size={12} /> : <IoTrendingDown size={12} />}
                  {k.change}
                </div>
              </div>
              <p className="text-[#000000] font-bold text-2xl leading-tight">{k.value}</p>
              <p className="text-xs text-[#404040] font-medium mt-1">{k.label}</p>
              <p className="text-xs text-[#888888] mt-0.5">{k.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Graficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Grafico de barras */}
        <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden min-w-0" style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.035)" }}>
          <div className="rounded-t-2xl p-5 pb-4" style={{ background: "linear-gradient(135deg, #0F1629 0%, #1A2444 100%)" }}>
            <ChartContainer config={entradasSalidasConfig} className="h-[200px] w-full [&_.recharts-cartesian-axis-tick_text]:!fill-white/45 [&_.recharts-cartesian-grid_line]:!stroke-white/[0.07]">
              <BarChart data={lineData} barCategoryGap="30%" barGap={3} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis width={35} tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Bar dataKey="entradas" name="Entradas" fill="var(--color-entradas)" radius={[4, 4, 0, 0]} maxBarSize={12} />
                <Bar dataKey="salidas" name="Salidas" fill="var(--color-salidas)" radius={[4, 4, 0, 0]} maxBarSize={12} />
              </BarChart>
            </ChartContainer>
          </div>

          <div className="px-5 py-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[#000000]">Entradas y Salidas (Últimos 7 días)</h3>
                <p className="text-xs text-[#FFAD60] font-semibold mt-0.5">
                  {(() => {
                    const diff = lineData[lineData.length - 1].entradas - lineData[0].entradas;
                    return diff > 0 ? `+${diff}` : diff;
                  })()} uds. respecto al lunes
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded-full" style={{ background: "#FFAD60" }} />
                  <span className="text-xs text-[#404040]">Entradas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded-full" style={{ background: "#7EC8C8" }} />
                  <span className="text-xs text-[#404040]">Salidas</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Entradas", value: lineData.reduce((a, d) => a + d.entradas, 0).toLocaleString("es-AR"), icon: IoArrowUpOutline, color: "text-[#FFAD60]", bg: "bg-[#FFE8CC]" },
                { label: "Total Salidas", value: lineData.reduce((a, d) => a + d.salidas, 0).toLocaleString("es-AR"), icon: IoArrowDownOutline, color: "text-[#5AACAC]", bg: "bg-[#D9F0F0]" },
              ].map((s) => {
                const Ic = s.icon;
                return (
                <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3 flex items-center gap-3`}>
                  <span className={`${s.color}`}><Ic size={18} /></span>
                  <div>
                    <p className={`font-bold text-sm ${s.color}`}>{s.value} <span className="text-xs font-medium">uds.</span></p>
                    <p className="text-xs text-[#575757]">{s.label}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ventas con tabs */}
        <div className="bg-white rounded-2xl p-5 min-w-0" style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.035)" }}>
          {/* Encabezado */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[#000000] mb-0.5">Ventas</h3>
              <p className="text-xs text-[#404040]">{meta.subtitle}</p>
            </div>
            {/* Pestañas */}
            <div className="flex items-center gap-1 bg-[#F6F6F6] rounded-xl p-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${activeTab === t.key
                    ? "bg-white text-[#F5923E] shadow-sm"
                    : "text-[#575757] hover:text-[#000000]"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grafico */}
          <ChartContainer config={ventasChartConfig} className="h-[160px] w-full">
            <BarChart data={chartData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#575757", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatARSCorto} tick={{ fill: "#575757", fontSize: 10 }} axisLine={false} tickLine={false} width={42} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatARSCorto(value as number)}
                  />
                }
              />
              <Bar dataKey="ventas" fill="var(--color-ventas)" radius={[4, 4, 0, 0]} maxBarSize={18} />
            </BarChart>
          </ChartContainer>

          {/* Pie con totales */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0F0F0]">
            <p className="text-xs text-[#404040]">{meta.statLabel}</p>
            <p className="text-xs font-bold text-[#F5923E]">{formatARSCorto(meta.stat(chartData))}</p>
          </div>
        </div>
      </div>

      {/* Stock por categoria */}
      <div className="bg-white rounded-2xl p-5 min-w-0" style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.035)" }}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[#000000] mb-1">Nivel de Stock por Categoría</h3>
            <p className="text-xs text-[#404040]">Porcentaje del nivel objetivo alcanzado</p>
          </div>
          {hayCarrusel && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => moverRadial(-1)}
                aria-label="Anterior"
                className="w-8 h-8 rounded-xl border border-[#E4E4E4] flex items-center justify-center text-[#575757] hover:border-[#FFAD60] hover:text-[#FFAD60] transition-colors cursor-pointer"
              >
                <IoChevronBack size={16} />
              </button>
              <button
                onClick={() => moverRadial(1)}
                aria-label="Siguiente"
                className="w-8 h-8 rounded-xl border border-[#E4E4E4] flex items-center justify-center text-[#575757] hover:border-[#FFAD60] hover:text-[#FFAD60] transition-colors cursor-pointer"
              >
                <IoChevronForward size={16} />
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {visibles.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              <ChartContainer config={radialChartConfig} className="h-[100px] w-full">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={44}
                  barSize={8}
                  data={[{ value: item.porcentaje, fill: item.color }]}
                  startAngle={90}
                  endAngle={90 - (item.porcentaje / 100) * 360}
                >
                  <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "#F6F6F6" }} />
                </RadialBarChart>
              </ChartContainer>
              <p className="text-[#000000] font-bold text-sm -mt-2">{item.porcentaje}%</p>
              <p className="text-xs text-[#404040] mt-0.5">{item.nombre}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
