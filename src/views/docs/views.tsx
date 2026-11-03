// Pantallas del centro de ayuda
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { CAT_BY_SLUG, CATEGORIES, FAQ, findArticle, INTRO, type Category } from "./data";
import { Breadcrumb, DOCS_BASE, SearchBox } from "./Shell";
import { Btn, Eyebrow, Icon, Pill } from "./ui";

// Inicio
function CategoryCard({ cat }: { cat: Category }) {
  const count = cat.articles.length;
  return (
    <Link to={`${DOCS_BASE}/${cat.slug}`} className="cat-card" style={{
      display: "flex", flexDirection: "column", gap: 11,
      background: "#fff", border: "1px solid var(--border)", borderRadius: 16,
      padding: 18, textDecoration: "none",
      boxShadow: "0 1px 6px rgba(71,11,0,.035)", transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
    }}>
      <span style={{ width: 42, height: 42, borderRadius: 13, background: cat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={cat.icon} size={20} style={{ color: "#fff" }} />
      </span>
      <div>
        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)" }}>{cat.title}</p>
        <p style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 4, lineHeight: 1.5, textWrap: "pretty" }}>{cat.short}</p>
      </div>
      <span style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "var(--ink-400)", paddingTop: 4 }}>
        {count} {count === 1 ? "artículo" : "artículos"}
        <Icon name="arrow-right" size={14} className="cat-arrow" style={{ color: "#F5923E" }} />
      </span>
    </Link>
  );
}

function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--ink-900)" }}>{title}</h2>
        {sub && <p style={{ fontSize: 14, color: "var(--ink-500)", marginTop: 4 }}>{sub}</p>}
      </div>
    </div>
  );
}

export function HomeView() {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "8px 0 0" }}>
      <div style={{ textAlign: "center", padding: "44px 0 36px" }}>
        <Pill bg="#FFE8CC" color="#E8801E" style={{ marginBottom: 18 }}>
          <Icon name="sparkles" size={13} /> Centro de Ayuda
        </Pill>
        <h1 style={{ fontSize: 38, fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-.02em", lineHeight: 1.12 }}>
          ¿Cómo podemos ayudarte?
        </h1>
        <p style={{ fontSize: 16, color: "var(--ink-500)", marginTop: 12, maxWidth: 480, marginInline: "auto", lineHeight: 1.55 }}>
          Encontrá guías para sacarle el máximo provecho a Inmercio: del primer producto al bot de WhatsApp.
        </p>
        <div style={{ maxWidth: 560, margin: "26px auto 0" }}>
          <SearchBox size="lg" placeholder="Buscar guías, ej. “cargar factura”…" />
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <SectionHead title="Explorá por categoría" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))", gap: 16 }}>
          {CATEGORIES.map((c) => <CategoryCard key={c.slug} cat={c} />)}
        </div>
      </div>
    </div>
  );
}

// Pagina no encontrada
export function DocsNotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center", padding: "70px 0" }}>
      <span style={{ width: 64, height: 64, borderRadius: 18, background: "#FFE8CC", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="compass" size={30} style={{ color: "#E8801E" }} />
      </span>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--ink-900)", marginTop: 20 }}>No encontramos esa página</h1>
      <p style={{ fontSize: 15, color: "var(--ink-500)", marginTop: 10, lineHeight: 1.6 }}>
        Puede que el enlace haya cambiado. Volvé al inicio del Centro de Ayuda para seguir buscando.
      </p>
      <div style={{ marginTop: 22, display: "flex", justifyContent: "center" }}>
        <Btn variant="primary" onClick={() => navigate(DOCS_BASE)}><Icon name="home" size={16} /> Volver al inicio</Btn>
      </div>
    </div>
  );
}

