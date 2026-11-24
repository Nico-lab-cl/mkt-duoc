import { useState } from 'react';

/**
 * Monigote de la trivia. `a` = { color, forma, ojos, sombrero, accesorio }.
 * `expresion`: 'neutral' | 'feliz' | 'triste' | 'wow' | 'dormido'.
 */
export default function Avatar({ a, expresion = 'neutral', className = 'w-16 h-16', titulo }) {
  const av = a || { color: '#8b5cf6', forma: 'gota', ojos: 'puntos', sombrero: 'ninguno', accesorio: 'ninguno' };
  const oscuro = '#1e1b4b';
  const brazosArriba = expresion === 'feliz';
  const top = av.forma === 'fantasma' ? 30 : 34;

  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={titulo || 'Avatar'} overflow="visible">
      <ellipse cx="60" cy="115" rx="28" ry="4" fill="#000" opacity="0.18" />

      {/* Brazos (detrás del cuerpo) */}
      {brazosArriba ? (
        <>
          <rect x="8" y="30" width="12" height="30" rx="6" fill={av.color} transform="rotate(-25 14 45)" />
          <rect x="100" y="30" width="12" height="30" rx="6" fill={av.color} transform="rotate(25 106 45)" />
        </>
      ) : (
        <>
          <rect x="14" y="68" width="12" height="26" rx="6" fill={av.color} transform="rotate(20 20 81)" />
          <rect x="94" y="68" width="12" height="26" rx="6" fill={av.color} transform="rotate(-20 100 81)" />
        </>
      )}

      {/* Cuerpo */}
      {av.forma === 'gota' && <ellipse cx="60" cy="72" rx="36" ry="38" fill={av.color} />}
      {av.forma === 'cubo' && <rect x="24" y="34" width="72" height="76" rx="18" fill={av.color} />}
      {av.forma === 'fantasma' && (
        <path d="M24 70 Q24 30 60 30 Q96 30 96 70 L96 108 Q88 100 80 108 Q72 100 64 108 Q56 100 48 108 Q40 100 32 108 Q28 104 24 108 Z" fill={av.color} />
      )}
      <ellipse cx="60" cy="88" rx="20" ry="14" fill="#fff" opacity="0.16" />

      {/* Accesorios de cuello (debajo de la cara) */}
      {av.accesorio === 'bufanda' && (
        <>
          <rect x="30" y="92" width="60" height="10" rx="5" fill="#f8fafc" />
          <rect x="70" y="96" width="10" height="16" rx="4" fill="#e2e8f0" />
        </>
      )}
      {av.accesorio === 'corbata' && (
        <g fill={oscuro}>
          <polygon points="48,94 60,99 48,104" />
          <polygon points="72,94 60,99 72,104" />
          <circle cx="60" cy="99" r="3" />
        </g>
      )}

      {/* Mejillas */}
      <circle cx="40" cy="76" r="5" fill="#fff" opacity={expresion === 'triste' ? 0.1 : 0.3} />
      <circle cx="80" cy="76" r="5" fill="#fff" opacity={expresion === 'triste' ? 0.1 : 0.3} />

      <Ojos tipo={av.ojos} expresion={expresion} oscuro={oscuro} />
      <Boca expresion={expresion} oscuro={oscuro} />

      {av.accesorio === 'bigote' && (
        <path d="M44 76 Q52 70 60 75 Q68 70 76 76 Q68 80 60 77 Q52 80 44 76 Z" fill={oscuro} />
      )}

      <Sombrero tipo={av.sombrero} top={top} oscuro={oscuro} />

      {av.accesorio === 'audifonos' && (
        <g>
          <path d={`M26 62 Q26 ${top - 6} 60 ${top - 6} Q94 ${top - 6} 94 62`} stroke={oscuro} strokeWidth="5" fill="none" />
          <rect x="18" y="54" width="12" height="20" rx="5" fill={oscuro} />
          <rect x="90" y="54" width="12" height="20" rx="5" fill={oscuro} />
        </g>
      )}
    </svg>
  );
}

