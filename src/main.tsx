import { createRoot } from "react-dom/client";
import App from "./views/App.tsx";
import { store } from "@/models";
import "./visuals/styles/index.css";

// Carga los datos y despues muestra la app
store.init().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
