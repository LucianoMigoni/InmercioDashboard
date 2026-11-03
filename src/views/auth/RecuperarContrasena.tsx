import { useMemo, useState } from "react";
import { Link } from "react-router";
import { BrandPanel, Field, I, isEmail, Label } from "./shared";
import { Button } from "../components/ui/button";
import { OverlayScrollbar } from "../components/OverlayScrollbar";

// Pantalla para recuperar la contraseña
export function RecuperarContrasena() {
  const [f, setF] = useState({ email: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setF((s) => ({ ...s, [k]: e.target.value }));
  };
  const blur = (k: string) => () => setTouched((s) => ({ ...s, [k]: true }));

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!f.email.trim()) e.email = "Ingresá tu email";
    else if (!isEmail(f.email)) e.email = "Email inválido";
    return e;
  }, [f]);

  // Los errores se muestran al intentar enviar
  const showErr = (k: string) => attempted && errors[k];
  const validField = (k: "email") => touched[k] && !errors[k] && f[k];

  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  const startCooldown = () => {
    setCooldown(30);
    const tick = () => {
      setCooldown((c) => {
        if (c <= 1) return 0;
        setTimeout(tick, 1000);
        return c - 1;
      });
    };
    setTimeout(tick, 1000);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      startCooldown();
    }, 1100);
  };

  const resend = () => {
    if (cooldown > 0) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); startCooldown(); }, 800);
  };

  // Esta pantalla no tiene navbar
  return (
    <div className="auth-page no-nav">
      <OverlayScrollbar />
      <div className="page">
        <BrandPanel subtitle="Volvé a tu panel y seguí gestionando tu stock, ventas y reposición con tu asistente de IA." />

        <main className="form-panel">
          <div className="form-wrap">
            {!sent ? (
              <>
                <div className="form-eyebrow">Recuperar acceso</div>
                <h1 className="form-title">¿Olvidaste tu contraseña?</h1>
                <p className="form-sub">Ingresá tu email y te mandamos un enlace para crear una nueva.</p>

                <form onSubmit={onSubmit} noValidate>
                  <Label>Email</Label>
                  <Field icon={I.mail} error={showErr("email")} valid={!!validField("email")}>
                    <input
                      className={`input ${showErr("email") ? "error" : ""} ${validField("email") ? "valid has-trail" : ""}`}
                      type="email" placeholder="tumail@email.com" value={f.email}
                      onChange={set("email")} onBlur={blur("email")} autoComplete="email"
                      autoFocus
                    />
                  </Field>

                  <Button type="submit" size="lg" className="w-full mt-2" disabled={submitting}>
                    {submitting ? (
                      <><span className="spin"></span>Enviando enlace…</>
                    ) : (
                      <>Enviar enlace de recuperación {I.arrow}</>
                    )}
                  </Button>

                  <div className="form-foot">
                    <Link to="/login" className="back-link">{I.arrowLeft}Volver a iniciar sesión</Link>
                  </div>
                </form>
              </>
            ) : (
              <div className="sent-state">
                <div className="sent-ic">{I.mailCheck}</div>
                <h1 className="form-title">Revisá tu casilla</h1>
                <p className="form-sub">
                  Te enviamos un enlace a <strong>{f.email}</strong> para restablecer tu contraseña. El enlace expira en 30 minutos.
                </p>

                <Button asChild size="lg" className="w-full no-underline">
                  <Link to="/restablecer-contrasena">
                    Abrir el enlace de prueba {I.arrow}
                  </Link>
                </Button>

                <div className="resend-row">
                  <span>¿No recibiste el correo?</span>
                  {cooldown > 0 ? (
                    <span className="resend-cooldown">Reenviar en {cooldown}s</span>
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-[13.5px]"
                      onClick={resend}
                      disabled={submitting}
                    >
                      {submitting ? "Reenviando…" : "Reenviar correo"}
                    </Button>
                  )}
                </div>

                <div className="form-foot">
                  <Link to="/login" className="back-link">{I.arrowLeft}Volver a iniciar sesión</Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
