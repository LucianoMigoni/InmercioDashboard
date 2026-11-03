import type { CSSProperties, ReactNode } from "react";
import markColor from "@/visuals/assets/logos/inmercio-mark-color.png";
import { Button } from "../components/ui/button";
import {
  IoArrowForward,
  IoArrowBack,
  IoStorefront,
  IoScan,
  IoDocumentText,
  IoCube,
  IoNotifications,
  IoSend,
  IoSparkles,
  IoGrid,
  IoTime,
  IoWarning,
  IoChevronDown,
} from "react-icons/io5";
import { CheckIcon } from "../components/icons/CheckIcon";
import { IdCardIcon } from "../components/icons/IdCardIcon";
import "./onboarding.css";

// Iconos
export const I = {
  arrowRight: <IoArrowForward />,
  arrowLeft: <IoArrowBack />,
  check: <CheckIcon />,
  store: <IoStorefront />,
  card: <IdCardIcon />,
  whatsapp: <svg viewBox="0 0 512 512" style={{ fill: "currentColor", stroke: "none" }}><g transform="translate(0,512) scale(0.1,-0.1)" style={{ fill: "currentColor" }}><path d="M2315 5109 c-414 -42 -828 -190 -1165 -415 -148 -99 -240 -173 -374 -303 -218 -213 -377 -432 -512 -706 -127 -260 -203 -509 -246 -810 -16 -116 -16 -501 0 -625 53 -396 193 -776 402 -1092 l68 -101 -159 -470 c-88 -259 -158 -471 -156 -473 1 -2 221 66 487 151 267 85 488 155 492 155 4 0 35 -18 69 -40 87 -56 276 -151 394 -198 503 -200 1049 -235 1575 -102 180 45 311 94 495 185 281 138 495 294 711 518 195 201 334 398 458 648 444 891 327 1939 -303 2734 -101 127 -314 335 -442 431 -352 265 -758 435 -1194 500 -122 18 -477 26 -600 13z m-543 -1183 c13 -9 34 -33 45 -53 33 -59 283 -668 283 -689 0 -42 -53 -124 -139 -219 -102 -113 -125 -152 -116 -196 7 -33 98 -175 186 -291 168 -220 396 -413 639 -541 164 -87 231 -110 295 -105 70 6 80 15 212 192 57 77 116 148 131 158 31 21 84 23 133 7 65 -23 614 -291 637 -311 19 -19 22 -31 22 -103 0 -97 -37 -256 -74 -319 -82 -139 -274 -264 -474 -310 -186 -42 -392 -6 -757 134 -196 76 -277 113 -411 193 -205 122 -378 262 -584 473 -190 195 -327 367 -491 616 -305 464 -313 912 -22 1246 97 111 183 144 354 138 76 -2 113 -8 131 -20z" /></g></svg>,
  scan: <IoScan />,
  sheet: <IoDocumentText />,
  package: <IoCube />,
  bell: <IoNotifications />,
  send: <IoSend />,
  sparkles: <IoSparkles />,
  dashboard: <IoGrid />,
  clock: <IoTime />,
  alert: <IoWarning />,
  chev: <IoChevronDown />,
};

export { RUBROS } from "./rubros";

// Logo de la mascota
export function Mascot({ size = 64, glow = false }: { size?: number; glow?: boolean }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: size * 0.24, flexShrink: 0,
      background: "linear-gradient(to bottom right,#FFE8CC,#FFD898)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      boxShadow: glow ? "0 4px 18px rgba(71,11,0,.11)" : "var(--shadow-soft)",
      outline: "none",
    }}>
      <img src={markColor} alt="Inmercio"
        style={{ width: "70%", height: "70%", objectFit: "contain" }} />
    </span>
  );
}

// Boton principal del onboarding
export function PrimaryBtn({ children, onClick, disabled, loading, type = "button", full, style }: {
  children: ReactNode; onClick?: () => void; disabled?: boolean; loading?: boolean;
  type?: "button" | "submit"; full?: boolean; style?: CSSProperties;
}) {
  return (
    <Button type={type} size="lg" onClick={onClick} disabled={disabled || loading}
      className={full ? "w-full" : ""} style={style}>
      {loading ? <span className="ob-spin"></span> : null}
      {children}
    </Button>
  );
}

// Tarjeta de opcion
export function OptionCard({ icon, title, desc, selected, onClick, badge }: {
  icon?: ReactNode; title: ReactNode; desc?: ReactNode; selected: boolean; onClick: () => void; badge?: ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className={`ob-opt ${selected ? "sel" : ""}`}>
      {icon ? <span className="ob-opt-ic">{icon}</span> : null}
      <span className="ob-opt-body">
        <span className="ob-opt-title">{title}{badge ? <span className="ob-opt-badge">{badge}</span> : null}</span>
        {desc ? <span className="ob-opt-desc">{desc}</span> : null}
      </span>
      <span className="ob-opt-radio">{selected ? I.check : null}</span>
    </button>
  );
}

export interface StepNav {
  stepIndex: number;
  stepCount: number;
  next: () => void;
  back: () => void;
  skip: () => void;
  goStep: (i: number) => void;
}

// Estructura de cada paso con sus botones
export function StepFrame({
  eyebrow, title, sub, children,
  stepIndex, stepCount,
  onBack, onContinue, continueLabel = "Continuar",
  continueDisabled, continueLoading, continueIcon = true,
  showBack = true, showSkip = true, onSkip,
  maxWidth = 620,
}: {
  eyebrow?: ReactNode; title?: ReactNode; sub?: ReactNode; children: ReactNode;
  stepIndex: number; stepCount: number;
  onBack?: () => void; onContinue?: (() => void) | null; continueLabel?: ReactNode;
  continueDisabled?: boolean; continueLoading?: boolean; continueIcon?: boolean;
  showBack?: boolean; showSkip?: boolean; onSkip?: (() => void) | null;
  maxWidth?: number;
}) {
  return (
    <div className="ob-content">
      <div className="ob-scroll">
        <div className="ob-inner" style={{ maxWidth }}>
          <div className="ob-head">
            {eyebrow ? <div className="ob-eyebrow">{eyebrow}</div> : null}
            {title ? <h1 className="ob-title">{title}</h1> : null}
            {sub ? <p className="ob-sub">{sub}</p> : null}
          </div>
          {children}
        </div>
      </div>
      <footer className="ob-footer">
        <div className="ob-footer-left">
          {showBack && onBack ? (
            <Button type="button" variant="tertiary" onClick={onBack}>{I.arrowLeft}<span>Volver</span></Button>
          ) : <span></span>}
        </div>
        <div className="ob-footer-center">Paso {stepIndex + 1} de {stepCount}</div>
        <div className="ob-footer-right">
          {showSkip && onSkip ? (
            <Button type="button" variant="link" onClick={onSkip} className="text-[#ADADAD] hover:text-[#575757]">
              Saltar por ahora
            </Button>
          ) : null}
          {onContinue ? (
            <PrimaryBtn onClick={onContinue} disabled={continueDisabled} loading={continueLoading}>
              {continueLabel}{continueIcon && !continueLoading ? I.arrowRight : null}
            </PrimaryBtn>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
