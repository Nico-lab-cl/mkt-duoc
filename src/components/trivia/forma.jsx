import { OPCIONES } from './comun';

/** Figura de cada alternativa: triángulo, rombo, círculo y cuadrado. */
export default function Forma({ i, className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label={OPCIONES[i].nombre} fill="currentColor">
      {i === 0 && <polygon points="12,3 22,21 2,21" />}
      {i === 1 && <polygon points="12,2 22,12 12,22 2,12" />}
      {i === 2 && <circle cx="12" cy="12" r="10" />}
      {i === 3 && <rect x="3" y="3" width="18" height="18" rx="2" />}
    </svg>
  );
}
