// Estructura del centro de ayuda
import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { CATEGORIES, searchArticles } from "./data";
import { Btn, Eyebrow, Icon, LOGO_MARK } from "./ui";

export const DOCS_BASE = "/documentacion";

// Buscador con lista de resultados
export function SearchBox({ size = "md", placeholder = "Buscar en la ayuda…" }: {
  size?: "md" | "lg"; placeholder?: string;
}) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => searchArticles(q).slice(0, 6), [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  useEffect(() => { setActive(0); }, [q]);

  const big = size === "lg";
  function pick(r: ReturnType<typeof searchArticles>[number]) {
    setOpen(false); setQ("");
    navigate(`${DOCS_BASE}/${r.cat.slug}/${r.article.slug}`);
  }
  function onKey(e: React.KeyboardEvent) {
    if (!open || !results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); pick(results[active]); }
    else if (e.key === "Escape") { setOpen(false); }
  }

  return (
    <div ref={boxRef} style={{ position: "relative", width: "100%" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: big ? 13 : 9,
        height: big ? 60 : 40, padding: big ? "0 20px" : "0 14px",
        background: "#fff", border: "1px solid var(--border)",
        borderRadius: big ? 16 : 12,
        boxShadow: open
          ? "0 0 0 4px rgba(255,173,96,.13), 0 8px 28px rgba(71,11,0,.07)"
          : (big ? "0 4px 20px rgba(71,11,0,.05)" : "0 1px 6px rgba(71,11,0,.035)"),
        transition: "box-shadow .2s ease, border-color .2s ease",
        borderColor: open ? "#FFAD60" : "var(--border)",
      }}>
        <Icon name="search" size={big ? 22 : 16} style={{ color: open ? "#F5923E" : "var(--ink-400)" }} />
        <input
          value={q}
          maxLength={100}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder={placeholder}
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontFamily: "var(--font-ui)", fontSize: big ? 17 : 14, color: "var(--ink-900)",
            fontWeight: 400,
          }}
        />
        {q && (
          <button onClick={() => { setQ(""); setOpen(true); }} className="x-btn"
            style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", color: "var(--ink-400)", padding: 2 }}>
            <Icon name="x" size={big ? 18 : 15} />
          </button>
        )}
      </div>

      {open && q && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 60,
          background: "#fff", border: "1px solid var(--border)", borderRadius: 14,
          boxShadow: "0 16px 40px rgba(71,11,0,.12)", overflow: "hidden",
        }}>
          {results.length === 0 ? (
            <div style={{ padding: "18px 18px", display: "flex", alignItems: "center", gap: 10, color: "var(--ink-500)" }}>
              <Icon name="search-x" size={16} />
              <span style={{ fontSize: 14 }}>No encontramos resultados para “{q}”.</span>
            </div>
          ) : (
            <>
              <p style={{ font: "700 10px/1 var(--font-ui)", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-400)", padding: "12px 16px 8px" }}>
                {results.length} {results.length === 1 ? "resultado" : "resultados"}
              </p>
              {results.map((r, i) => (
                <button key={r.cat.slug + r.article.slug}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(r)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left",
                    padding: "10px 16px", border: "none", cursor: "pointer",
                    background: i === active ? "var(--canvas)" : "transparent",
                  }}>
                  <span style={{ width: 32, height: 32, borderRadius: 9, background: r.cat.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={r.cat.icon} size={15} style={{ color: "#fff" }} />
                  </span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--ink-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.article.title}</span>
                    <span style={{ display: "block", fontSize: 12, color: "var(--ink-400)", marginTop: 1 }}>{r.cat.title}</span>
                  </span>
                  <Icon name="arrow-right" size={15} style={{ color: "var(--ink-300)", flexShrink: 0 }} />
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Encabezado con logo y buscador
export function Header() {
  return (
    <header style={{
      position: "sticky", top: "var(--site-nav-h)", zIndex: 50, height: 68, flexShrink: 0,
      background: "rgba(255,255,255,.82)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", gap: 20, padding: "0 24px",
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
        <img src={LOGO_MARK} alt="Inmercio" style={{ width: 34, height: 34, objectFit: "contain" }} />
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-900)" }}>Inmercio</span>
          <span style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 3, fontWeight: 500 }}>Centro de Ayuda</span>
        </span>
      </Link>
      <div style={{ flex: 1, maxWidth: 440, margin: "0 auto" }}>
        <SearchBox />
      </div>
    </header>
  );
}

// Menu lateral con las categorias
export function Sidebar({ isHome, isFaq }: { isHome: boolean; isFaq: boolean }) {
  const { cat: activeCat, art: activeArt } = useParams();
  const [openCats, setOpenCats] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    if (activeCat) init[activeCat] = true;
    return init;
  });
  useEffect(() => {
    if (activeCat) setOpenCats((o) => (o[activeCat] ? o : { ...o, [activeCat]: true }));
  }, [activeCat]);

  function toggle(slug: string) {
    setOpenCats((o) => ({ ...o, [slug]: !o[slug] }));
  }

  return (
    <aside style={{ width: 270, flexShrink: 0, padding: "24px 14px 40px", position: "sticky", top: "calc(68px + var(--site-nav-h))", alignSelf: "flex-start", height: "calc(100vh - 68px - var(--site-nav-h))", overflowY: "auto" }} className="sidebar">
      <Link to={DOCS_BASE} className="navitem" style={{
        display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: 11,
        textDecoration: "none", marginBottom: 4,
        background: isHome ? "#fff" : "transparent",
        boxShadow: isHome ? "0 2px 12px rgba(71,11,0,.06),0 1px 3px rgba(71,11,0,.03)" : "none",
      }}>
        <span style={{
          width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
          background: isHome ? "linear-gradient(to bottom right,#FFAD60,#F5923E)" : "transparent",
          color: isHome ? "#fff" : "var(--ink-500)",
        }}>
          <Icon name="home" size={15} />
        </span>
        <span style={{ fontSize: 14, fontWeight: isHome ? 600 : 500, color: isHome ? "var(--ink-900)" : "var(--ink-500)" }}>Inicio</span>
      </Link>

      <Eyebrow style={{ padding: "16px 11px 8px" }}>Categorías</Eyebrow>

      {CATEGORIES.map((cat) => {
        const isOpen = !!openCats[cat.slug];
        const isActiveCat = activeCat === cat.slug;
        return (
          <div key={cat.slug} style={{ marginBottom: 2 }}>
            <button onClick={() => toggle(cat.slug)} className="navitem"
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: 11,
                width: "100%", border: "none", cursor: "pointer", textAlign: "left",
                background: isActiveCat && !activeArt ? "#fff" : "transparent",
                boxShadow: isActiveCat && !activeArt ? "0 2px 12px rgba(71,11,0,.06),0 1px 3px rgba(71,11,0,.03)" : "none",
              }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: cat.color, color: "#fff", flexShrink: 0 }}>
                <Icon name={cat.icon} size={14} />
              </span>
              <span style={{ fontSize: 14, fontWeight: isActiveCat ? 600 : 500, color: isActiveCat ? "var(--ink-900)" : "var(--ink-600)", flex: 1 }}>{cat.title}</span>
              <Icon name="chevron-right" size={15} style={{ color: "var(--ink-400)", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .2s ease" }} />
            </button>

            <div className={isOpen ? "reveal" : ""} style={{ display: isOpen ? "block" : "none" }}>
              <div style={{ padding: "2px 0 4px 23px", marginLeft: 12, borderLeft: "1.5px solid var(--border)", display: "flex", flexDirection: "column" }}>
                <Link to={`${DOCS_BASE}/${cat.slug}`} className="subitem"
                  style={{ ...subStyle, color: isActiveCat && !activeArt ? "#E8801E" : "var(--ink-500)", fontWeight: isActiveCat && !activeArt ? 600 : 500 }}>
                  Índice de la categoría
                </Link>
                {cat.articles.map((a) => {
                  const on = isActiveCat && activeArt === a.slug;
                  return (
                    <Link key={a.slug} to={`${DOCS_BASE}/${cat.slug}/${a.slug}`} className="subitem"
                      style={{ ...subStyle, color: on ? "#E8801E" : "var(--ink-600)", fontWeight: on ? 600 : 500, background: on ? "#FFF6EE" : "transparent" }}>
                      {a.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      <Eyebrow style={{ padding: "16px 11px 8px" }}>Recursos</Eyebrow>
      <Link to={`${DOCS_BASE}/faq`} className="navitem" style={{
        display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: 11,
        textDecoration: "none",
        background: isFaq ? "#fff" : "transparent",
        boxShadow: isFaq ? "0 2px 12px rgba(71,11,0,.06),0 1px 3px rgba(71,11,0,.03)" : "none",
      }}>
        <span style={{ width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: isFaq ? "linear-gradient(to bottom right,#FFAD60,#F5923E)" : "var(--canvas)", color: isFaq ? "#fff" : "var(--ink-500)" }}>
          <Icon name="circle-help" size={14} />
        </span>
        <span style={{ fontSize: 14, fontWeight: isFaq ? 600 : 500, color: isFaq ? "var(--ink-900)" : "var(--ink-600)" }}>Preguntas frecuentes</span>
      </Link>
    </aside>
  );
}
const subStyle: CSSProperties = {
  display: "block", padding: "7px 10px", fontSize: 13, textDecoration: "none",
  borderRadius: 8, lineHeight: 1.35, marginBottom: 1,
};

// Ruta de navegacion
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 22 }}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={i}>
            {it.href && !last ? (
              <Link to={it.href} className="crumb" style={{ fontSize: 13, color: "var(--ink-500)", textDecoration: "none", fontWeight: 500 }}>{it.label}</Link>
            ) : (
              <span style={{ fontSize: 13, color: last ? "var(--ink-900)" : "var(--ink-500)", fontWeight: last ? 600 : 500 }}>{it.label}</span>
            )}
            {!last && <Icon name="chevron-right" size={13} style={{ color: "var(--ink-300)" }} />}
          </Fragment>
        );
      })}
    </nav>
  );
}

// Pie de pagina
export function Footer() {
  return (
    <footer style={{ maxWidth: 1040, margin: "56px auto 0", paddingTop: 28, borderTop: "1px solid var(--border)" }}>
      <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: 12 }}>
        {/* WhatsApp */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap",
          background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 14px",
          boxShadow: "0 1px 6px rgba(71,11,0,.035)", height: 82, boxSizing: "border-box",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(to bottom right,#34c46b,#1fae57)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="whatsapp" size={18} style={{ color: "#fff" }} />
            </span>
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)", lineHeight: 1.25 }}>¿No encontraste lo que buscabas?</p>
              <p style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 1 }}>Escribinos por WhatsApp y te ayudamos.</p>
            </div>
          </div>
          <Btn variant="primary" size="sm" style={{ background: "linear-gradient(to right,#34c46b,#1fae57)" }}>
            <Icon name="whatsapp" size={14} /> Escribinos por WhatsApp
          </Btn>
        </div>

        {/* Correo de soporte */}
        <a href="mailto:soporte@inmercio.com" className="mail-card" style={{
          display: "flex", alignItems: "center", gap: 11, textDecoration: "none",
          background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 14px",
          boxShadow: "0 1px 6px rgba(71,11,0,.035)", transition: "border-color .18s ease, transform .18s ease", height: 82, boxSizing: "border-box",
        }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: "#E4ECF9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="mail" size={18} style={{ color: "#4A77C2" }} />
          </span>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 12, color: "var(--ink-500)", lineHeight: 1.2 }}>Correo de Soporte</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-900)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>soporte@inmercio.com</p>
          </div>
        </a>
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: "var(--ink-300)", marginTop: 22 }}>
        © 2026 Inmercio · Gestión Inteligente
      </p>
    </footer>
  );
}
