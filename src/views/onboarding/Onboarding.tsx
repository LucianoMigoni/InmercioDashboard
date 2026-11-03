import { useCallback, useEffect, useRef, useState } from "react";
import lockupWhite from "@/visuals/assets/logos/inmercio-lockup-white.png";
import { I, type StepNav } from "./shared";
import { StepBusiness, StepCatalog, StepDone, StepWelcome, StepWhatsApp } from "./steps";

// Onboarding con los pasos a la izquierda

export interface OnboardingData {
  nombre: string;
  negocio: string;
  cuit: string;
  rubro: string;
  metodo: string;
  telefono: string;
  waConnected: boolean;
  catalogo: number;
  catalogMethod: string;
}

const STEPS = [
  { id: "welcome", name: "Bienvenida", sub: "Empecemos", Comp: StepWelcome },
  { id: "business", name: "Tu negocio", sub: "Datos del local", Comp: StepBusiness },
  { id: "whatsapp", name: "Conectar WhatsApp", sub: "Vinculá tu número", Comp: StepWhatsApp },
  { id: "catalog", name: "Tu catálogo", sub: "Cargá productos", Comp: StepCatalog },
  { id: "done", name: "Todo listo", sub: "A tu panel", Comp: StepDone },
];

const DEFAULT_DATA: OnboardingData = {
  nombre: "Ana", negocio: "Dietética La Semilla", cuit: "", rubro: "Dietética / Tienda saludable",
  metodo: "", telefono: "11 5555 0123",
  waConnected: false, catalogo: 0, catalogMethod: "subir",
};

const LS_KEY = "inmercio_onboarding_v1";

// Por ahora el onboarding empieza de cero cada vez
// Cambiar a true para guardar el progreso
const PERSIST_PROGRESS = false;

function loadState(): { step: number; maxReached: number; data: OnboardingData } {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    return {
      step: typeof raw.step === "number" ? raw.step : 0,
      maxReached: typeof raw.maxReached === "number" ? raw.maxReached : 0,
      data: { ...DEFAULT_DATA, ...(raw.data || {}) },
    };
  } catch {
    return { step: 0, maxReached: 0, data: DEFAULT_DATA };
  }
}

export function Onboarding() {
  const init = useRef(PERSIST_PROGRESS ? loadState() : { step: 0, maxReached: 0, data: DEFAULT_DATA }).current;
  const [step, setStep] = useState(init.step);
  const [maxReached, setMaxReached] = useState(init.maxReached);
  const [data, setData] = useState(init.data);

  useEffect(() => {
    if (PERSIST_PROGRESS) {
      localStorage.setItem(LS_KEY, JSON.stringify({ step, maxReached, data }));
    } else {
      localStorage.removeItem(LS_KEY);
    }
  }, [step, maxReached, data]);

  const set = useCallback(<K extends keyof OnboardingData>(k: K, v: OnboardingData[K]) => {
    setData((d) => ({ ...d, [k]: v }));
  }, []);

  const goStep = (i: number) => {
    if (i < 0 || i >= STEPS.length) return;
    setStep(i);
    setMaxReached((m) => Math.max(m, i));
    window.scrollTo(0, 0);
  };
  const next = () => goStep(step + 1);
  const back = () => goStep(step - 1);
  const skip = () => goStep(step + 1);

  const nav: StepNav = { stepIndex: step, stepCount: STEPS.length, next, back, skip, goStep };

  const cur = STEPS[step];
  const StepComp = cur.Comp;

  return (
    <div className="ob-shell rail-marca">
      {/* Lista de pasos */}
      <aside className="ob-rail">
        <div className="ob-rail-logo">
          <img src={lockupWhite} alt="Inmercio" />
        </div>

        <div className="ob-rail-intro">
          <div className="ob-rail-eyebrow">Configuración</div>
          <div className="ob-rail-title">Dejá tu cuenta lista</div>
        </div>

        <nav className="ob-stepper">
          {STEPS.map((s, i) => {
            const active = i === step;
            const reachable = i <= maxReached;
            const completed = i < step;
            return (
              <button key={s.id} type="button"
                className={`ob-step ${active ? "active" : ""} ${completed ? "done" : ""} ${reachable ? "" : "locked"}`}
                onClick={() => reachable && goStep(i)} disabled={!reachable}>
                <span className="ob-step-line" aria-hidden="true"></span>
                <span className="ob-step-dot">
                  {completed ? I.check : <span className="ob-step-num">{i + 1}</span>}
                </span>
                <span className="ob-step-text">
                  <span className="ob-step-name">{s.name}</span>
                  <span className="ob-step-sub">{s.sub}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="ob-rail-foot">
          <div className="ob-rail-progress"><span style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}></span></div>
          <span>{Math.round((step / (STEPS.length - 1)) * 100)}% completado</span>
        </div>
      </aside>

      {/* Paso actual */}
      <main className="ob-main" key={cur.id}>
        <StepComp data={data} set={set} nav={nav} />
      </main>
    </div>
  );
}
