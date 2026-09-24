import { useEffect } from 'react';

// El simulador aplica `overflow-hidden` al body porque es de pantalla fija.
// El formulario y el panel son páginas largas, así que devolvemos el scroll
// mientras están montados y restauramos el estado original al salir.
export default function usePageScroll() {
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);
}
