import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AppleIcon, BrandPanel, Field, GoogleIcon, I, isEmail, isPhone, Label, PasswordMeter } from "./shared";
import { Button } from "../components/ui/button";
import { OverlayScrollbar } from "../components/OverlayScrollbar";

// Pantalla para crear una cuenta
export function Registro() {
  const navigate = useNavigate();
  const [f, setF] = useState({
    nombre: "", apellido: "", email: "",
    telefono: "", password: "", confirm: "", terms: false,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [connecting, setConnecting] = useState<"google" | "apple" | null>(null);
  const connectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Limpia el temporizador al salir
  useEffect(() => () => { if (connectTimer.current) clearTimeout(connectTimer.current); }, []);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setF((s) => ({ ...s, [k]: v }));
  };
  const blur = (k: string) => () => setTouched((s) => ({ ...s, [k]: true }));

  const onProvider = (p: "google" | "apple") => () => {
    if (connecting || submitting) return;
    setConnecting(p);
    // Por ahora Google y Apple solo simulan la conexion
    connectTimer.current = setTimeout(() => setConnecting(null), 2200);
  };

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!f.nombre.trim()) e.nombre = "Ingresá tu nombre";
    if (!f.apellido.trim()) e.apellido = "Ingresá tu apellido";
    if (!f.email.trim()) e.email = "Ingresá tu email";
    else if (!isEmail(f.email)) e.email = "Email inválido";
    if (!f.telefono.trim()) e.telefono = "Ingresá tu teléfono";
    else if (!isPhone(f.telefono)) e.telefono = "Teléfono inválido";
    if (!f.password) e.password = "Creá una contraseña";
    else if (f.password.length < 8) e.password = "Mínimo 8 caracteres";
    if (!f.confirm) e.confirm = "Confirmá tu contraseña";
    else if (f.confirm !== f.password) e.confirm = "Las contraseñas no coinciden";
    if (!f.terms) e.terms = "Debés aceptar los términos";
    return e;
  }, [f]);

  // Los errores se muestran al intentar enviar
  const showErr = (k: string) => attempted && errors[k];
  const validField = (k: "nombre" | "apellido" | "email" | "telefono" | "confirm") =>
    touched[k] && !errors[k] && f[k];

  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (!canSubmit) return;
    // Si esta todo bien pasamos al onboarding
    navigate("/cargando", { state: { to: "/onboarding" } });
  };

  return (
    <div className="auth-page no-nav">
      <OverlayScrollbar />
      <div className="page">
        <BrandPanel showPills subtitle="Sumate a Inmercio y empezá a gestionar tu stock, ventas y reposición con un asistente de IA que te habla en tu idioma." />

        <main className="form-panel">
          <div className="form-wrap">
            <div className="form-eyebrow">Crear cuenta</div>
            <h1 className="form-title">Empezá a gestionar tu stock</h1>
            <p className="form-sub">Completá tus datos. Lleva menos de un minuto y no necesitás tarjeta.</p>

            <form onSubmit={onSubmit} noValidate>
              {/* Nombre y apellido */}
              <div className="row">
                <div>
                  <Label>Nombre</Label>
                  <Field icon={I.user} error={showErr("nombre")} valid={!!validField("nombre")}>
                    <input
                      className={`input ${showErr("nombre") ? "error" : ""} ${validField("nombre") ? "valid has-trail" : ""}`}
                      type="text" placeholder="Nombre" value={f.nombre}
                      onChange={set("nombre")} onBlur={blur("nombre")}
                    />
                  </Field>
                </div>
                <div>
                  <Label>Apellido</Label>
                  <Field icon={I.user} error={showErr("apellido")} valid={!!validField("apellido")}>
                    <input
                      className={`input ${showErr("apellido") ? "error" : ""} ${validField("apellido") ? "valid has-trail" : ""}`}
                      type="text" placeholder="Apellido" value={f.apellido}
                      onChange={set("apellido")} onBlur={blur("apellido")}
                    />
                  </Field>
                </div>
              </div>

              {/* Email */}
              <Label>Email</Label>
              <Field icon={I.mail} error={showErr("email")} valid={!!validField("email")}>
                <input
                  className={`input ${showErr("email") ? "error" : ""} ${validField("email") ? "valid has-trail" : ""}`}
                  type="email" placeholder="tumail@email.com" value={f.email}
                  onChange={set("email")} onBlur={blur("email")} autoComplete="email"
                />
              </Field>

              {/* Teléfono */}
              <Label>Número de teléfono</Label>
              <div className="field">
                <div className="phone-row">
                  <div className="phone-prefix"><span className="flag"></span>+54</div>
                  <div className="input-wrap" style={{ flex: 1 }}>
                    <span className="lead-ic">{I.phone}</span>
                    <input
                      className={`input ${showErr("telefono") ? "error" : ""} ${validField("telefono") ? "valid has-trail" : ""}`}
                      type="tel" placeholder="11 5555 0123" value={f.telefono}
                      onChange={set("telefono")} onBlur={blur("telefono")} autoComplete="tel"
                    />
                    {validField("telefono") && <span className="check-ic show">{I.check}</span>}
                  </div>
                </div>
                {showErr("telefono") && <div className="err">{I.alert}<span>{errors.telefono}</span></div>}
              </div>

              {/* Contraseñas */}
              <div className="row">
                <div>
                  <Label>Contraseña</Label>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <div className="input-wrap">
                      <span className="lead-ic">{I.lock}</span>
                      <input
                        className={`input has-trail ${showErr("password") ? "error" : ""}`}
                        type={showPw ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        value={f.password}
                        onChange={set("password")}
                        onBlur={blur("password")}
                        autoComplete="new-password"
                      />
                      <button type="button" className="trail-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1} aria-label="Mostrar contraseña">
                        {showPw ? I.eyeOff : I.eye}
                      </button>
                    </div>
                    {showErr("password") && <div className="err">{I.alert}<span>{errors.password}</span></div>}
                  </div>
                </div>
                <div>
                  <Label>Confirmar contraseña</Label>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <div className="input-wrap">
                      <span className="lead-ic">{I.lock}</span>
                      <input
                        className={`input has-trail ${showErr("confirm") ? "error" : ""} ${validField("confirm") && f.confirm === f.password ? "valid" : ""}`}
                        type={showPw2 ? "text" : "password"}
                        placeholder="Repetí la contraseña"
                        value={f.confirm}
                        onChange={set("confirm")}
                        onBlur={blur("confirm")}
                        autoComplete="new-password"
                      />
                      <button type="button" className="trail-btn" onClick={() => setShowPw2(!showPw2)} tabIndex={-1} aria-label="Mostrar contraseña">
                        {showPw2 ? I.eyeOff : I.eye}
                      </button>
                    </div>
                    {showErr("confirm") && <div className="err">{I.alert}<span>{errors.confirm}</span></div>}
                  </div>
                </div>
              </div>

              {f.password && <PasswordMeter password={f.password} style={{ marginTop: 12, marginBottom: 14 }} />}

              {/* Términos */}
              <label className={`terms ${f.terms ? "checked" : ""} ${attempted && !f.terms ? "error" : ""}`}>
                <input type="checkbox" checked={f.terms} onChange={set("terms")} />
                <span className="box">{I.check}</span>
                <span className="label-text">
                  Acepto los <a href="https://inmercio.app/terminos" target="_blank">Términos y Condiciones</a> y la <a href="https://inmercio.app/privacidad" target="_blank">Política de Privacidad</a> de Inmercio.
                </span>
              </label>
              {attempted && !f.terms && (
                <div className="err" style={{ marginTop: -14, marginBottom: 14 }}>{I.alert}<span>Debés aceptar los términos para continuar</span></div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <><span className="spin"></span>Creando tu cuenta…</>
                ) : (
                  <>Crear cuenta {I.arrow}</>
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
                  disabled={!!connecting}
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
                  disabled={!!connecting}
                >
                  {connecting === "apple"
                    ? <><span className="alt-spin"></span>Conectando…</>
                    : <>{AppleIcon}Apple</>}
                </Button>
              </div>

              <div className="form-foot">
                ¿Ya sos parte de Inmercio? <Link to="/login">Iniciá sesión</Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
