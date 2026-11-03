import * as React from "react";

// Ancho maximo de celular
const MOBILE_BREAKPOINT = 768;

// Ancho maximo de pantalla mediana
export const COMPACT_BREAKPOINT = 1280;

// Indica si la pantalla es mas chica que el ancho dado
export function useIsBelow(breakpoint: number) {
  const [below, setBelow] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setBelow(window.innerWidth < breakpoint);
    mql.addEventListener("change", onChange);
    setBelow(window.innerWidth < breakpoint);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!below;
}

// Indica si es celular
export function useIsMobile() {
  return useIsBelow(MOBILE_BREAKPOINT);
}

// Indica si es una pantalla mediana
export function useIsCompact() {
  return useIsBelow(COMPACT_BREAKPOINT);
}
