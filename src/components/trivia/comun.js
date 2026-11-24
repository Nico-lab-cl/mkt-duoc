import { useEffect, useRef } from 'react';

// Colores y figuras de las 4 alternativas (iguales en la pantalla y en los celulares)
export const OPCIONES = [
  { bg: 'bg-rose-600', hover: 'hover:bg-rose-700', nombre: 'triángulo' },
  { bg: 'bg-sky-600', hover: 'hover:bg-sky-700', nombre: 'rombo' },
  { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', nombre: 'círculo' },
  { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', nombre: 'cuadrado' }
];

/** Ejecuta `fn` ahora y luego cada `ms` mientras `activo` sea verdadero. */
export function useSondeo(fn, ms, activo = true) {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  });
  useEffect(() => {
    if (!activo) return;
    let vivo = true;
    let t;
    const tick = async () => {
      if (!vivo) return;
      await ref.current();
      if (vivo) t = window.setTimeout(tick, ms);
    };
    t = window.setTimeout(tick, 0);
    return () => {
      vivo = false;
      window.clearTimeout(t);
    };
  }, [ms, activo]);
}

/** Cuenta regresiva local a partir de los ms que informó el servidor. */
export const segundosRestantes = (finEn) => Math.max(0, Math.ceil((finEn - Date.now()) / 1000));
