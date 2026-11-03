import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

// Ventana flotante del dashboard
export function Modal({
  title,
  onClose,
  children,
  footer,
  maxWidth = "max-w-md",
  scroll = false,
  notifyOverlay = false,
}: {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  scroll?: boolean;
  notifyOverlay?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  // Animacion de entrada
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Se cierra con Escape y bloquea el scroll de fondo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (notifyOverlay) window.dispatchEvent(new Event("dashboard-overlay-open"));
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (notifyOverlay) window.dispatchEvent(new Event("dashboard-overlay-close"));
    };
  }, [onClose, notifyOverlay]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
        backgroundColor: "rgba(0,0,0,0.25)",
      }}
    >
      <div
        className={`bg-white w-full ${maxWidth} rounded-2xl ${
          scroll ? "max-h-[92vh] overflow-y-auto overflow-x-hidden" : "overflow-hidden"
        }`}
        style={{
          boxShadow: "0 4px 16px rgba(71,11,0,0.08)",
          transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease",
        }}
      >
        {/* Titulo y boton de cerrar */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
          <p className="text-[#FFAD60] font-bold text-base leading-tight">{title}</p>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 -mr-1 -mt-1 rounded-xl flex items-center justify-center text-[#888888] hover:bg-[#F6F6F6] hover:text-[#000000] transition-colors flex-shrink-0 cursor-pointer"
          >
            <IoClose size={18} />
          </button>
        </div>

        {children}

        {footer && (
          <div className="flex items-center gap-3 px-5 py-4 border-t border-[#E4E4E4]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
