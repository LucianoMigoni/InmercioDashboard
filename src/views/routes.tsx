import { createBrowserRouter, Navigate } from "react-router";
import { LandingPage } from "./landing/LandingPage";
import { Login } from "./auth/Login";
import { Registro } from "./auth/Registro";
import { RecuperarContrasena } from "./auth/RecuperarContrasena";
import { RestablecerContrasena } from "./auth/RestablecerContrasena";
import { Onboarding } from "./onboarding/Onboarding";
import { LoadingScreen } from "./components/LoadingScreen";
import { DocsLayout } from "./docs/DocsLayout";
import { ArticleView, CategoryView, FaqView, HomeView } from "./docs/views";
import { Layout } from "./dashboard/Layout";
import { Principal } from "./dashboard/views/Principal";
// import { Resumen } from "./dashboard/views/Resumen";
import { Inventario } from "./dashboard/views/Inventario";
import { Configuracion } from "./dashboard/views/Configuracion";
import { Ayuda } from "./dashboard/views/Ayuda";
import { HistorialMovimientos } from "./dashboard/views/HistorialMovimientos";

export const router = createBrowserRouter([
  // Pagina principal
  { path: "/", Component: LandingPage },
  { path: "/landing", element: <Navigate to="/" replace /> },

  // Inicio de sesion y registro
  { path: "/login", Component: Login },
  { path: "/registro", Component: Registro },
  { path: "/recuperar-contrasena", Component: RecuperarContrasena },
  { path: "/restablecer-contrasena", Component: RestablecerContrasena },

  // Onboarding
  { path: "/onboarding", Component: Onboarding },

  // Pantalla de carga
  { path: "/cargando", Component: LoadingScreen },

  // Centro de ayuda
  {
    path: "/documentacion",
    Component: DocsLayout,
    children: [
      { index: true, Component: HomeView },
      { path: "faq", Component: FaqView },
      { path: ":cat", Component: CategoryView },
      { path: ":cat/:art", Component: ArticleView },
    ],
  },

  // Dashboard
  {
    path: "/dashboard",
    Component: Layout,
    children: [
      { index: true, Component: Principal },
      // { path: "resumen", Component: Resumen },
      { path: "inventario", Component: Inventario },
      { path: "historial", Component: HistorialMovimientos },
      { path: "configuracion", Component: Configuracion },
      { path: "ayuda", Component: Ayuda },
    ],
  },
]);
