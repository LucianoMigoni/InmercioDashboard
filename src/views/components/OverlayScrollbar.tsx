import { useEffect, useRef } from "react";
import type Lenis from "lenis";

// Barra de scroll que flota sobre el contenido
export function OverlayScrollbar({
  target,
  lenis,
}: {
  target?: React.RefObject<HTMLElement | null>;
  lenis?: React.RefObject<Lenis | null>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const getEl = () => target?.current ?? null;

    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let dragging = false;
    let startY = 0;
    let startScroll = 0;

    // Medidas del contenedor
    const read = () => {
      const el = getEl();
      if (el) {
        const rect = el.getBoundingClientRect();
        return {
          top: rect.top,
          // Distancia al borde derecho de la ventana
          right: window.innerWidth - rect.right,
          view: el.clientHeight,
          full: el.scrollHeight,
          pos: el.scrollTop,
        };
      }
      const doc = document.documentElement;
      return { top: 0, right: 0, view: window.innerHeight, full: doc.scrollHeight, pos: window.scrollY };
    };

    const setScroll = (y: number) => {
      const el = getEl();
      if (el) {
        el.scrollTop = y;
        return;
      }
      if (lenis?.current) lenis.current.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    };

    const showThenFade = () => {
      track.classList.add("visible");
      clearTimeout(hideTimer);
      if (!dragging) hideTimer = setTimeout(() => track.classList.remove("visible"), 1100);
    };

    const update = () => {
      const { top, right, view, full, pos } = read();
      // Ubica la barra sobre la parte visible
      track.style.top = `${top + 4}px`;
      track.style.right = `${right + 4}px`;
      track.style.height = `${view - 8}px`;
      const trackH = view - 8;
      const scrollable = full - view;
      if (scrollable <= 1 || trackH <= 0) {
        track.classList.remove("visible");
        return;
      }
      const thumbH = Math.max(40, (view / full) * trackH);
      const progress = Math.min(1, Math.max(0, pos / scrollable));
      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translateY(${progress * (trackH - thumbH)}px)`;
      showThenFade();
    };

    const onThumbDown = (e: MouseEvent) => {
      dragging = true;
      startY = e.clientY;
      startScroll = read().pos;
      document.body.style.userSelect = "none";
      track.classList.add("visible");
      clearTimeout(hideTimer);
      e.preventDefault();
    };
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      const { view, full } = read();
      const trackH = view - 8;
      const scrollable = full - view;
      const thumbH = Math.max(40, (view / full) * trackH);
      const delta = ((e.clientY - startY) / (trackH - thumbH)) * scrollable;
      setScroll(Math.min(scrollable, Math.max(0, startScroll + delta)));
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.userSelect = "";
      showThenFade();
    };

    const scrollSource: Window | HTMLElement = getEl() ?? window;
    scrollSource.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    thumb.addEventListener("mousedown", onThumbDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    // Se actualiza cuando cambia el tamaño del contenido
    const ro = new ResizeObserver(update);
    const el = getEl();
    if (el) ro.observe(el);
    ro.observe(document.body);

    update();
    return () => {
      clearTimeout(hideTimer);
      scrollSource.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      thumb.removeEventListener("mousedown", onThumbDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      ro.disconnect();
    };
  }, [target, lenis]);

  return (
    <div className="overlay-scrollbar" ref={trackRef} aria-hidden="true">
      <div className="overlay-scrollbar-thumb" ref={thumbRef} />
    </div>
  );
}