function Ojos({ tipo, expresion, oscuro }) {
  const xs = [46, 74];
  let ojos;
  if (expresion === 'dormido') {
    ojos = xs.map((x) => <path key={x} d={`M${x - 6} 62 Q${x} 66 ${x + 6} 62`} stroke={oscuro} strokeWidth="3" fill="none" strokeLinecap="round" />);
  } else if (expresion === 'feliz') {
    ojos = xs.map((x) => <path key={x} d={`M${x - 6} 64 Q${x} 54 ${x + 6} 64`} stroke={oscuro} strokeWidth="3.5" fill="none" strokeLinecap="round" />);
  } else {
    const k = expresion === 'wow' ? 1.3 : 1;
    ojos = xs.map((x) => {
      if (tipo === 'grandes')
        return (
          <g key={x}>
            <circle cx={x} cy="60" r={9 * k} fill="#fff" />
            <circle cx={x + 1} cy="61" r={4.5 * k} fill={oscuro} />
          </g>
        );
      if (tipo === 'anime')
        return (
          <g key={x}>
            <ellipse cx={x} cy="60" rx={7.5 * k} ry={9.5 * k} fill="#fff" />
            <ellipse cx={x} cy="61" rx={5.5 * k} ry={7 * k} fill={oscuro} />
            <circle cx={x - 2} cy="57" r="2.2" fill="#fff" />
          </g>
        );
      return <circle key={x} cx={x} cy="60" r={4.5 * k} fill={oscuro} />;
    });
  }
  return (
    <g>
      {ojos}
      {expresion === 'triste' && (
        <>
          <path d="M38 50 L52 54" stroke={oscuro} strokeWidth="3" strokeLinecap="round" />
          <path d="M82 50 L68 54" stroke={oscuro} strokeWidth="3" strokeLinecap="round" />
          <path d="M76 68 Q73 75 76 78 Q79 75 76 68 Z" fill="#7dd3fc" />
        </>
      )}
      {tipo === 'lentes' && (
        <g stroke={oscuro} strokeWidth="3" fill="#fff" fillOpacity="0.15">
          <circle cx="46" cy="60" r="11" />
          <circle cx="74" cy="60" r="11" />
          <path d="M57 60 L63 60" />
        </g>
      )}
    </g>
  );
}

function Boca({ expresion, oscuro }) {
  if (expresion === 'feliz')
    return (
      <g>
        <path d="M46 80 Q60 100 74 80 Z" fill={oscuro} />
        <path d="M53 90 Q60 96 67 90 Q60 87 53 90 Z" fill="#fb7185" />
      </g>
    );
  if (expresion === 'triste') return <path d="M50 90 Q60 81 70 90" stroke={oscuro} strokeWidth="3.5" fill="none" strokeLinecap="round" />;
  if (expresion === 'wow') return <ellipse cx="60" cy="86" rx="5" ry="7" fill={oscuro} />;
  if (expresion === 'dormido') return <path d="M54 86 L66 86" stroke={oscuro} strokeWidth="3" strokeLinecap="round" />;
  return <path d="M51 83 Q60 91 69 83" stroke={oscuro} strokeWidth="3.5" fill="none" strokeLinecap="round" />;
}

function Sombrero({ tipo, top, oscuro }) {
  const t = top;
  switch (tipo) {
    case 'gorro':
      return (
        <g>
          <path d={`M30 ${t + 10} Q30 ${t - 18} 60 ${t - 18} Q90 ${t - 18} 90 ${t + 10} Z`} fill="#ef4444" />
          <rect x="27" y={t + 4} width="66" height="9" rx="4" fill="#f8fafc" />
          <circle cx="60" cy={t - 20} r="7" fill="#f8fafc" />
        </g>
      );
    case 'corona':
      return (
        <polygon
          points={`36,${t + 6} 36,${t - 14} 48,${t - 4} 60,${t - 20} 72,${t - 4} 84,${t - 14} 84,${t + 6}`}
          fill="#facc15"
          stroke="#ca8a04"
          strokeWidth="2"
        />
      );
    case 'gorra':
      return (
        <g>
          <path d={`M32 ${t + 8} Q32 ${t - 14} 60 ${t - 14} Q88 ${t - 14} 88 ${t + 8} Z`} fill="#2563eb" />
          <path d={`M60 ${t + 4} L104 ${t + 8} Q104 ${t + 14} 88 ${t + 12} L60 ${t + 10} Z`} fill="#1d4ed8" />
          <circle cx="60" cy={t - 14} r="3" fill="#1d4ed8" />
        </g>
      );
    case 'cuernos':
      return (
        <g fill="#fde68a" stroke="#d97706" strokeWidth="2">
          <path d={`M38 ${t + 8} Q30 ${t - 12} 40 ${t - 18} Q42 ${t - 6} 48 ${t + 4} Z`} />
          <path d={`M82 ${t + 8} Q90 ${t - 12} 80 ${t - 18} Q78 ${t - 6} 72 ${t + 4} Z`} />
        </g>
      );
    case 'flor':
      return (
        <g transform={`translate(82 ${t + 2})`}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="0" cy="-8" rx="5" ry="8" fill="#f9a8d4" transform={`rotate(${r})`} />
          ))}
          <circle r="5" fill="#facc15" />
        </g>
      );
    case 'antena':
      return (
        <g>
          <path d={`M60 ${t + 2} L60 ${t - 18}`} stroke={oscuro} strokeWidth="3" />
          <circle cx="60" cy={t - 22} r="6" fill="#facc15" stroke={oscuro} strokeWidth="2" />
        </g>
      );
    default:
      return null;
  }
}