// Articulos de una categoria
export function CategoryView() {
  const { cat: catSlug } = useParams();
  const cat = catSlug ? CAT_BY_SLUG[catSlug] : undefined;
  if (!cat) return <DocsNotFound />;
  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <Breadcrumb items={[{ label: "Ayuda", href: DOCS_BASE }, { label: cat.title }]} />

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14 }}>
        <span style={{ width: 60, height: 60, borderRadius: 17, background: cat.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={cat.icon} size={28} style={{ color: "#fff" }} />
        </span>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-.02em" }}>{cat.title}</h1>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-400)", marginTop: 5 }}>
            {cat.articles.length} {cat.articles.length === 1 ? "artículo" : "artículos"}
          </p>
        </div>
      </div>
      <p style={{ fontSize: 16, color: "var(--ink-500)", lineHeight: 1.6, maxWidth: 660, textWrap: "pretty" }}>{cat.desc}</p>

      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
        {cat.articles.map((a, i) => (
          <Link key={a.slug} to={`${DOCS_BASE}/${cat.slug}/${a.slug}`} className="art-row" style={{
            display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
            background: "#fff", border: "1px solid var(--border)", borderRadius: 14, textDecoration: "none",
            boxShadow: "0 1px 6px rgba(71,11,0,.035)", transition: "border-color .18s ease, transform .18s ease, box-shadow .18s ease",
          }}>
            <span style={{ width: 38, height: 38, borderRadius: 11, background: "var(--canvas)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15, fontWeight: 700, color: "var(--ink-400)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 16, fontWeight: 600, color: "var(--ink-900)" }}>{a.title}</span>
              <span style={{ display: "block", fontSize: 13.5, color: "var(--ink-500)", marginTop: 3, lineHeight: 1.5 }}>{a.blurb}</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <Icon name="arrow-right" size={18} className="art-arrow" style={{ color: "var(--ink-300)" }} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Articulo
export function ArticleView() {
  const { cat: catSlug, art: artSlug } = useParams();
  const found = catSlug && artSlug ? findArticle(catSlug, artSlug) : null;
  const artKey = `${catSlug}/${artSlug}`;

  // Vuelve arriba al cambiar de articulo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [artKey]);

  if (!found) return <DocsNotFound />;
  const { cat, article } = found;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <Breadcrumb items={[
        { label: "Ayuda", href: DOCS_BASE },
        { label: cat.title, href: `${DOCS_BASE}/${cat.slug}` },
        { label: article.title },
      ]} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Pill bg={cat.color} color="#fff"><Icon name={cat.icon} size={13} /> {cat.title}</Pill>
      </div>

      <h1 style={{ fontSize: 33, fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-.02em", lineHeight: 1.15, textWrap: "balance" }}>
        {article.title}
      </h1>

      <p style={{ fontSize: 17, color: "var(--ink-500)", lineHeight: 1.65, marginTop: 18, textWrap: "pretty" }}>{article.intro || INTRO}</p>

      {/* Pasos numerados */}
      <div style={{ marginTop: 38 }}>
        <Eyebrow style={{ marginBottom: 18 }}>Paso a paso</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {article.steps.map((s, i) => {
            const last = i === article.steps.length - 1;
            return (
              <div key={i} style={{ display: "flex", gap: 18 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <span style={{
                    width: 38, height: 38, borderRadius: 999, flexShrink: 0,
                    background: "linear-gradient(to bottom right,#FFAD60,#F5923E)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, fontWeight: 700, boxShadow: "0 2px 8px rgba(245,146,62,.3)",
                  }}>{i + 1}</span>
                  {!last && <span style={{ flex: 1, width: 2, background: "var(--border)", borderRadius: 0 }}></span>}
                </div>
                <div style={{ paddingBottom: last ? 0 : 26, flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)", marginTop: 6 }}>{s.title}</p>
                  <p style={{ fontSize: 15, color: "var(--ink-500)", lineHeight: 1.65, marginTop: 7, textWrap: "pretty" }}>{s.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Preguntas frecuentes
function AccordionItem({ item, open, onToggle, last }: {
  item: { q: string; a: string }; open: boolean; onToggle: () => void; last: boolean;
}) {
  return (
    <div style={{ borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <button onClick={onToggle} className="acc-btn" style={{
        display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left",
        padding: "18px 20px", border: "none", background: "transparent", cursor: "pointer",
      }}>
        <span style={{ flex: 1, fontSize: 15.5, fontWeight: 600, color: "var(--ink-900)" }}>{item.q}</span>
        <span style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: open ? "linear-gradient(to bottom right,#FFAD60,#F5923E)" : "var(--canvas)",
          color: open ? "#fff" : "var(--ink-500)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background .2s ease",
        }}>
          <Icon name="chevron-down" size={16} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .25s cubic-bezier(.4,0,.2,1)" }} />
        </span>
      </button>
      {open && (
        <div className="reveal" style={{ overflow: "hidden" }}>
          <p style={{ fontSize: 15, color: "var(--ink-500)", lineHeight: 1.65, padding: "0 20px 20px", textWrap: "pretty" }}>{item.a}</p>
        </div>
      )}
    </div>
  );
}

function FaqGroup({ group }: { group: { group: string; items: { q: string; a: string }[] } }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div style={{ marginBottom: 30 }}>
      <Eyebrow style={{ marginBottom: 12, paddingLeft: 2 }}>{group.group}</Eyebrow>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "0 1px 6px rgba(71,11,0,.035)", overflow: "hidden" }}>
        {group.items.map((it, i) => (
          <AccordionItem
            key={i}
            item={it}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            last={i === group.items.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export function FaqView() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <Breadcrumb items={[{ label: "Ayuda", href: DOCS_BASE }, { label: "Preguntas frecuentes" }]} />

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 12 }}>
        <span style={{ width: 60, height: 60, borderRadius: 17, background: "var(--cat-orange)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="circle-help" size={28} style={{ color: "#fff" }} />
        </span>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-.02em" }}>Preguntas frecuentes</h1>
          <p style={{ fontSize: 14, color: "var(--ink-500)", marginTop: 5 }}>Respuestas rápidas a las dudas más comunes.</p>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        {FAQ.map((g) => <FaqGroup key={g.group} group={g} />)}
      </div>
    </div>
  );
}
