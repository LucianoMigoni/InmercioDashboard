import { IoChevronUp, IoChevronDown } from "react-icons/io5";

// Flecha para ordenar las columnas
export function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <IoChevronUp size={12} className="text-[#E4E4E4]" />;
  return dir === "asc" ? (
    <IoChevronUp size={12} className="text-[#FFAD60]" />
  ) : (
    <IoChevronDown size={12} className="text-[#FFAD60]" />
  );
}
