import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useBlocker } from "react-router";
import { IoPerson, IoNotifications, IoShield, IoCard, IoDownload, IoCall, IoPricetag, IoStorefront, IoCalendar, IoLockClosed } from "react-icons/io5";
import { ImageWithFallback } from "../../components/ImageWithFallback";
import { IdCardIcon } from "../../components/icons/IdCardIcon";
import { WhatsAppIcon } from "../../components/icons/WhatsAppIcon";
import usuarioEjemplo from "@/visuals/assets/avatares/usuario-ejemplo.jpg";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Button } from "../../components/ui/button";
import { Dropdown } from "../../components/ui/dropdown";
import { cuentaView, updateCuenta, updateNotificaciones, type CuentaVM } from "@/controllers";

import { useDatabase } from "@/models";

import { formatARS, formatCuit } from "@/shared/format";
import { LIMITES, limpiarNombrePersona, limpiarTelefono, limpiarTexto, validarCuit, validarTelefono, validarTexto } from "@/shared/validacion";

// Estilos de los campos del perfil
const INPUT_CLS =
  "w-full text-sm border border-[#E4E4E4] rounded-xl pl-9 pr-3 py-2 bg-[#F6F6F6] text-[#000000] focus:outline-none focus:border-[#FFAD60] focus:ring-1 focus:ring-[#FFAD60]/20";
const READONLY_CLS =
  "w-full text-sm border border-[#E4E4E4] rounded-xl px-3 py-2 bg-[#F0F0F0] text-[#575757] flex items-center gap-2 cursor-not-allowed select-none";

