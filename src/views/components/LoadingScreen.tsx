import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import "./loading-screen.css";

// Cuanto dura la pantalla de carga
const LOADING_MS = 1500;

// Pagina a la que va si no se indica otra
const FALLBACK_TO = "/dashboard";

// Pantalla de carga que despues redirige a otra pagina
export function LoadingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const to = (location.state as { to?: string } | null)?.to ?? FALLBACK_TO;

  useEffect(() => {
    const t = setTimeout(() => navigate(to, { replace: true }), LOADING_MS);
    return () => clearTimeout(t);
  }, [to, navigate]);

  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true"></span>
      <p className="loading-text">Cargando…</p>
    </div>
  );
}
