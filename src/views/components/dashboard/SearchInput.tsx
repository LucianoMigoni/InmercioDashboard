import { IoSearch } from "react-icons/io5";
import { cn } from "../ui/utils";
import { LIMITES, limpiarTexto } from "@/shared/validacion";

// Buscador con icono de lupa
export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  className,
  inputClassName,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <IoSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADADAD]" />
      <input
        value={value}
        maxLength={LIMITES.BUSQUEDA.max}
        onChange={(e) => onChange(limpiarTexto(e.target.value, LIMITES.BUSQUEDA.max))}
        placeholder={placeholder}
        className={cn(
          "pl-8 pr-4 py-2 text-sm border border-[#E4E4E4] rounded-xl bg-[#F6F6F6] text-[#000000] placeholder-[#ADADAD] focus:outline-none focus:border-[#FFAD60] w-40 sm:w-44",
          inputClassName
        )}
      />
    </div>
  );
}
