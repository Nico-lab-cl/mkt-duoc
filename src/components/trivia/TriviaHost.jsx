import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Maximize, Play, Trophy, Users, X, Eye, ChevronRight, RotateCcw } from 'lucide-react';
import { authFetch } from '../eftLab/api';
import Forma from './forma';
import { OPCIONES, useSondeo, segundosRestantes } from './comun';

const CLAVE = 'trivia-host-pin';
const leerPin = () => {
  try {
    return window.sessionStorage.getItem(CLAVE);
  } catch {
    return null;
  }
};
const guardarPin = (pin) => {
  try {
    if (pin) window.sessionStorage.setItem(CLAVE, pin);
    else window.sessionStorage.removeItem(CLAVE);
  } catch {
    /* sin almacenamiento: solo se pierde la reanudación al recargar */
  }
};

const EJES = [
  ['', 'Los 3 ejes'],
  ['1', 'Eje 1 · Flywheel y diseño'],
  ['2', 'Eje 2 · SEO'],
  ['3', 'Eje 3 · Automatización']
];

export default function TriviaHost({ user }) {
  const [pin, setPin] = useState(leerPin);
  const [g, setG] = useState(null);
  const [error, setError] = useState('');
  const [finEn, setFinEn] = useState(0);
  const [, setTick] = useState(0);

  useSondeo(
    async () => {
      try {
        const d = await authFetch(user, `/api/trivia/${pin}/host`);
        setG(d);
        setFinEn(Date.now() + d.restanteMs);
        setError('');
      } catch (e) {
        if (e.status === 404) {
          guardarPin(null);
          setPin(null);
          setG(null);
        } else setError(e.message);
      }
    },
    1000,
    !!pin
  );

  // Refresco visual del reloj entre consultas
  useEffect(() => {
    if (g?.fase !== 'pregunta') return;
    const t = window.setInterval(() => setTick((x) => x + 1), 250);
    return () => window.clearInterval(t);
  }, [g?.fase]);

  const accion = async (a, extra = {}) => {
    try {
      await authFetch(user, `/api/trivia/${pin}/host/accion`, { method: 'POST', body: JSON.stringify({ accion: a, ...extra }) });
      const d = await authFetch(user, `/api/trivia/${pin}/host`);
      setG(d);
      setFinEn(Date.now() + d.restanteMs);
    } catch (e) {
      setError(e.message);
    }
  };

  const crear = async (cfg) => {
    try {
      const d = await authFetch(user, '/api/trivia', { method: 'POST', body: JSON.stringify(cfg) });
      guardarPin(d.pin);
      setPin(d.pin);
    } catch (e) {
      setError(e.message);
    }
  };

  const nueva = () => {
    if (g && g.fase !== 'final' && !window.confirm('¿Salir de esta trivia y crear otra?')) return;
    guardarPin(null);
    setPin(null);
    setG(null);
  };

  const pantallaCompleta = () => document.documentElement.requestFullscreen?.().catch(() => {});

  return (
    <div className="min-h-screen bg-indigo-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="font-bold tracking-wide">
          Trivia MKA1213 {pin && <span className="text-indigo-300 font-normal">· PIN {pin}</span>}
        </p>
        <div className="flex gap-2">
          <button onClick={pantallaCompleta} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20">
            <Maximize className="w-4 h-4" /> Pantalla completa
          </button>
          {pin && (
            <button onClick={nueva} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20">
              <RotateCcw className="w-4 h-4" /> Nueva trivia
            </button>
          )}
        </div>
      </div>
      {error && <p className="max-w-7xl mx-auto px-6 text-rose-300">{error}</p>}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        {!pin && <Configurar crear={crear} />}
        {pin && !g && <p className="text-indigo-200 mt-10 text-center">Cargando…</p>}
        {g?.fase === 'lobby' && <Lobby g={g} accion={accion} />}
        {g?.fase === 'pregunta' && <Pregunta g={g} restante={segundosRestantes(finEn)} accion={accion} />}
        {g?.fase === 'resultado' && <Resultado g={g} accion={accion} />}
        {g?.fase === 'ranking' && <Ranking g={g} accion={accion} />}
        {g?.fase === 'final' && <Final g={g} nueva={nueva} />}
      </main>
    </div>
  );
}

