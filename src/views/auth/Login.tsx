import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AppleIcon, BrandPanel, Field, GoogleIcon, I, isEmail, Label } from "./shared";
import { Button } from "../components/ui/button";
import { OverlayScrollbar } from "../components/OverlayScrollbar";

// Intentos permitidos y segundos de bloqueo
const MAX_ATTEMPTS = 5;
const LOCK_SECONDS = 30;

// Pantalla de inicio de sesion
export function Login() {
  const navigate = useNavigate();
  const [f, setF] = useState({ email: "", password: "", remember: true });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [authError, setAuthError] = useState("");
  const [fails, setFails] = useState(0);
  // Segundos que faltan para desbloquear
  const [lockLeft, setLockLeft] = useState(0);
  const [connecting, setConnecting] = useState<"google" | "apple" | null>(null);
  const connectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const locked = lockLeft > 0;

  // Cuenta regresiva del bloqueo
  useEffect(() => {
    if (lockLeft <= 0) return;
    const t = setInterval(() => {
      setLockLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setFails(0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [lockLeft]);

  // Limpia el temporizador al salir
  useEffect(() => () => { if (connectTimer.current) clearTimeout(connectTimer.current); }, []);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setF((s) => ({ ...s, [k]: v }));
    if (authError) setAuthError("");
  };
  const blur = (k: string) => () => setTouched((s) => ({ ...s, [k]: true }));

  const onProvider = (p: "google" | "apple") => () => {
    if (connecting || locked || submitting) return;
    setConnecting(p);
    // Por ahora Google y Apple solo simulan la conexion
    connectTimer.current = setTimeout(() => setConnecting(null), 2200);
  };

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!f.email.trim()) e.email = "Ingresá tu email";
    else if (!isEmail(f.email)) e.email = "Email inválido";
    if (!f.password) e.password = "Ingresá tu contraseña";
    return e;
  }, [f]);

  // Los errores se muestran al intentar enviar
  const showErr = (k: string) => attempted && errors[k];
  const validField = (k: "email" | "password") => touched[k] && !errors[k] && f[k];

  const canSubmit = Object.keys(errors).length === 0 && !submitting && !locked;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    // El formulario tiene que estar completo para avanzar
    if (!canSubmit) return;
    // Por ahora entra directo al dashboard
    navigate("/cargando", { state: { to: "/dashboard" } });
  };

  return (
    <div className="auth-page no-nav">
      <OverlayScrollbar />
      <div className="page">
        <BrandPanel subtitle="Volvé a tu panel y seguí gestionando tu stock, ventas y reposición con tu asistente de IA." />

        <main className="form-panel">
          <div className="form-wrap">
            <div className="form-eyebrow">Iniciar sesión</div>
            <h1 className="form-title">Bienvenido de nuevo</h1>
            <p className="form-sub">Ingresá a tu cuenta para seguir gestionando tu stock.</p>

            <form onSubmit={onSubmit} noValidate>
              {locked && (
                <div className="auth-error auth-locked" role="alert">
                  {I.lock}
                  <div>
                    <strong>Cuenta bloqueada temporalmente</strong>
                    <span>
                      Superaste los {MAX_ATTEMPTS} intentos permitidos. Por seguridad, esperá{" "}
                      <b>{lockLeft}s</b> antes de volver a intentar, o restablecé tu contraseña.
                    </span>
                  </div>
                </div>
              )}

              {authError && !locked && (
                <div className="auth-error">
                  {I.alert}
                  <span>{authError}</span>
                </div>
              )}

              <Label>Email</Label>
              <Field icon={I.mail} error={showErr("email")} valid={!!validField("email")}>
                <input
                  className={`input ${showErr("email") ? "error" : ""} ${validField("email") ? "valid has-trail" : ""}`}
                  type="email" placeholder="tumail@email.com" value={f.email}
                  onChange={set("email")} onBlur={blur("email")} autoComplete="email"
                  disabled={locked}
                />
              </Field>

              <div className="label">
                <span>Contraseña</span>
                <Link className="forgot" to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
              </div>
              <div className="field">
                <div className="input-wrap">
                  <span className="lead-ic">{I.lock}</span>
                  <input
                    className={`input has-trail ${showErr("password") ? "error" : ""}`}
                    type={showPw ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={f.password}
                    onChange={set("password")}
                    onBlur={blur("password")}
                    autoComplete="current-password"
                    disabled={locked}
                  />
                  <button type="button" className="trail-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1} aria-label="Mostrar contraseña">
                    {showPw ? I.eyeOff : I.eye}
                  </button>
                </div>
                {showErr("password") && <div className="err">{I.alert}<span>{errors.password}</span></div>}
              </div>

              <label className={`terms remember ${f.remember ? "checked" : ""}`}>
                <input type="checkbox" checked={f.remember} onChange={set("remember")} />
                <span className="box">{I.check}</span>
                <span className="label-text">Mantener mi sesión iniciada en este dispositivo</span>
              </label>

              <Button type="submit" size="lg" className="w-full" disabled={submitting || locked}>
                {submitting ? (
                  <><span className="spin"></span>Iniciando sesión…</>
                ) : locked ? (
                  <>Cuenta bloqueada · {lockLeft}s</>
                ) : (
                  <>Iniciar sesión {I.arrow}</>
                )}
              </Button>

              <div className="divider">
                <span className="line"></span>
                <span className="txt">O continuá con</span>
                <span className="line"></span>
              </div>

              <div className="alt-btns">
                <Button
                  type="button"
                  variant="tertiary"
                  className={`h-11 ${connecting === "google" ? "connecting" : ""}`}
                  onClick={onProvider("google")}
                  disabled={!!connecting || locked}
                >
                  {connecting === "google"
                    ? <><span className="alt-spin"></span>Conectando…</>
                    : <>{GoogleIcon}Google</>}
                </Button>
                <Button
                  type="button"
                  variant="tertiary"
                  className={`h-11 ${connecting === "apple" ? "connecting" : ""}`}
                  onClick={onProvider("apple")}
                  disabled={!!connecting || locked}
                >
                  {connecting === "apple"
                    ? <><span className="alt-spin"></span>Conectando…</>
                    : <>{AppleIcon}Apple</>}
                </Button>
              </div>

              <div className="form-foot">
                ¿Todavía no tenés cuenta? <Link to="/registro">Crear cuenta</Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
