import type { ReactNode } from "react";
import lockupWhite from "@/visuals/assets/logos/inmercio-lockup-white.png";
import {
  IoPerson,
  IoMail,
  IoMailOpen,
  IoCall,
  IoLockClosed,
  IoEye,
  IoEyeOff,
  IoArrowForward,
  IoArrowBack,
  IoChevronDown,
  IoAlertCircle,
  IoDocumentText,
  IoCard,
  IoFlash,
} from "react-icons/io5";
import { CheckIcon } from "../components/icons/CheckIcon";
import "./auth.css";

// Iconos
export const I = {
  user: <IoPerson />,
  mail: <IoMail />,
  mailCheck: <IoMailOpen />,
  phone: <IoCall />,
  lock: <IoLockClosed />,
  eye: <IoEye />,
  eyeOff: <IoEyeOff />,
  check: <CheckIcon />,
  arrow: <IoArrowForward />,
  arrowLeft: <IoArrowBack />,
  chev: <IoChevronDown />,
  alert: <IoAlertCircle />,
  fileX: <IoDocumentText />,
  card: <IoCard />,
  zap: <IoFlash />,
};

export const GoogleIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.83Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
  </svg>
);

export const AppleIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="#000">
    <path d="M17.05 12.04c-.03-2.83 2.31-4.19 2.42-4.26-1.32-1.94-3.38-2.2-4.11-2.23-1.75-.18-3.42 1.03-4.31 1.03-.9 0-2.27-1-3.73-.98-1.92.03-3.69 1.12-4.68 2.83-2 3.47-.51 8.6 1.44 11.43.95 1.39 2.08 2.94 3.55 2.88 1.43-.06 1.97-.92 3.7-.92 1.71 0 2.21.92 3.71.89 1.53-.03 2.5-1.4 3.44-2.8 1.08-1.6 1.53-3.15 1.56-3.23-.03-.01-2.99-1.15-3.02-4.57Zm-2.81-8.4c.79-.96 1.32-2.29 1.18-3.62-1.13.05-2.51.76-3.32 1.71-.73.85-1.36 2.2-1.19 3.5 1.26.1 2.54-.64 3.33-1.59Z" />
  </svg>
);

// Validaciones
export function scorePassword(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, Math.max(0, s - 1));
}
export const STRENGTH_LABEL = ["", "Débil", "Aceptable", "Buena", "Excelente"];

export function isEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
export function isPhone(v: string) { return /^[\d\s\-]{8,}$/.test(v.trim()); }

// Componentes compartidos
export function Field({ icon, error, hint, children, valid }: {
  icon?: ReactNode; error?: ReactNode; hint?: ReactNode; children: ReactNode; valid?: boolean;
}) {
  return (
    <div className="field">
      <div className="input-wrap">
        {icon && <span className="lead-ic">{icon}</span>}
        {children}
        {valid && <span className="check-ic show">{I.check}</span>}
      </div>
      {error ? (
        <div className="err">{I.alert}<span>{error}</span></div>
      ) : hint ? (
        <div className="hint">{hint}</div>
      ) : null}
    </div>
  );
}

export function Label({ children, optional }: { children: ReactNode; optional?: boolean }) {
  return (
    <div className="label">
      <span>{children}</span>
      {optional && <span className="opt">Opcional</span>}
    </div>
  );
}

// Panel izquierdo con la marca
export function BrandPanel({ subtitle, showPills }: { subtitle: string; showPills?: boolean }) {
  return (
    <aside className="brand-panel">
      <div className="rings"><span></span><span></span><span></span><span></span><span></span><span></span></div>

      <div className="brand-logo">
        <img src={lockupWhite} alt="Inmercio" />
      </div>

      <div className="brand-content">
        <h2 className="brand-title">Gestiona tu stock desde Whatsapp</h2>
        <p className="brand-subtitle">{subtitle}</p>
      </div>

      {showPills && (
        <div className="brand-bottom">
          <div className="brand-pills">
            <span className="pill">{I.fileX}Sin planillas</span>
            <span className="pill">{I.card}Sin tarjeta</span>
            <span className="pill">{I.zap}Setup en 1 minuto</span>
          </div>
        </div>
      )}
    </aside>
  );
}

// Medidor de seguridad de la contraseña
export function PasswordMeter({ password, style }: { password: string; style?: React.CSSProperties }) {
  const pwScore = scorePassword(password);
  const rules = {
    len: password.length >= 8,
    mix: /[A-Z]/.test(password) && /[a-z]/.test(password),
    num: /\d/.test(password),
    sym: /[^A-Za-z0-9]/.test(password),
  };
  return (
    <div className="pw-meter" style={style}>
      <div className={`pw-bars s${pwScore}`}>
        <div className="pw-bar"></div>
        <div className="pw-bar"></div>
        <div className="pw-bar"></div>
        <div className="pw-bar"></div>
      </div>
      <div className="pw-label">
        <span className="lbl">Fuerza de la contraseña</span>
        <span className={`val s${pwScore}`}>{STRENGTH_LABEL[pwScore] || "—"}</span>
      </div>
      <div className="pw-rules">
        <div className={`pw-rule ${rules.len ? "ok" : ""}`}><span className="rdot">{I.check}</span>8+ caracteres</div>
        <div className={`pw-rule ${rules.mix ? "ok" : ""}`}><span className="rdot">{I.check}</span>Mayús. y minús.</div>
        <div className={`pw-rule ${rules.num ? "ok" : ""}`}><span className="rdot">{I.check}</span>Un número</div>
        <div className={`pw-rule ${rules.sym ? "ok" : ""}`}><span className="rdot">{I.check}</span>Un símbolo</div>
      </div>
    </div>
  );
}
