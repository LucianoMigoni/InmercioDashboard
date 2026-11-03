import { Outlet, useLocation } from "react-router";
import { Footer, Header, Sidebar } from "./Shell";
import { OverlayScrollbar } from "../components/OverlayScrollbar";
import "./docs.css";

// Estructura general del centro de ayuda
export function DocsLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/documentacion" || pathname === "/documentacion/";
  const isFaq = pathname.startsWith("/documentacion/faq");

  return (
    <div className="docs-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--canvas)" }}>
      <OverlayScrollbar />
      <Header />
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", maxWidth: 1320, width: "100%", margin: "0 auto" }}>
        <Sidebar isHome={isHome} isFaq={isFaq} />
        <main style={{ flex: 1, minWidth: 0, padding: isHome ? "20px 40px 56px" : "30px 48px 56px" }}>
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
}
