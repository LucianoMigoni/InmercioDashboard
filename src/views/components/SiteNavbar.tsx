import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import logoColor from "@/visuals/assets/logos/inmercio-logo-color.png";
import { Button } from "./ui/button";
import "./site-navbar.css";

const SECTIONS = [
  { id: "funcionalidades", label: "Funcionalidades" },
  { id: "primeros-pasos", label: "Primeros pasos" },
  { id: "planes", label: "Planes" },
  { id: "beneficios", label: "Beneficios" },
  { id: "faq", label: "Preguntas frecuentes" },
];

// Navbar principal del sitio
export function SiteNavbar({ mode = "fixed" }: { mode?: "fixed" | "sticky" }) {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const onLanding = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fuera de la landing los links vuelven al inicio
  const sectionHref = (id: string) => (onLanding ? `#${id}` : `/#${id}`);

  return (
    <header className={`site-nav ${mode === "sticky" ? "sticky" : ""} ${scrolled ? "scrolled" : ""}`}>
      <div className="sn-wrap">
        <div className="sn-inner">
          {onLanding ? (
            <a className="sn-logo" href="#hero">
              <img src={logoColor} alt="Inmercio" />
            </a>
          ) : (
            <Link className="sn-logo" to="/">
              <img src={logoColor} alt="Inmercio" />
            </Link>
          )}
          <nav className="sn-links">
            {SECTIONS.map((s) =>
              onLanding ? (
                <a key={s.id} href={sectionHref(s.id)}>{s.label}</a>
              ) : (
                <Link key={s.id} to={sectionHref(s.id)}>{s.label}</Link>
              ),
            )}
          </nav>
          <div className="sn-cta">
            <Button asChild variant="tertiary" className="sn-btn-ghost h-10 no-underline">
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild className="h-10 no-underline">
              <Link to="/registro">Registrarse</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
