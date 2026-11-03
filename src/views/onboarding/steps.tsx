import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { I, Mascot, PrimaryBtn, RUBROS, StepFrame, type StepNav } from "./shared";
import { Dropdown } from "../components/ui/dropdown";
import { formatCuit } from "@/shared/format";
import type { OnboardingData } from "./Onboarding";

interface StepProps {
  data: OnboardingData;
  set: <K extends keyof OnboardingData>(k: K, v: OnboardingData[K]) => void;
  nav: StepNav;
}

// Paso 1 Bienvenida
export function StepWelcome({ data, nav }: StepProps) {
  const items = [
    { ic: I.whatsapp, tone: "wa", t: "Conectá tu WhatsApp", d: "Vinculá el número de tu negocio en un toque." },
    { ic: I.package, tone: "cat", t: "Cargá tu catálogo", d: "Subí tu planilla o sumá productos a mano." },
  ];
  return (
    <StepFrame
      stepIndex={nav.stepIndex} stepCount={nav.stepCount}
      showBack={false} showSkip={false}
      onContinue={nav.next} continueLabel="Empezar la configuración" maxWidth={640}
    >
      <div className="ob-welcome">
        <div className="ob-welcome-top">
          <Mascot size={84} glow />
          <div>
            <div className="ob-eyebrow" style={{ marginBottom: 8 }}>Tu cuenta está lista</div>
            <h1 className="ob-title" style={{ marginBottom: 8 }}>¡Bienvenida a Inmercio, {data.nombre}!</h1>
            <p className="ob-sub" style={{ margin: 0 }}>
              En menos de 3 minutos vas a dejar listo tu asistente para gestionar el stock de tu negocio directo desde WhatsApp.
            </p>
          </div>
        </div>

        <div className="ob-welcome-list">
          {items.map((it, i) => (
            <div className="ob-welcome-item" key={i}>
              <span className="ob-welcome-num">{i + 1}</span>
              <span className={`ob-welcome-ic ic-tone-${it.tone}`}>{it.ic}</span>
              <div>
                <div className="ob-welcome-t">{it.t}</div>
                <div className="ob-welcome-d">{it.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="ob-note">
          <span className="ob-note-ic">{I.clock}</span>
          Podés pausar y volver cuando quieras. Tu progreso se guarda solo.
        </div>
      </div>
    </StepFrame>
  );
}

// Paso 2 Datos del negocio
export function StepBusiness({ data, set, nav }: StepProps) {
  const today = [
    { id: "planilla", t: "Planillas de Excel" }, { id: "papel", t: "Cuaderno / papel" },
    { id: "sistema", t: "Otro sistema" }, { id: "ojo", t: "A ojo / de memoria" },
  ];
  const cuitDigits = data.cuit.replace(/\D/g, "");
  const ok = data.negocio.trim() && cuitDigits.length === 11 && data.rubro && data.metodo;
  return (
    <StepFrame
      eyebrow="Contanos sobre tu negocio"
      title="¿Cómo es tu local?"
      sub="Lo usamos para preparar tu catálogo y los avisos con tu vocabulario."
      stepIndex={nav.stepIndex} stepCount={nav.stepCount}
      onBack={nav.back} showSkip={false} onContinue={nav.next} continueDisabled={!ok}
    >
      <div className="ob-form">
        <div className="ob-field">
          <label className="ob-label">Nombre del negocio</label>
          <div className="ob-input-wrap">
            <span className="ob-lead">{I.store}</span>
            <input className="ob-input" placeholder="Ej: Dietética La Semilla"
              value={data.negocio} onChange={(e) => set("negocio", e.target.value)} />
          </div>
        </div>

        <div className="ob-field">
          <label className="ob-label">CUIT</label>
          <div className="ob-input-wrap">
            <span className="ob-lead">{I.card}</span>
            <input className="ob-input" placeholder="Ej: 30-71234567-8" inputMode="numeric"
              value={data.cuit} onChange={(e) => set("cuit", formatCuit(e.target.value))} />
          </div>
        </div>

        <div className="ob-field">
          <label className="ob-label">Rubro</label>
          <Dropdown
            value={data.rubro}
            options={RUBROS.map((r) => ({ value: r, label: r }))}
            onSelect={(r) => set("rubro", r)}
            placeholder="Elegí tu rubro"
            className="bg-white h-[46px] text-[14.5px]"
          />
        </div>

        <div className="ob-field">
          <label className="ob-label">¿Cómo llevás el stock hoy?</label>
          <div className="ob-chip-grid">
            {today.map(c => (
              <button key={c.id} type="button" className={`ob-chip ${data.metodo === c.id ? "sel" : ""}`} onClick={() => set("metodo", c.id)}>
                {data.metodo === c.id ? <span className="ob-chip-ck">{I.check}</span> : null}{c.t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </StepFrame>
  );
}

// Paso 3 Conectar WhatsApp
export function StepWhatsApp({ data, set, nav }: StepProps) {
  // Etapa en la que esta la verificacion
  const [phase, setPhase] = useState(data.waConnected ? "done" : "idle");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phone = data.telefono || "11 5555 0123";

  const sendCode = () => {
    setPhase("sending");
    setTimeout(() => { setPhase("sent"); setTimeout(() => codeRefs.current[0]?.focus(), 100); }, 1400);
  };
  const onCodeChange = (i: number, v: string) => {
    v = v.replace(/\D/g, "").slice(-1);
    const nc = [...code]; nc[i] = v; setCode(nc);
    if (v && i < 5) codeRefs.current[i + 1]?.focus();
  };
  const onCodeKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) codeRefs.current[i - 1]?.focus();
  };
  const verify = () => {
    setPhase("verifying");
    setTimeout(() => { setPhase("done"); set("waConnected", true); }, 1500);
  };
  const codeFull = code.every(Boolean);

  return (
    <StepFrame
      eyebrow="Paso clave"
      title="Conectá tu WhatsApp"
      sub="Inmercio vive dentro de tu WhatsApp. Vinculá el número de tu negocio para empezar a hablarle."
      stepIndex={nav.stepIndex} stepCount={nav.stepCount}
      onBack={nav.back} showSkip={false}
      onContinue={nav.next} continueDisabled={phase !== "done"}
      maxWidth={460}
    >
      <div className="ob-wa-center">
        <div className="ob-wa-controls">
          <div className="ob-field">
            <label className="ob-label">Número de WhatsApp del negocio</label>
            <div className="ob-phone-row">
              <span className="ob-prefix"><span className="ob-flag"></span>+54</span>
              <div className="ob-input-wrap" style={{ flex: 1 }}>
                <span className="ob-lead" style={{ color: "#25D366" }}>{I.whatsapp}</span>
                <input className="ob-input" value={phone} onChange={(e) => set("telefono", e.target.value)}
                  disabled={phase !== "idle"} />
              </div>
            </div>
          </div>

          {phase === "idle" || phase === "sending" ? (
            <PrimaryBtn onClick={sendCode} loading={phase === "sending"} full style={{ marginTop: 4 }}>
              {phase === "sending" ? "Enviando código…" : <>Enviar código por WhatsApp {I.send}</>}
            </PrimaryBtn>
          ) : null}

          {(phase === "sent" || phase === "verifying" || phase === "done") ? (
            <div className="ob-field" style={{ marginTop: 6 }}>
              <label className="ob-label">Ingresá el código de 6 dígitos</label>
              <div className="ob-code-row">
                {code.map((d, i) => (
                  <input key={i} ref={el => { codeRefs.current[i] = el; }} className="ob-code-box"
                    inputMode="numeric" maxLength={1} value={d}
                    disabled={phase === "done"}
                    onChange={(e) => onCodeChange(i, e.target.value)}
                    onKeyDown={(e) => onCodeKey(i, e)} />
                ))}
              </div>
              {phase !== "done" ? (
                <PrimaryBtn onClick={verify} disabled={!codeFull} loading={phase === "verifying"} full style={{ marginTop: 14 }}>
                  {phase === "verifying" ? "Verificando…" : "Verificar y conectar"}
                </PrimaryBtn>
              ) : null}
            </div>
          ) : null}

          {phase === "done" ? (
            <div className="ob-success-banner">
              <span className="ob-success-ic">{I.check}</span>
              <div><strong>¡WhatsApp conectado!</strong><span>Ya podés hablarle a Inmercio desde tu teléfono.</span></div>
            </div>
          ) : null}
        </div>
      </div>
    </StepFrame>
  );
}

// Paso 4 Catalogo
const SAMPLE_PARSED = [
  { n: "Chía Orgánica", cat: "Semillas", q: "12,5 kg" },
  { n: "Proteína Whey Vainilla 1kg", cat: "Suplementos", q: "8 uds" },
  { n: "Té Verde en hebras", cat: "Infusiones", q: "20 uds" },
  { n: "Harina de Almendras 500g", cat: "Harinas", q: "15 uds" },
  { n: "Aceite de Coco 500ml", cat: "Aceites", q: "9 uds" },
];

export function StepCatalog({ data, set, nav }: StepProps) {
  // Etapa de la carga del archivo
  const [phase, setPhase] = useState(data.catalogo ? "done" : "idle");
  const [pct, setPct] = useState(0);

  const startUpload = () => {
    setPhase("uploading"); setPct(0);
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 18 + 8;
      if (p >= 100) {
        p = 100; clearInterval(id); setPct(100);
        setTimeout(() => { setPhase("done"); set("catalogo", 142); set("catalogMethod", "subir"); }, 400);
      } else setPct(Math.round(p));
    }, 220);
  };

  const ready = phase === "done";

  return (
    <StepFrame
      eyebrow="Cargá tus productos"
      title="Armemos tu catálogo"
      sub="Es la base de todo. Subí tu planilla y la importamos sola."
      stepIndex={nav.stepIndex} stepCount={nav.stepCount}
      onBack={nav.back} onSkip={nav.skip} onContinue={nav.next} continueDisabled={!ready}
      maxWidth={720}
    >
      <div className="ob-card">
        {phase === "idle" ? (
          <div className="ob-drop" onClick={startUpload}>
            <span className="ob-drop-ic">{I.sheet}</span>
            <div className="ob-drop-t">Arrastrá tu archivo o <span className="ob-drop-link">elegilo desde tu compu</span></div>
            <div className="ob-drop-d">Aceptamos Excel (.xlsx) y CSV · Hasta 5.000 productos</div>
          </div>
        ) : phase === "uploading" ? (
          <div className="ob-uploading">
            <div className="ob-up-file">
              <span className="ob-up-ic">{I.sheet}</span>
              <div className="ob-up-meta"><strong>catalogo-la-semilla.xlsx</strong><span>Procesando productos…</span></div>
              <span className="ob-up-pct">{pct}%</span>
            </div>
            <div className="ob-progress"><span style={{ width: pct + "%" }}></span></div>
          </div>
        ) : (
          <div className="ob-parsed">
            <div className="ob-parsed-head">
              <div><strong>Detectamos 142 productos en 5 categorías</strong><span>Revisá la vista previa y ajustá lo que quieras después.</span></div>
            </div>
            <div className="ob-table">
              <div className="ob-tr ob-th"><span>Producto</span><span>Categoría</span><span>Stock</span></div>
              {SAMPLE_PARSED.map((r, i) => (
                <div className="ob-tr" key={i}><span>{r.n}</span><span><em className="ob-cat-dot" data-cat={r.cat}></em>{r.cat}</span><span>{r.q}</span></div>
              ))}
              <div className="ob-tr ob-more">+ 137 productos más</div>
            </div>
          </div>
        )}
      </div>
    </StepFrame>
  );
}

// Paso 5 Todo listo
export function StepDone({ data, nav }: StepProps) {
  const navigate = useNavigate();
  const recap = [
    { ic: I.store, tone: "biz", t: data.negocio || "Tu negocio", d: data.rubro || "Rubro configurado" },
    { ic: I.whatsapp, tone: "wa", t: "WhatsApp", d: `+54 ${data.telefono || "11 5555 0123"}` },
    { ic: I.package, tone: "cat", t: `${data.catalogo || 0} productos`, d: data.catalogo ? "Catálogo cargado" : "Sin cargar aún" },
  ];
  // Va al dashboard pasando por la pantalla de carga
  const launch = () => navigate("/cargando", { state: { to: "/dashboard" } });
  return (
    <StepFrame
      stepIndex={nav.stepIndex} stepCount={nav.stepCount}
      showBack={true} onBack={nav.back} showSkip={false}
      onContinue={null} maxWidth={860}
    >
      <div className="ob-done">
        <div className="ob-done-head">
          <Mascot size={80} glow />
          <div className="ob-eyebrow" style={{ marginTop: 18 }}>Configuración completa</div>
          <h1 className="ob-title">¡Todo listo, {data.nombre}! 🎉</h1>
          <p className="ob-sub" style={{ maxWidth: 380, margin: "0 auto" }}>
            Tu cuenta está lista. Entrá a tu panel y empezá a gestionar tu stock.
          </p>
        </div>

        <div className="ob-recap">
          {recap.map((r, i) => (
            <div className="ob-recap-card" key={i}>
              <span className={`ob-recap-ic ic-tone-${r.tone}`}>{r.ic}</span>
              <div className="ob-recap-t">{r.t}</div>
              <div className="ob-recap-d">{r.d}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
          <PrimaryBtn onClick={launch} style={{ fontSize: 16, height: 54, padding: "0 32px" }}>
            {I.dashboard} Entrar a mi panel {I.arrowRight}
          </PrimaryBtn>
        </div>
      </div>
    </StepFrame>
  );
}