function Configurar({ crear }) {
  const [cfg, setCfg] = useState({ eje: '', cantidad: 10, segundos: 30 });
  const sel = 'mt-1 w-full rounded-lg p-2.5 bg-white text-slate-900';
  return (
    <section className="max-w-xl mx-auto mt-10 bg-white/10 rounded-2xl p-6 sm:p-8">
      <h2 className="text-3xl font-black">Nueva trivia en vivo</h2>
      <p className="text-indigo-200 mt-2">
        Preguntas al azar del banco de la evaluación (caso Smart Home). Los alumnos se unen escaneando un QR con el celular.
      </p>
      <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
        <label className="font-semibold">
          Ejes
          <select className={sel} value={cfg.eje} onChange={(e) => setCfg((c) => ({ ...c, eje: e.target.value }))}>
            {EJES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="font-semibold">
          Preguntas
          <select className={sel} value={cfg.cantidad} onChange={(e) => setCfg((c) => ({ ...c, cantidad: Number(e.target.value) }))}>
            {[5, 10, 15, 20].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label className="font-semibold">
          Segundos por pregunta
          <select className={sel} value={cfg.segundos} onChange={(e) => setCfg((c) => ({ ...c, segundos: Number(e.target.value) }))}>
            {[20, 30, 45, 60].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="text-xs text-indigo-300 mt-3">
        Son preguntas largas: 30 a 45 segundos les da tiempo de leer. La rapidez da más puntos (entre 500 y 1000 por acierto, más
        bono por racha).
      </p>
      <button
        onClick={() => crear({ ...cfg, eje: cfg.eje ? Number(cfg.eje) : null })}
        className="mt-6 w-full py-3.5 rounded-xl bg-amber-400 text-indigo-950 font-black text-lg hover:bg-amber-300"
      >
        Crear trivia
      </button>
    </section>
  );
}

function Lobby({ g, accion }) {
  const [qr, setQr] = useState('');
  const url = `${window.location.origin}/trivia?pin=${g.pin}`;
  useEffect(() => {
    QRCode.toDataURL(url, { width: 420, margin: 1, color: { dark: '#1e1b4b', light: '#ffffff' } }).then(setQr);
  }, [url]);

  const expulsar = (j) => window.confirm(`¿Sacar a «${j.nombre}» de la trivia?`) && accion('expulsar', { pid: j.id });

  return (
    <section className="mt-4">
      <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <p className="text-indigo-200 text-xl">Escanea el QR o entra a</p>
          <p className="text-3xl sm:text-4xl font-black mt-1 break-all">{window.location.host}/trivia</p>
          <p className="text-indigo-200 text-xl mt-6">PIN del juego</p>
          <p className="text-7xl sm:text-8xl font-black tracking-widest tabular-nums">{g.pin}</p>
        </div>
        <div className="bg-white rounded-3xl p-4 justify-self-center">
          {qr ? <img src={qr} alt={`QR para unirse a la trivia ${g.pin}`} className="w-64 h-64 sm:w-80 sm:h-80" /> : <div className="w-64 h-64 sm:w-80 sm:h-80" />}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="inline-flex items-center gap-2 text-2xl font-bold">
          <Users className="w-7 h-7" /> {g.jugadores.length} {g.jugadores.length === 1 ? 'jugador' : 'jugadores'}
        </p>
        <button
          onClick={() => accion('siguiente')}
          disabled={!g.jugadores.length}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-400 text-indigo-950 font-black text-xl hover:bg-amber-300 disabled:opacity-40"
        >
          <Play className="w-6 h-6" /> Comenzar
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {g.jugadores.length === 0 && <p className="text-indigo-300">Esperando jugadores…</p>}
        {g.jugadores.map((j) => (
          <button
            key={j.id}
            onClick={() => expulsar(j)}
            title="Sacar de la trivia"
            className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/15 hover:bg-rose-600 font-semibold text-lg"
          >
            {j.nombre} <X className="w-4 h-4 opacity-0 group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </section>
  );
}

function Encabezado({ g, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
      <p className="text-indigo-200 font-semibold">
        Pregunta {g.idx + 1} de {g.total} · {g.ejes?.[g.pregunta?.eje]}
      </p>
      {children}
    </div>
  );
}

function Pregunta({ g, restante, accion }) {
  const p = g.pregunta;
  return (
    <section>
      <Encabezado g={g}>
        <button onClick={() => accion('revelar')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">
          <Eye className="w-4 h-4" /> Revelar ya
        </button>
      </Encabezado>
      <div className="mt-4 bg-white text-slate-900 rounded-2xl p-6 sm:p-8">
        <p className="text-2xl sm:text-3xl font-bold leading-snug">{p.q}</p>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black tabular-nums ${restante <= 5 ? 'bg-rose-500' : 'bg-indigo-600'}`}>
          {restante}
        </div>
        <p className="text-right">
          <span className="block text-5xl font-black tabular-nums">
            {g.respondidas}/{g.jugadores.length}
          </span>
          <span className="text-indigo-200">respondieron</span>
        </p>
      </div>
      <div className="mt-5 grid md:grid-cols-2 gap-3">
        {p.ops.map((o, i) => (
          <div key={i} className={`${OPCIONES[i].bg} rounded-xl p-4 sm:p-5 flex gap-3 items-start text-lg sm:text-xl font-semibold`}>
            <Forma i={i} className="w-8 h-8 shrink-0 mt-0.5" />
            <span>{o}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Resultado({ g, accion }) {
  const p = g.pregunta;
  const max = Math.max(1, ...p.conteo);
  const ultima = g.idx + 1 >= g.total;
  return (
    <section>
      <Encabezado g={g}>
        <div className="flex gap-2">
          <button onClick={() => accion('ranking')} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-amber-400 text-indigo-950 font-bold hover:bg-amber-300">
            <Trophy className="w-5 h-5" /> Ver ranking
          </button>
          <button onClick={() => accion('siguiente')} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 font-bold">
            {ultima ? 'Ver podio' : 'Siguiente'} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </Encabezado>
      <div className="mt-4 bg-white text-slate-900 rounded-2xl p-5 sm:p-6">
        <p className="text-xl sm:text-2xl font-bold leading-snug">{p.q}</p>
      </div>

      <div className="mt-6 flex items-end justify-center gap-4 sm:gap-8 h-44">
        {p.conteo.map((n, i) => (
          <div key={i} className="flex flex-col items-center justify-end h-full w-16 sm:w-24">
            <span className="text-2xl font-black mb-1">{n}</span>
            <div
              className={`${OPCIONES[i].bg} w-full rounded-t-lg ${i === p.ok ? '' : 'opacity-40'}`}
              style={{ height: `${Math.max(6, (n / max) * 100)}%` }}
            />
            <Forma i={i} className={`w-7 h-7 mt-2 ${i === p.ok ? '' : 'opacity-40'}`} />
          </div>
        ))}
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-3">
        {p.ops.map((o, i) => (
          <div
            key={i}
            className={`${OPCIONES[i].bg} rounded-xl p-4 flex gap-3 items-start text-lg font-semibold ${
              i === p.ok ? 'ring-4 ring-white' : 'opacity-35'
            }`}
          >
            <Forma i={i} className="w-7 h-7 shrink-0 mt-0.5" />
            <span>
              {o}
              {i === p.ok && ' ✓'}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-5 bg-white/10 rounded-xl p-4 text-lg text-indigo-50">
        <b>Por qué:</b> {p.exp}
      </p>
    </section>
  );
}

function Ranking({ g, accion }) {
  const top = g.jugadores.slice(0, 5);
  const ultima = g.idx + 1 >= g.total;
  return (
    <section className="max-w-3xl mx-auto mt-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-4xl font-black">Ranking</h2>
        <button onClick={() => accion('siguiente')} className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-amber-400 text-indigo-950 font-black text-lg hover:bg-amber-300">
          {ultima ? 'Ver podio' : 'Siguiente pregunta'} <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <p className="text-indigo-200 mt-1">
        Después de la pregunta {g.idx + 1} de {g.total}
      </p>
      <ol className="mt-6 space-y-3">
        {top.map((j, n) => (
          <li key={j.id} className={`flex items-center gap-4 rounded-xl px-5 py-4 text-2xl font-bold ${n === 0 ? 'bg-amber-400 text-indigo-950' : 'bg-white/10'}`}>
            <span className="w-8 tabular-nums">{n + 1}</span>
            <span className="flex-1 truncate">{j.nombre}</span>
            {j.racha >= 2 && <span className="text-base font-semibold">🔥 {j.racha}</span>}
            <span className="tabular-nums">{j.puntos}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Puesto({ j, lugar, alto, color }) {
  return (
    <div className="flex flex-col items-center w-28 sm:w-40">
      <p className="font-black text-xl sm:text-2xl text-center truncate w-full">{j?.nombre || '—'}</p>
      <p className="text-indigo-200 tabular-nums">{j ? `${j.puntos} pts` : ''}</p>
      <div className={`${color} ${alto} w-full rounded-t-xl mt-2 flex items-start justify-center pt-3 text-4xl font-black text-indigo-950`}>
        {lugar}
      </div>
    </div>
  );
}

function Final({ g, nueva }) {
  const [p1, p2, p3] = g.jugadores;
  return (
    <section className="mt-6">
      <h2 className="text-center text-5xl font-black">¡Podio!</h2>
      <div className="mt-10 flex items-end justify-center gap-3 sm:gap-6">
        <Puesto j={p2} lugar="2" alto="h-32" color="bg-slate-300" />
        <Puesto j={p1} lugar="1" alto="h-44" color="bg-amber-400" />
        <Puesto j={p3} lugar="3" alto="h-24" color="bg-orange-400" />
      </div>
      <div className="max-w-2xl mx-auto mt-10">
        <h3 className="font-bold text-indigo-200">Ranking completo</h3>
        <ol className="mt-2 divide-y divide-white/10 bg-white/5 rounded-xl">
          {g.jugadores.map((j, n) => (
            <li key={j.id} className="flex justify-between px-4 py-2">
              <span>
                {n + 1}. {j.nombre}
              </span>
              <span className="tabular-nums">{j.puntos}</span>
            </li>
          ))}
        </ol>
        <button onClick={nueva} className="mt-6 w-full py-3 rounded-xl bg-amber-400 text-indigo-950 font-black text-lg hover:bg-amber-300">
          Nueva trivia
        </button>
      </div>
    </section>
  );
}