// Campo con un icono a la izquierda
function InputConIcono({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-[#888888] pointer-events-none">
        {icon}
      </span>
      {children}
    </div>
  );
}

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// Muestra la fecha como 12 de noviembre de 2025
function formatFechaLarga(iso: string): string {
  const [y, m, d] = (iso || "").split("-").map(Number);
  if (!y || !m || !d) return iso || "—";
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0 ${checked ? "bg-[#FFAD60]" : "bg-[#E4E4E4]"
        }`}
      style={{ height: "22px", width: "40px" }}
    >
      <span
        className="absolute bg-white rounded-full shadow-sm transition-transform duration-200"
        style={{
          width: "18px",
          height: "18px",
          top: "2px",
          left: "2px",
          transform: checked ? "translateX(18px)" : "translateX(0px)",
        }}
      />
    </button>
  );
}

const SECCIONES = [
  { id: "perfil", label: "Perfil", icon: IoPerson },
  { id: "notificaciones", label: "Notificaciones", icon: IoNotifications },
  { id: "seguridad", label: "Seguridad", icon: IoShield },
  { id: "facturacion", label: "Facturación", icon: IoCard },
];

// Campos que se pueden editar, se guardan al tocar Aplicar
type PerfilForm = {
  nombre: string;
  apellido: string;
  cuit: string;
  negocio: string;
  rubro: string;
  telefonoContacto: string;
  notificaciones: CuentaVM["notificaciones"];
};

function extraerForm(u: CuentaVM): PerfilForm {
  return {
    nombre: u.nombre,
    apellido: u.apellido,
    cuit: u.cuit,
    negocio: u.negocio,
    rubro: u.rubro,
    telefonoContacto: u.telefonoContacto,
    notificaciones: { ...u.notificaciones },
  };
}

// Indica si hay cambios sin guardar
function hayCambios(borrador: PerfilForm, guardado: PerfilForm): boolean {
  return (
    borrador.nombre !== guardado.nombre ||
    borrador.apellido !== guardado.apellido ||
    borrador.cuit !== guardado.cuit ||
    borrador.negocio !== guardado.negocio ||
    borrador.rubro !== guardado.rubro ||
    borrador.telefonoContacto !== guardado.telefonoContacto ||
    (Object.keys(borrador.notificaciones) as (keyof PerfilForm["notificaciones"])[]).some(
      (k) => borrador.notificaciones[k] !== guardado.notificaciones[k]
    )
  );
}

export function Configuracion() {
  const state = useDatabase();
  const usuario = cuentaView(state);
  const rubros = state.rubros;
  const [seccion, setSeccion] = useState("perfil");

  // Datos guardados y datos que se estan editando
  const guardado = useMemo(() => extraerForm(usuario), [usuario]);
  const [form, setForm] = useState<PerfilForm>(guardado);
  const dirty = hayCambios(form, guardado);
  const notifs = form.notificaciones;

  // Si hay errores no se puede aplicar
  const errores = {
    nombre: validarTexto(form.nombre, LIMITES.PERSONA_NOMBRE, "El nombre"),
    apellido: validarTexto(form.apellido, LIMITES.PERSONA_NOMBRE, "El apellido"),
    negocio: validarTexto(form.negocio, LIMITES.NEGOCIO_NOMBRE, "El nombre del negocio"),
    cuit: validarCuit(form.cuit),
    telefonoContacto: validarTelefono(form.telefonoContacto),
  };
  const formValido = Object.values(errores).every((e) => e === null);

  // Cartel de confirmacion abierto
  const [confirmacion, setConfirmacion] = useState<null | "aplicar" | "cancelar">(null);

  // No deja salir si hay cambios sin guardar
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && currentLocation.pathname !== nextLocation.pathname
  );

  // Avisa al cerrar o recargar la pestaña
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const actualizar = (patch: Partial<PerfilForm>) => setForm((f) => ({ ...f, ...patch }));

  function aplicar() {
    updateCuenta({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      cuit: form.cuit,
      negocio: form.negocio.trim(),
      rubro: form.rubro,
      telefonoContacto: form.telefonoContacto.trim(),
    });
    updateNotificaciones(form.notificaciones);
    setConfirmacion(null);
  }

  function descartar() {
    setForm(guardado);
    setConfirmacion(null);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5">

      {/* Menu lateral */}
      <aside className="w-full lg:w-52 lg:flex-shrink-0">
        <div
          className="bg-white rounded-2xl border border-[#E4E4E4] overflow-hidden"
          style={{ boxShadow: "0 2px 8px rgba(71,11,0,0.06)" }}
        >
          {/* Pestañas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#F0F0F0] lg:flex lg:flex-col lg:gap-0 lg:bg-transparent">
            {SECCIONES.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setSeccion(s.id)}
                  className={`flex items-center justify-center lg:justify-start gap-2 px-3 py-3 text-sm transition-colors cursor-pointer text-center lg:text-left ${seccion === s.id
                    ? "bg-[#FFE8CC] text-[#000000]"
                    : "bg-white text-[#575757] hover:bg-[#F6F6F6] hover:text-[#000000]"
                    }`}
                >
                  <Icon size={16} className={`flex-shrink-0 ${seccion === s.id ? "text-[#FFAD60]" : "text-[#575757]"}`} />
                  <span className={seccion === s.id ? "font-semibold" : "font-medium"}>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Perfil */}
        {seccion === "perfil" && (
          <>
            <div className="bg-white rounded-2xl border border-[#E4E4E4] p-5 md:p-6" style={{ boxShadow: "0 2px 8px rgba(71,11,0,0.06)" }}>
              <h3 className="text-[#000000] mb-4">Información del Perfil</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#FFAD60]/30 flex-shrink-0">
                  <ImageWithFallback src={usuarioEjemplo} alt="Foto de perfil" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#000000]">Foto de perfil</p>
                  <p className="text-xs text-[#575757] mt-0.5">JPG, GIF o PNG. Máx. 800×800px</p>
                  <Button variant="link" size="sm" className="mt-2 p-0 h-auto font-semibold">
                    Cambiar foto
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#575757] mb-1">Nombre</label>
                  <InputConIcono icon={<IoPerson size={15} />}>
                    <input
                      value={form.nombre}
                      maxLength={LIMITES.PERSONA_NOMBRE.max}
                      onChange={(e) =>
                        actualizar({ nombre: limpiarNombrePersona(e.target.value, LIMITES.PERSONA_NOMBRE.max) })
                      }
                      className={INPUT_CLS}
                    />
                  </InputConIcono>
                  {errores.nombre && <p className="text-xs text-[#FF2244] mt-1">{errores.nombre}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#575757] mb-1">Apellido</label>
                  <InputConIcono icon={<IoPerson size={15} />}>
                    <input
                      value={form.apellido}
                      maxLength={LIMITES.PERSONA_NOMBRE.max}
                      onChange={(e) =>
                        actualizar({ apellido: limpiarNombrePersona(e.target.value, LIMITES.PERSONA_NOMBRE.max) })
                      }
                      className={INPUT_CLS}
                    />
                  </InputConIcono>
                  {errores.apellido && <p className="text-xs text-[#FF2244] mt-1">{errores.apellido}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#575757] mb-1">CUIT</label>
                  <InputConIcono icon={<IdCardIcon size={15} />}>
                    <input
                      value={form.cuit}
                      inputMode="numeric"
                      maxLength={LIMITES.CUIT.max}
                      placeholder="30-71234567-8"
                      onChange={(e) => actualizar({ cuit: formatCuit(e.target.value) })}
                      className={INPUT_CLS}
                    />
                  </InputConIcono>
                  {errores.cuit && <p className="text-xs text-[#FF2244] mt-1">{errores.cuit}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#575757] mb-1">Nombre del negocio</label>
                  <InputConIcono icon={<IoStorefront size={15} />}>
                    <input
                      value={form.negocio}
                      maxLength={LIMITES.NEGOCIO_NOMBRE.max}
                      onChange={(e) =>
                        actualizar({ negocio: limpiarTexto(e.target.value, LIMITES.NEGOCIO_NOMBRE.max) })
                      }
                      className={INPUT_CLS}
                    />
                  </InputConIcono>
                  {errores.negocio && <p className="text-xs text-[#FF2244] mt-1">{errores.negocio}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#575757] mb-1">Rubro</label>
                  <Dropdown
                    value={form.rubro}
                    options={rubros.map((r) => ({ value: r.nombre, label: r.nombre }))}
                    onSelect={(r) => actualizar({ rubro: r })}
                    placeholder="Elegí tu rubro"
                    leading={<IoPricetag size={15} className="text-[#888888] flex-shrink-0" />}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#575757] mb-1">Teléfono de contacto</label>
                  <InputConIcono icon={<IoCall size={15} />}>
                    <input
                      value={form.telefonoContacto}
                      inputMode="tel"
                      maxLength={LIMITES.TELEFONO.max}
                      onChange={(e) => actualizar({ telefonoContacto: limpiarTelefono(e.target.value) })}
                      className={INPUT_CLS}
                    />
                  </InputConIcono>
                  {errores.telefonoContacto && (
                    <p className="text-xs text-[#FF2244] mt-1">{errores.telefonoContacto}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#575757] mb-1">Cuenta creada el</label>
                  <div className={READONLY_CLS}>
                    <IoCalendar size={15} className="text-[#888888] flex-shrink-0" />
                    <span>{formatFechaLarga(usuario.fechaCreacionISO)}</span>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#575757] mb-1">Teléfono conectado a WhatsApp</label>
                  <div className="relative">
                    <div className="w-full text-sm border border-[#E4E4E4] rounded-xl pl-3 pr-9 py-2 bg-[#F0F0F0] text-[#575757] flex items-center gap-2 select-none">
                      <WhatsAppIcon size={16} className="text-[#25D366] flex-shrink-0" />
                      <span>{usuario.telefonoWhatsapp}</span>
                    </div>
                    <IoLockClosed
                      size={13}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]"
                      title="Para cambiarlo, escribí a soporte"
                    />
                  </div>
                  <p className="text-[11px] text-[#9A9A9A] mt-1">
                    Para cambiar este número, escribí a soporte.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Notificaciones */}
        {seccion === "notificaciones" && (
          <div className="bg-white rounded-2xl border border-[#E4E4E4] p-5 md:p-6" style={{ boxShadow: "0 2px 8px rgba(71,11,0,0.06)" }}>
            <h3 className="text-[#000000] mb-1">Notificaciones</h3>
            <p className="text-xs text-[#575757] mb-6">Elige qué notificaciones deseas recibir.</p>
            <div className="space-y-1">
              {/* Alertas */}
              {[
                { key: "stockBajo", label: "Alertas de stock bajo", desc: "Aviso cuando un producto alcanza el mínimo o se agota" },
                { key: "sinMovimiento", label: "Productos sin movimiento", desc: "Aviso cuando un producto lleva mucho tiempo sin ventas" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-[#E4E4E4] last:border-none gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#000000]">{item.label}</p>
                    <p className="text-xs text-[#575757]">{item.desc}</p>
                  </div>
                  <Toggle
                    checked={notifs[item.key as keyof typeof notifs]}
                    onChange={() =>
                      actualizar({
                        notificaciones: {
                          ...notifs,
                          [item.key]: !notifs[item.key as keyof typeof notifs],
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seguridad */}
        {seccion === "seguridad" && (
          <div className="bg-white rounded-2xl border border-[#E4E4E4] p-5 md:p-6" style={{ boxShadow: "0 2px 8px rgba(71,11,0,0.06)" }}>
            <h3 className="text-[#000000] mb-1">Seguridad</h3>
            <p className="text-xs text-[#575757] mb-6">Administra tu contraseña y accesos.</p>
            <div className="space-y-4">
              {[
                { label: "Contraseña actual", type: "password", placeholder: "••••••••" },
                { label: "Nueva contraseña", type: "password", placeholder: "••••••••" },
                { label: "Confirmar nueva contraseña", type: "password", placeholder: "••••••••" },
              ].map((f) => (
                <div key={f.label} className="max-w-sm">
                  <label className="block text-xs font-semibold text-[#575757] mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    maxLength={64}
                    placeholder={f.placeholder}
                    className="w-full text-sm border border-[#E4E4E4] rounded-xl px-3 py-2 bg-[#F6F6F6] text-[#000000] focus:outline-none focus:border-[#FFAD60] focus:ring-1 focus:ring-[#FFAD60]/20"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facturacion */}
        {seccion === "facturacion" && (
          <>
            <div className="bg-white rounded-2xl border border-[#E4E4E4] p-5 md:p-6" style={{ boxShadow: "0 2px 8px rgba(71,11,0,0.06)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#000000]">Plan Activo</h3>
                <span className="bg-gradient-to-r from-[#FFAD60] to-[#F5923E] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {usuario.plan.nombre}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Precio mensual", value: formatARS(usuario.plan.precioMensual), sub: "ARS/mes" },
                  { label: "Próximo cobro", value: usuario.plan.proximoCobro, sub: "" },
                  { label: "Estado", value: usuario.plan.estado, sub: "", dot: true },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#F6F6F6] rounded-xl p-4">
                    <p className="text-xs text-[#575757] mb-1">{stat.label}</p>
                    <div className="flex items-center gap-1.5">
                      {stat.dot && <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />}
                      <p className="text-base font-bold text-[#000000]">
                        {stat.value}
                        {stat.sub && <span className="text-xs font-medium text-[#575757] ml-1">{stat.sub}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="px-4 py-2">
                Ver todos los planes
              </Button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E4E4E4] p-5 md:p-6" style={{ boxShadow: "0 2px 8px rgba(71,11,0,0.06)" }}>
              <h3 className="text-[#000000] mb-4">Método de Pago</h3>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-[#E4E4E4] bg-[#F6F6F6]">
                <div className="w-12 h-8 bg-gradient-to-br from-[#FFAD60] to-[#F5923E] rounded-lg flex items-center justify-center flex-shrink-0">
                  <IoCard size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#000000] truncate">{usuario.metodoPago.tipo} terminada en {usuario.metodoPago.ultimos4}</p>
                  <p className="text-xs text-[#575757]">Vence {usuario.metodoPago.vence}</p>
                </div>
                <Button variant="secondary" size="sm" className="flex-shrink-0">Cambiar</Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E4E4E4] p-5 md:p-6" style={{ boxShadow: "0 2px 8px rgba(71,11,0,0.06)" }}>
              <h3 className="text-[#000000] mb-4">Historial de Facturación</h3>
              <div className="space-y-1">
                {usuario.facturas.map((inv) => (
                  <div key={inv.fecha} className="flex items-center justify-between py-3 border-b border-[#E4E4E4] last:border-none gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#000000] truncate">{inv.desc}</p>
                      <p className="text-xs text-[#575757]">{inv.fecha}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-semibold text-[#000000] hidden sm:inline">{inv.monto}</span>
                      <span className="text-xs bg-[#D9F5E9] text-[#2E7D52] font-medium px-2 py-0.5 rounded-full">{inv.estado}</span>
                      <Button
                        variant="tertiary"
                        size="icon"
                        className="w-7 h-7"
                        title="Descargar PDF"
                      >
                        <IoDownload size={13} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Botones de aplicar y cancelar */}
        <div className="flex justify-start gap-3">
          <Button
            variant="secondary"
            className="px-5"
            disabled={!dirty}
            onClick={() => setConfirmacion("cancelar")}
          >
            Cancelar
          </Button>
          <Button
            className="px-5"
            disabled={!dirty || !formValido}
            onClick={() => setConfirmacion("aplicar")}
            style={{ background: "linear-gradient(135deg, #FFAD60 0%, #F5923E 100%)", color: "white", border: "none" }}
          >
            Aplicar
          </Button>
        </div>

      </div>

      {/* Confirmar cambios */}
      {confirmacion === "aplicar" && (
        <ConfirmDialog
          title="Aplicar cambios"
          confirmLabel="Aplicar"
          cancelLabel="Cancelar"
          onCancel={() => setConfirmacion(null)}
          onConfirm={aplicar}
        >
          ¿Querés guardar los cambios que hiciste en la configuración?
        </ConfirmDialog>
      )}

      {/* Descartar cambios */}
      {confirmacion === "cancelar" && (
        <ConfirmDialog
          title="Descartar cambios"
          variant="destructive"
          confirmLabel="Descartar"
          cancelLabel="Seguir editando"
          onCancel={() => setConfirmacion(null)}
          onConfirm={descartar}
        >
          Se perderán los cambios que todavía no aplicaste. ¿Querés descartarlos?
        </ConfirmDialog>
      )}

      {/* Salir sin guardar */}
      {blocker.state === "blocked" && (
        <ConfirmDialog
          title="Cambios sin guardar"
          variant="destructive"
          confirmLabel="Salir sin guardar"
          cancelLabel="Seguir editando"
          onCancel={() => blocker.reset()}
          onConfirm={() => blocker.proceed()}
        >
          Tenés cambios sin guardar en la configuración. Si salís ahora, se perderán.
          ¿Querés salir igual?
        </ConfirmDialog>
      )}
    </div>
  );
}