const COLORES_CONFETI = ['#f43f5e', '#f97316', '#facc15', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899', '#ffffff'];

/** Lluvia de confeti sobre toda la pantalla (decorativa, no bloquea clics). */
export function Confeti({ cantidad = 40 }) {
  const [piezas] = useState(() =>
    Array.from({ length: cantidad }, (_, i) => ({
      i,
      left: Math.random() * 100,
      delay: Math.random() * 1.2,
      dur: 2.2 + Math.random() * 2,
      color: COLORES_CONFETI[i % COLORES_CONFETI.length],
      w: 6 + Math.random() * 6,
      redondo: Math.random() > 0.6
    }))
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-40" aria-hidden="true">
      {piezas.map((p) => (
        <span
          key={p.i}
          className="tv-confeti absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.w,
            height: p.redondo ? p.w : p.w * 1.6,
            background: p.color,
            borderRadius: p.redondo ? '50%' : 2,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`
          }}
        />
      ))}
    </div>
  );
}

/** Animaciones CSS de la trivia (se respetan las preferencias de movimiento reducido). */
export function AnimEstilos() {
  return (
    <style>{`
      @keyframes tv-saltar { 0%,100% { transform: translateY(0) scaleY(1); } 15% { transform: translateY(0) scaleY(.9); } 50% { transform: translateY(-22%) scaleY(1.05); } }
      @keyframes tv-temblar { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-7%) rotate(-5deg); } 40% { transform: translateX(7%) rotate(5deg); } 60% { transform: translateX(-4%) rotate(-3deg); } 80% { transform: translateX(4%) rotate(3deg); } }
      @keyframes tv-flotar { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7%); } }
      @keyframes tv-pop { 0% { transform: scale(0) rotate(-25deg); opacity: 0; } 70% { transform: scale(1.18) rotate(4deg); opacity: 1; } 100% { transform: scale(1) rotate(0); } }
      @keyframes tv-caer { 0% { transform: translateY(-5vh) rotate(0); opacity: 1; } 100% { transform: translateY(105vh) rotate(720deg); opacity: .85; } }
      @keyframes tv-gota { 0% { transform: translateY(0); opacity: 0; } 25% { opacity: 1; } 100% { transform: translateY(70px); opacity: 0; } }
      @keyframes tv-fuego { 0%,100% { transform: scale(1) rotate(-6deg); } 50% { transform: scale(1.25) rotate(6deg); } }
      @keyframes tv-zzz { 0% { transform: translate(0,0) scale(.6); opacity: 0; } 30% { opacity: 1; } 100% { transform: translate(24px,-50px) scale(1.3); opacity: 0; } }
      @keyframes tv-subir { 0% { transform: translateY(24px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      @keyframes tv-latido { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
      .tv-saltar { animation: tv-saltar .65s ease-in-out infinite; transform-origin: 50% 100%; }
      .tv-saltar-rapido { animation: tv-saltar .45s ease-in-out infinite; transform-origin: 50% 100%; }
      .tv-temblar { animation: tv-temblar .7s ease-in-out 2; }
      .tv-flotar { animation: tv-flotar 2.4s ease-in-out infinite; }
      .tv-pop { animation: tv-pop .55s cubic-bezier(.2,1.4,.4,1) both; }
      .tv-confeti { animation: tv-caer 3s linear forwards; }
      .tv-gota { animation: tv-gota 1.1s linear infinite; }
      .tv-fuego { animation: tv-fuego .5s ease-in-out infinite; display: inline-block; }
      .tv-zzz { animation: tv-zzz 2s ease-out infinite; }
      .tv-subir { animation: tv-subir .5s ease-out both; }
      .tv-latido { animation: tv-latido 1s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .tv-saltar, .tv-saltar-rapido, .tv-temblar, .tv-flotar, .tv-pop, .tv-gota, .tv-fuego, .tv-zzz, .tv-subir, .tv-latido { animation: none !important; }
        .tv-confeti { display: none; }
      }
    `}</style>
  );
}
