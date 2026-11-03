import { useMemo, useState } from "react";
import { Link } from "react-router";
import { BrandPanel, I, Label, PasswordMeter } from "./shared";
import { Button } from "../components/ui/button";
import { SiteNavbar } from "../components/SiteNavbar";
import { OverlayScrollbar } from "../components/OverlayScrollbar";

// Pantalla para cambiar la contraseña
export function RestablecerContrasena() {
  const [f, setF] = useState({ password: "", confirm: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [attempted, setAttempted] = useState(false);

  // Toma el email de la URL
  const userEmail = useMemo(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      return p.get("email") || "tumail@email.com";
    } catch {
      return "tumail@email.com";
    }
  }, []);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setF((s) => ({ ...s, [k]: e.target.value }));
  };
  const blur = (k: string) => () => setTouched((s) => ({ ...s, [k]: true }));

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!f.password) e.password = "Creá una contraseña";
    else if (f.password.length < 8) e.password = "Mínimo 8 caracteres";
    if (!f.confirm) e.confirm = "Confirmá tu contraseña";
    else if (f.confirm !== f.password) e.confirm = "Las contraseñas no coinciden";
    return e;
  }, [f]);

  // Los errores se muestran al intentar enviar
  const showErr = (k: string) => attempted && errors[k];
  const validField = (k: "password" | "confirm") => touched[k] && !errors[k] && f[k];

  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 1300);
  };

  return (
    <div className="auth-page">
      <OverlayScrollbar />
      <SiteNavbar />
      <div className="page">
        <BrandPanel subtitle="Sumate a Inmercio y empezá a gestionar tu stock, ventas y reposición con un asistente de IA que te habla en tu idioma." />

        <main className="form-panel">
          <div className="form-wrap">
            <div className="form-eyebrow">Restablecer contraseña</div>
            <h1 className="form-title">Creá una nueva contraseña</h1>
            <p className="form-sub">Elegí una contraseña segura. Vas a usarla la próxima vez que ingreses.</p>

            <div className="account-chip">
              <span className="account-chip-ic">{I.user}</span>
              <div>
                <span className="account-chip-label">Cuenta</span>
                <strong>{userEmail}</strong>
              </div>
            </div>

            <form onSubmit={onSubmit} noValidate>
              {/* Contraseñas */}
              <div className="row">
                <div>
                  <Label>Nueva contraseña</Label>
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
                        autoFocus
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

              {f.password && <PasswordMeter password={f.password} style={{ marginTop: 12, marginBottom: 18 }} />}
              {!f.password && <div style={{ height: 14 }}></div>}

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <><span className="spin"></span>Guardando…</>
                ) : (
                  <>Guardar nueva contraseña {I.arrow}</>
                )}
              </Button>

              <div className="form-foot">
                <Link to="/login" className="back-link">{I.arrowLeft}Cancelar y volver a iniciar sesión</Link>
              </div>
            </form>
          </div>
        </main>

        {done && (
          <div className="modal-bg">
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="ic-success">{I.check}</div>
              <h3>¡Contraseña actualizada!</h3>
              <p>Tu nueva contraseña ya está activa. Iniciá sesión para volver a tu panel.</p>
              <Button asChild className="w-full h-11 no-underline">
                <Link to="/login">Iniciar sesión</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
