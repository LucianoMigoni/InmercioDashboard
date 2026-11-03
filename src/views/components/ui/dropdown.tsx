import { useState, type ReactNode } from "react";
import { IoChevronDown, IoCheckmark } from "react-icons/io5";
import { cn } from "./utils";

export function Dropdown({
  value,
  options,
  onSelect,
  placeholder = "No asignado",
  leading,
  className,
}: {
  value: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  placeholder?: string;
  leading?: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const seleccionada = options.find((o) => o.value === value);
  const tieneValor = !!seleccionada && value !== "-";

  return (
    <div className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center justify-between gap-2 text-sm border rounded-xl px-3 py-2.5 bg-[#F6F6F6] transition-colors cursor-pointer",
          open ? "border-[#FFAD60] ring-1 ring-[#FFAD60]/20" : "border-[#E4E4E4]",
          tieneValor ? "text-[#000000]" : "text-[#9A9A9A]",
          className
        )}
      >
        <span className="flex items-center gap-2 min-w-0">
          {leading}
          <span className="truncate">{seleccionada ? seleccionada.label : placeholder}</span>
        </span>
        <IoChevronDown
          size={15}
          className={`text-[#575757] flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute z-20 left-0 right-0 mt-1 bg-white border border-[#E4E4E4] rounded-xl overflow-hidden max-h-56 overflow-y-auto"
            style={{ boxShadow: "0 8px 24px rgba(71,11,0,0.12)" }}
          >
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onSelect(o.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 text-left text-sm px-3 py-2 transition-colors cursor-pointer ${value === o.value
                    ? "bg-[#FFE8CC] text-[#000000] font-semibold"
                    : "text-[#575757] hover:bg-[#F6F6F6] hover:text-[#000000]"
                  }`}
              >
                <span className="truncate">{o.label}</span>
                {value === o.value && <IoCheckmark size={16} className="text-[#FFAD60] flex-shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
