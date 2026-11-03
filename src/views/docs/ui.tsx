// Componentes basicos del centro de ayuda
import type { CSSProperties, ElementType, ReactNode } from "react";
import { Button, type ButtonProps } from "../components/ui/button";
import {
  IoArrowForward,
  IoChevronDown,
  IoChevronForward,
  IoHelpCircle,
  IoCompass,
  IoHome,
  IoMail,
  IoSearch,
  IoSparkles,
  IoClose,
  IoRocket,
  IoGrid,
  IoSettings,
  IoCard,
} from "react-icons/io5";
import "./docs.css";

// Iconos por nombre
const ICONS: Record<string, ElementType> = {
  "arrow-right": IoArrowForward,
  "chevron-down": IoChevronDown,
  "chevron-right": IoChevronForward,
  "circle-help": IoHelpCircle,
  compass: IoCompass,
  home: IoHome,
  mail: IoMail,
  search: IoSearch,
  "search-x": IoSearch,
  sparkles: IoSparkles,
  x: IoClose,
  rocket: IoRocket,
  "layout-dashboard": IoGrid,
  settings: IoSettings,
  "credit-card": IoCard,
};

// Icono de WhatsApp
const WHATSAPP_PATHS = [
  "M2315 5109 c-414 -42 -828 -190 -1165 -415 -148 -99 -240 -173 -374 -303 -218 -213 -377 -432 -512 -706 -127 -260 -203 -509 -246 -810 -16 -116 -16 -501 0 -625 53 -396 193 -776 402 -1092 l68 -101 -159 -470 c-88 -259 -158 -471 -156 -473 1 -2 221 66 487 151 267 85 488 155 492 155 4 0 35 -18 69 -40 87 -56 276 -151 394 -198 503 -200 1049 -235 1575 -102 180 45 311 94 495 185 281 138 495 294 711 518 195 201 334 398 458 648 444 891 327 1939 -303 2734 -101 127 -314 335 -442 431 -352 265 -758 435 -1194 500 -122 18 -477 26 -600 13z m-543 -1183 c13 -9 34 -33 45 -53 33 -59 283 -668 283 -689 0 -42 -53 -124 -139 -219 -102 -113 -125 -152 -116 -196 7 -33 98 -175 186 -291 168 -220 396 -413 639 -541 164 -87 231 -110 295 -105 70 6 80 15 212 192 57 77 116 148 131 158 31 21 84 23 133 7 65 -23 614 -291 637 -311 19 -19 22 -31 22 -103 0 -97 -37 -256 -74 -319 -82 -139 -274 -264 -474 -310 -186 -42 -392 -6 -757 134 -196 76 -277 113 -411 193 -205 122 -378 262 -584 473 -190 195 -327 367 -491 616 -305 464 -313 912 -22 1246 97 111 183 144 354 138 76 -2 113 -8 131 -20z",
];

export function Icon({ name, size = 16, className = "", style = {} }: {
  name: string; size?: number; className?: string; style?: CSSProperties;
}) {
  if (name === "whatsapp") {
    return (
      <span className={"ic " + className} style={{ width: size, height: size, display: "inline-flex", flexShrink: 0, ...style }}>
        <svg viewBox="0 0 512 512" fill="currentColor" stroke="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0,512) scale(0.1,-0.1)">
            {WHATSAPP_PATHS.map((d, i) => <path key={i} d={d} />)}
          </g>
        </svg>
      </span>
    );
  }
  const Glyph = ICONS[name];
  return (
    <span
      className={"ic " + className}
      style={{ width: size, height: size, display: "inline-flex", flexShrink: 0, ...style }}
    >
      {Glyph ? <Glyph size={size} /> : null}
    </span>
  );
}

// Boton del centro de ayuda que usa el boton general
const VARIANTE: Record<string, ButtonProps["variant"]> = {
  primary: "primary",
  secondary: "secondary",
  outline: "secondary",
  ghost: "tertiary",
  white: "tertiary",
};

const TAMANO: Record<string, ButtonProps["size"]> = { sm: "sm", md: "default", lg: "lg" };

export function Btn({ variant = "primary", size = "md", children, className = "", style = {}, ...rest }: {
  variant?: keyof typeof VARIANTE; size?: "sm" | "md" | "lg"; children: ReactNode;
  className?: string; style?: CSSProperties;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button variant={VARIANTE[variant]} size={TAMANO[size]} className={className} style={style} {...rest}>
      {children}
    </Button>
  );
}

export function Card({ children, className = "", style = {}, pad = 20, hover = false, onClick }: {
  children: ReactNode; className?: string; style?: CSSProperties; pad?: number; hover?: boolean; onClick?: () => void;
}) {
  return (
    <div
      className={(hover ? "card-hover " : "") + className}
      onClick={onClick}
      style={{
        background: "#fff", borderRadius: 16, padding: pad, border: "1px solid var(--border)",
        boxShadow: "0 1px 6px rgba(71,11,0,.035)", ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Pill({ children, bg, color, style = {} }: {
  children: ReactNode; bg?: string; color?: string; style?: CSSProperties;
}) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, background: bg, color,
      fontWeight: 600, fontSize: 12, fontFamily: "var(--font-ui)", padding: "4px 10px",
      borderRadius: 999, whiteSpace: "nowrap", ...style,
    }}>{children}</span>
  );
}

// Etiqueta de seccion
export function Eyebrow({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p style={{
      font: "700 11px/1 var(--font-ui)", textTransform: "uppercase",
      letterSpacing: ".12em", color: "var(--ink-500)", ...style,
    }}>{children}</p>
  );
}

export { default as LOGO_MARK } from "@/visuals/assets/logos/inmercio-mark-color.png";
export { default as LOGO_LOCKUP } from "@/visuals/assets/logos/inmercio-logo-color.png";
