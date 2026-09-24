import { useState } from 'react';

/**
 * Gráfico de torta (dona) en SVG, sin librerías.
 *
 * - Al pasar el mouse por una porción o por su fila de la leyenda, el centro
 *   muestra esa porción; en reposo muestra el total.
 * - La leyenda siempre lleva etiqueta, cantidad y % para que el color nunca sea
 *   la única forma de identificar una porción.
 * - `onSelect` es opcional: hace clic-ables las porciones (filtro por dimensión).
 */

const SIZE = 180;
const R_OUT = 86;
const R_IN = 56;
const C = SIZE / 2;

const polar = (r, angle) => [C + r * Math.sin(angle), C - r * Math.cos(angle)];

const arcPath = (start, end) => {
  const large = end - start > Math.PI ? 1 : 0;
  const [x0, y0] = polar(R_OUT, start);
  const [x1, y1] = polar(R_OUT, end);
  const [x2, y2] = polar(R_IN, end);
  const [x3, y3] = polar(R_IN, start);
  return `M${x0} ${y0} A${R_OUT} ${R_OUT} 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A${R_IN} ${R_IN} 0 ${large} 0 ${x3} ${y3}Z`;
};

const pct = (v, total) => (total ? Math.round((v / total) * 100) : 0);

const Donut = ({ data, unit = '', centerLabel = 'Total', selected, onSelect, emptyText = 'Sin datos' }) => {
  const [hover, setHover] = useState(null);
  const slices = data.filter((d) => d.value > 0);
  const total = slices.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return <p className="py-10 text-center text-[13px] text-slate-400">{emptyText}</p>;
  }

  const arcs = slices.reduce((acc, d) => {
    const start = acc.length ? acc[acc.length - 1].end : 0;
    return [...acc, { ...d, start, end: start + (d.value / total) * Math.PI * 2 }];
  }, []);

  const active = arcs.find((a) => a.id === hover) || arcs.find((a) => a.id === selected);
  const dimmed = (id) => (hover || selected) && id !== (hover || selected);

  // La leyenda va al lado solo si la tarjeta es ancha; en tarjetas angostas va abajo para no cortar etiquetas
  return (
    <div className="@container">
      <div className="flex flex-col items-center gap-4 @lg:flex-row @lg:gap-5">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-44 w-44 shrink-0"
          role="img"
          aria-label={arcs.map((a) => `${a.label}: ${a.value}`).join(', ')}
        >
          {arcs.length === 1 ? (
            <circle
              cx={C}
              cy={C}
              r={(R_OUT + R_IN) / 2}
              fill="none"
              stroke={arcs[0].color}
              strokeWidth={R_OUT - R_IN}
              onMouseEnter={() => setHover(arcs[0].id)}
              onMouseLeave={() => setHover(null)}
            />
          ) : (
            arcs.map((a) => (
              <path
                key={a.id}
                d={arcPath(a.start, a.end)}
                fill={a.color}
                stroke="#fff"
                strokeWidth={2}
                opacity={dimmed(a.id) ? 0.3 : 1}
                className={`transition-opacity ${onSelect ? 'cursor-pointer' : ''}`}
                onMouseEnter={() => setHover(a.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onSelect?.(a.id === selected ? null : a.id)}
              />
            ))
          )}
          <text x={C} y={C - 4} textAnchor="middle" className="fill-slate-900 text-[26px] font-black">
            {active ? active.value : total}
          </text>
          <text x={C} y={C + 16} textAnchor="middle" className="fill-slate-500 text-[10.5px] font-semibold">
            {active ? `${pct(active.value, total)}% del total` : `${centerLabel}${unit}`}
          </text>
        </svg>

        <ul className="w-full min-w-0 space-y-1">
          {arcs.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onMouseEnter={() => setHover(a.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onSelect?.(a.id === selected ? null : a.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px] transition ${
                  onSelect ? 'hover:bg-slate-50' : 'cursor-default'
                } ${selected === a.id ? 'bg-slate-100' : ''} ${dimmed(a.id) ? 'opacity-50' : ''}`}
              >
                <span className="h-3 w-3 shrink-0 rounded-[3px]" style={{ backgroundColor: a.color }} />
                <span className="min-w-0 flex-1 truncate font-medium text-slate-700">{a.label}</span>
                <span className="shrink-0 font-bold text-slate-900">{a.value}</span>
                <span className="w-10 shrink-0 text-right text-slate-500">{pct(a.value, total)}%</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Donut;
