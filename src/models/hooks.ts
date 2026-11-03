import { useSyncExternalStore } from "react";
import { store } from "./store";
import type { DatabaseShape } from "@/entities";

// Devuelve los datos y vuelve a renderizar cuando cambian
export function useDatabase(): DatabaseShape {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}
