import { useState } from "react";
import { IoNotifications, IoWarning, IoCalendar, IoNotificationsOff } from "react-icons/io5";
import { CheckIcon } from "../components/icons/CheckIcon";
import { Button } from "../components/ui/button";
import { useDismissable } from "../components/dashboard";
import { generarNotificaciones } from "@/controllers";
import { formatFechaCorta } from "@/shared/format";

import { useDatabase } from "@/models";

export function Notificaciones() {
  const state = useDatabase();

  const [open, setOpen] = useState(false);

  const [leidas, setLeidas] = useState<Set<string>>(new Set());

  // Cierra el panel al hacer clic afuera
  const ref = useDismissable<HTMLDivElement>(open, () => setOpen(false));

  const notifs = generarNotificaciones(state);
  const noLeidas = notifs.filter((n) => !leidas.has(n.id)).length;

  function marcarTodas() {
    setLeidas(new Set(notifs.map((n) => n.id)));
  }

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      {/* Boton de la campana */}
      <Button
        variant="tertiary"
        size="icon"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notificaciones"
        className="relative rounded-xl bg-white"
      >
        <IoNotifications size={16} />
        {noLeidas > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF2244] text-white text-[10px] font-bold flex items-center justify-center">
            {noLeidas > 9 ? "9+" : noLeidas}
          </span>
        )}
      </Button>

      {/* Panel desplegable */}
      {open && (
        <div
          className="fixed right-3 top-16 sm:absolute sm:right-0 sm:top-full sm:mt-2 w-[calc(100vw-1.5rem)] max-w-[340px] sm:w-[340px] max-h-[min(420px,70vh)] flex flex-col bg-white rounded-2xl border border-[#E4E4E4] overflow-hidden z-50"
          style={{ boxShadow: "0 10px 40px rgba(71,11,0,0.12)" }}
        >
          {/* Encabezado */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E4E4E4]">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-[#000000]">Notificaciones</p>
              {noLeidas > 0 && (
                <span className="text-[10px] font-bold text-[#FFAD60] bg-[#FFE8CC] px-1.5 py-0.5 rounded-full">
                  {noLeidas} nueva{noLeidas > 1 ? "s" : ""}
                </span>
              )}
            </div>
            {notifs.length > 0 && noLeidas > 0 && (
              <Button
                variant="link"
                size="sm"
                onClick={marcarTodas}
                className="h-auto p-0 gap-1 font-medium text-[#575757] hover:text-[#F5923E] hover:no-underline"
              >
                <CheckIcon size={13} />
                Marcar leídas
              </Button>
            )}
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-2 text-center px-4">
                <div className="w-11 h-11 rounded-2xl bg-[#F6F6F6] flex items-center justify-center">
                  <IoNotificationsOff size={20} className="text-[#ADADAD]" />
                </div>
                <p className="text-sm font-medium text-[#575757]">Sin notificaciones</p>
                <p className="text-xs text-[#ADADAD]">
                  Las alertas de stock aparecerán aquí. Podés activarlas en Configuración.
                </p>
              </div>
            ) : (
              notifs.map((n) => {
                const leida = leidas.has(n.id);
                const esAlerta = n.nivel === "alerta";
                return (
                  <button
                    key={n.id}
                    onClick={() =>
                      setLeidas((prev) => new Set(prev).add(n.id))
                    }
                    className={`w-full text-left flex gap-3 px-4 py-3 border-b border-[#F0F0F0] last:border-none transition-colors hover:bg-[#F6F6F6] cursor-pointer ${leida ? "opacity-60" : ""
                      }`}
                  >
                    {/* Icono */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${esAlerta ? "bg-[#FFE5E9]" : "bg-[#FFE8CC]"
                        }`}
                    >
                      {esAlerta ? (
                        <IoWarning size={16} className="text-[#FF2244]" />
                      ) : (
                        <IoCalendar size={16} className="text-[#F5923E]" />
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <p className="text-sm font-semibold text-[#000000] leading-snug flex-1 break-words">
                          {n.titulo}
                        </p>
                        {!leida && (
                          <span className="mt-1 w-2 h-2 rounded-full bg-[#FFAD60] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#575757] mt-0.5 leading-relaxed break-words">
                        {n.mensaje}
                      </p>
                      <p className="text-[11px] text-[#ADADAD] mt-1">
                        {formatFechaCorta(n.fechaISO)} · {n.hora}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
