import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { IoHome, IoCube, IoSettings, IoHelpCircle, IoChevronForward, IoSparkles, IoClose, IoMenu } from "react-icons/io5";
import markColor from "@/visuals/assets/logos/inmercio-mark-color.png";
import { SwapIcon } from "../components/icons/SwapIcon";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { OverlayScrollbar } from "../components/OverlayScrollbar";
import usuarioEjemplo from "@/visuals/assets/avatares/usuario-ejemplo.jpg";
import { Button } from "../components/ui/button";
import { useIsCompact } from "../components/ui/use-mobile";
import { Notificaciones } from "./Notificaciones";
import { cuentaView } from "@/controllers";

import { useDatabase } from "@/models";

const NAV_MAIN = [
  { to: "/dashboard", label: "Principal", icon: IoHome, end: true },
  { to: "/dashboard/inventario", label: "Inventario", icon: IoCube },
  { to: "/dashboard/historial", label: "Movimientos", icon: SwapIcon },
];

const NAV_SECONDARY = [
  { to: "/dashboard/configuracion", label: "Configuración", icon: IoSettings },
  { to: "/dashboard/ayuda", label: "Ayuda", icon: IoHelpCircle },
];

// Barra de navegacion lateral
function SidebarLink({ to, label, icon: Icon, end }: {
  to: string;
  label: string;
  icon: React.ElementType;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-200 group ${isActive ? "" : "hover:bg-white/60"
        }`
      }
      style={({ isActive }) =>
        isActive
          ? {
            background: "#ffffff",
            boxShadow: "0 2px 12px rgba(71,11,0,0.06), 0 1px 3px rgba(71,11,0,0.03)",
          }
          : {}
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FFAD60] to-[#F5923E] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Icon size={14} className="text-white" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon size={15} className="text-[#575757] group-hover:text-[#000000] transition-colors" />
            </div>
          )}

          <span
            className={`text-sm font-medium transition-colors ${isActive
              ? "text-[#000000]"
              : "text-[#575757] group-hover:text-[#000000]"
              }`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

// Indica en que pagina se encuentra el usuario
function Breadcrumb() {
  const location = useLocation();
  const pathMap: Record<string, string> = {
    "/dashboard": "Principal",
    "/dashboard/resumen": "Resumen",
    "/dashboard/inventario": "Inventario",
    "/dashboard/historial": "Movimientos",
    "/dashboard/configuracion": "Configuración",
    "/dashboard/ayuda": "Ayuda",
  };
  const current = pathMap[location.pathname] ?? "Página";
  return (
    <div className="flex items-center gap-1 text-xs text-[#575757]">
      <span>Páginas</span>
      <IoChevronForward size={12} />
      <span className="text-[#000000] font-medium">{current}</span>
    </div>
  );
}

// Titulo de la pagina
function PageTitle() {
  const location = useLocation();
  const titleMap: Record<string, string> = {
    "/dashboard": "Principal",
    "/dashboard/resumen": "Resumen",
    "/dashboard/inventario": "Inventario",
    "/dashboard/historial": "Movimientos",
    "/dashboard/configuracion": "Configuración",
    "/dashboard/ayuda": "Ayuda",
  };
  return (
    <h1 className="text-[#000000] mt-0.5">
      {titleMap[location.pathname] ?? "Página"}
    </h1>
  );
}

export function Layout() {
  const cuenta = cuentaView(useDatabase());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Menu lateral en celular
  const isCompact = useIsCompact();

  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Cierra el menu al cambiar de pagina
  useEffect(() => {
    if (isCompact) setSidebarOpen(false);
  }, [location.pathname, isCompact]);

  return (
    <div className="flex h-screen w-screen max-w-screen overflow-hidden bg-[#F6F6F6]">

      {/* Fondo oscuro del menu en celular */}
      {isCompact && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Menu lateral */}
      <aside
        className={`flex flex-col overflow-hidden bg-[#F6F6F6] ${isCompact
          ? `fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 transition-transform duration-300 ease-in-out shadow-2xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`
          : "w-52 flex-shrink-0"
          }`}
      >

        {/* Logo */}
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-[10px]"
                style={{ background: "linear-gradient(to bottom right,#FFE8CC,#FFD898)" }}
              >
                <ImageWithFallback
                  src={markColor}
                  alt="Inmercio"
                  className="w-[70%] h-[70%] object-contain"
                />
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-[16px] font-bold text-[#000000]">Inmercio</span>
                <span className="text-[11px] font-medium text-[#575757] mt-[3px]">Dashboard</span>
              </div>
            </div>
            {/* Boton de cerrar en celular */}
            {isCompact && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[#575757] hover:bg-white/60 transition-all"
              >
                <IoClose size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Navegacion */}
        <nav className="flex-1 px-3 pb-2 overflow-y-auto">
          <p className="text-[10px] font-semibold text-[#575757] uppercase tracking-widest px-2 mb-2">
            Navegación
          </p>
          <div className="space-y-0.5">
            {NAV_MAIN.map((item) => (
              <SidebarLink key={item.to} {...item} />
            ))}
          </div>

          <div className="mt-5">
            <p className="text-[10px] font-semibold text-[#575757] uppercase tracking-widest px-2 mb-2">
              Sistema
            </p>
            <div className="space-y-0.5">
              {NAV_SECONDARY.map((item) => (
                <SidebarLink key={item.to} {...item} />
              ))}
            </div>
          </div>
        </nav>

        {/* Banner de ayuda */}
        <div
          className="mx-3 mb-3 rounded-2xl p-3.5 bg-gradient-to-br from-[#FFAD60] to-[#F5923E] text-white relative overflow-hidden"
          style={{ boxShadow: "0 1px 6px rgba(71,11,0,0.08)" }}
        >
          <svg
            className="absolute -bottom-3 -right-3 opacity-20 pointer-events-none"
            width="110"
            height="110"
            viewBox="0 0 110 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="110" cy="110" r="30" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="110" cy="110" r="50" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="110" cy="110" r="70" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="110" cy="110" r="90" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="110" cy="110" r="110" stroke="white" strokeWidth="1.5" fill="none" />
          </svg>

          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1">
              <IoSparkles size={13} className="text-white/90" />
              <p className="text-xs font-semibold">¿Necesitas ayuda?</p>
            </div>
            <p className="text-[11px] text-white/75 mb-2.5 leading-relaxed">
              Consulta la documentación o contacta soporte.
            </p>
            <Button
              asChild
              className="w-full h-auto py-1.5 text-[11px] font-semibold rounded-lg bg-white text-[#FFAD60] hover:bg-white/90 hover:text-[#FFAD60] shadow-sm"
            >
              <NavLink to="/documentacion">Documentación</NavLink>
            </Button>
          </div>
        </div>

        {/* Perfil del usuario */}
        <div className="px-3 pb-4">
          <NavLink
            to="/dashboard/configuracion"
            className="flex items-center gap-2.5 p-2 rounded-xl transition-colors hover:bg-white/60"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#FFAD60]/20">
              <ImageWithFallback
                src={usuarioEjemplo}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#000000] truncate">
                {cuenta.nombre} {cuenta.apellido}
              </p>
              <span className="inline-flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFAD60]" />
                <span className="text-xs text-[#575757] font-medium">Plan {cuenta.plan.nombre}</span>
              </span>
            </div>
          </NavLink>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Barra superior */}
        <header className="px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-4 flex-shrink-0">

          {/* Boton de menu en celular */}
          {isCompact && (
            <Button
              variant="tertiary"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl bg-white flex-shrink-0"
              aria-label="Abrir menú"
            >
              <IoMenu size={18} />
            </Button>
          )}

          <div className="flex-1 min-w-0">
            <Breadcrumb />
            <PageTitle />
          </div>

          {/* Notificaciones */}
          <Notificaciones />

          {/* Foto de perfil */}
          <NavLink
            to="/dashboard/configuracion"
            aria-label="Configuración del perfil"
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#FFAD60]/20 cursor-pointer flex-shrink-0"
          >
            <ImageWithFallback
              src={usuarioEjemplo}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </NavLink>
        </header>

        <div className="flex flex-1 overflow-hidden min-w-0">
          <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-6 pb-8 min-w-0">
            <div key={location.pathname} className="page-enter">
              <Outlet />
            </div>
          </main>
          <OverlayScrollbar target={mainRef} />
        </div>
      </div>
    </div>
  );
}
