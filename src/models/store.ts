import type { DatabaseShape } from "@/entities";

type Listener = () => void;

// Guarda los datos de la app en memoria
class Store {
  private state!: DatabaseShape;
  private listeners = new Set<Listener>();

  // Carga los datos al arrancar
  init = async (): Promise<void> => {
    const res = await fetch("/api/db");
    this.state = (await res.json()) as DatabaseShape;
  };

  getState = (): DatabaseShape => this.state;

  // Avisa a los componentes cuando cambian los datos
  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  // Guarda los datos nuevos y avisa a los componentes
  setState = (next: DatabaseShape): void => {
    this.state = next;
    void fetch("/api/db", { method: "POST", body: JSON.stringify(next) });
    this.listeners.forEach((l) => l());
  };
}

export const store = new Store();
