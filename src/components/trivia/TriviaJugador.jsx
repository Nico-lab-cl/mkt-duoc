import { useEffect, useRef, useState } from 'react';
import { Trophy, Dices } from 'lucide-react';
import usePageScroll from '../feedbackDocente/usePageScroll';
import Forma from './forma';
import Avatar, { Confeti, AnimEstilos } from './Avatar';
import { OPCIONES, AVATAR_OPCIONES, avatarAlAzar, useSondeo, segundosRestantes } from './comun';

/**
 * Trivia en vivo desde el celular. Ruta pública: /trivia?pin=123456
 * No requiere cuenta: el alumno se une con un nombre y un avatar; su sesión
 * queda en este navegador para poder recargar sin perder los puntos.
 */

const clave = (pin) => `trivia-jugador-${pin}`;
const CLAVE_AVATAR = 'trivia-avatar';

const leer = (k) => {
  try {
    return JSON.parse(window.localStorage.getItem(k) || 'null');
  } catch {
    return null;
  }
};
const guardar = (k, v) => {
  try {
    if (v) window.localStorage.setItem(k, JSON.stringify(v));
    else window.localStorage.removeItem(k);
  } catch {
    /* sin almacenamiento: funciona igual, pero recargar obliga a unirse de nuevo */
  }
};

const pedir = async (url, opts = {}) => {
  const r = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json' } });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = new Error(d.error || 'Error de conexión');
    e.status = r.status;
    e.code = d.code;
    throw e;
  }
  return d;
};

export default function TriviaJugador() {
  usePageScroll();
  const [pin, setPin] = useState(() => new URLSearchParams(window.location.search).get('pin') || '');
  const [sesion, setSesion] = useState(() => {
    const p = new URLSearchParams(window.location.search).get('pin');
    return p ? leer(clave(p)) : null;
  });
  const [estado, setEstado] = useState(null);
  const [error, setError] = useState('');
  const [finEn, setFinEn] = useState(0);
  const [elegida, setElegida] = useState(null); // respuesta enviada en esta pregunta (optimista)
  const [, setTick] = useState(0);
  const idxRef = useRef(null);

  useEffect(() => {
    document.title = 'Trivia MKA1213';
  }, []);

  useSondeo(
    async () => {
      try {
        const d = await pedir(`/api/trivia/${pin}/jugador?pid=${sesion.pid}&tk=${sesion.tk}`);
        if (idxRef.current !== d.idx) setElegida(null);
        idxRef.current = d.idx;
        setEstado(d);
        setFinEn(Date.now() + d.restanteMs);
        setError('');
      } catch (e) {
        if (e.status === 404 || e.code === 'fuera') {
          guardar(clave(pin), null);
          setSesion(null);
          setEstado(null);
        }
        setError(e.message);
      }
    },
    1000,
    !!sesion
  );

  useEffect(() => {
    if (estado?.fase !== 'pregunta') return;
    const t = window.setInterval(() => setTick((x) => x + 1), 250);
    return () => window.clearInterval(t);
  }, [estado?.fase]);

  const unirse = async (pinIngresado, nombre, avatar) => {
    setError('');
    try {
      const d = await pedir(`/api/trivia/${pinIngresado}/unirse`, { method: 'POST', body: JSON.stringify({ nombre, avatar }) });
      guardar(clave(pinIngresado), d);
      guardar(CLAVE_AVATAR, d.avatar);
      window.history.replaceState(null, '', `/trivia?pin=${pinIngresado}`);
      setPin(pinIngresado);
      setSesion(d);
    } catch (e) {
      setError(e.message);
    }
  };

  const responder = async (op) => {
    if (elegida !== null) return;
    setElegida(op);
    try {
      await pedir(`/api/trivia/${pin}/responder`, { method: 'POST', body: JSON.stringify({ pid: sesion.pid, tk: sesion.tk, op }) });
    } catch (e) {
      if (e.status !== 409) setElegida(null);
      setError(e.status === 409 ? '' : e.message);
    }
  };

  if (!sesion)
    return (
      <>
        <AnimEstilos />
        <Unirse pinInicial={pin} unirse={unirse} error={error} />
      </>
    );

  const e = estado;
  const avatar = e?.avatar || sesion.avatar;
  return (
    <div className="min-h-screen bg-indigo-950 text-white flex flex-col overflow-hidden">
      <AnimEstilos />
      <header className="px-4 py-2 flex justify-between items-center text-sm bg-black/20">
        <span className="flex items-center gap-2 font-bold truncate">
          <Avatar a={avatar} className="w-8 h-8" /> {sesion.nombre}
        </span>
        <span className="tabular-nums font-bold">{e ? `${e.puntos} pts` : ''}</span>
      </header>
      {error && <p className="px-4 pt-2 text-sm text-rose-300">{error}</p>}
      <main className="flex-1 flex flex-col px-4 py-4">
        {!e && <Centro>Conectando…</Centro>}
        {e?.fase === 'lobby' && (
          <Centro>
            <div className="tv-flotar">
              <Avatar a={avatar} className="w-40 h-40" />
            </div>
            <p className="text-3xl font-black mt-4">¡Estás dentro!</p>
            <p className="text-indigo-200 mt-2">Busca tu monigote en la pantalla. La trivia parte en un momento.</p>
            <p className="text-indigo-300 mt-6 text-sm">{e.jugadores} jugadores conectados</p>
          </Centro>
        )}
        {e?.fase === 'pregunta' &&
          (e.respondi === null && elegida === null ? (
            <Opciones e={e} restante={segundosRestantes(finEn)} responder={responder} />
          ) : (
            <Centro>
              <div className="tv-flotar">
                <Avatar a={avatar} expresion="wow" className="w-32 h-32" />
              </div>
              <p className="text-2xl font-black mt-4">Respuesta enviada</p>
              <p className="text-indigo-200 mt-2">Esperando a los demás… ({segundosRestantes(finEn)} s)</p>
            </Centro>
          ))}
        {(e?.fase === 'resultado' || e?.fase === 'ranking') && <Resultado key={e.idx} e={e} avatar={avatar} />}
        {e?.fase === 'final' && <Final e={e} avatar={avatar} />}
      </main>
    </div>
  );
}

function Centro({ children }) {
  return <div className="flex-1 flex flex-col items-center justify-center text-center px-2">{children}</div>;
}

const ETIQUETAS = {
  color: 'Color',
  forma: 'Forma',
  ojos: 'Ojos',
  sombrero: 'Sombrero',
  accesorio: 'Accesorio'
};

function Unirse({ pinInicial, unirse, error }) {
  const [pin, setPin] = useState(pinInicial);
  const [nombre, setNombre] = useState('');
  const [avatar, setAvatar] = useState(() => leer(CLAVE_AVATAR) || avatarAlAzar());
  const [enviando, setEnviando] = useState(false);
  const [giro, setGiro] = useState(0);

  const enviar = async (ev) => {
    ev.preventDefault();
    setEnviando(true);
    await unirse(pin.trim(), nombre, avatar);
    setEnviando(false);
  };
  const cambiar = (k, v) => setAvatar((a) => ({ ...a, [k]: v }));

  return (
    <div className="min-h-screen bg-indigo-950 text-white flex items-start justify-center px-4 py-6">
      <form onSubmit={enviar} className="w-full max-w-sm bg-white/10 rounded-2xl p-5">
        <p className="text-sm text-indigo-300 font-semibold">MKA1213 · Caso Smart Home</p>
        <h1 className="text-3xl font-black mt-1">Trivia en vivo</h1>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold">
            PIN
            <input
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="mt-1 w-full rounded-xl p-2.5 bg-white text-xl font-black tracking-widest text-center text-indigo-950 placeholder:text-slate-300"
              placeholder="000000"
              required
            />
          </label>
          <label className="block text-sm font-semibold">
            Tu apodo
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value.slice(0, 20))}
              className="mt-1 w-full rounded-xl p-2.5 bg-white text-lg text-indigo-950 placeholder:text-slate-400"
              placeholder="Ej.: Cata R."
              autoComplete="nickname"
              required
            />
          </label>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div key={giro} className="tv-pop bg-white/10 rounded-2xl p-2">
            <Avatar a={avatar} expresion="feliz" className="w-24 h-24" />
          </div>
          <div>
            <p className="font-bold">Diseña tu monigote</p>
            <p className="text-xs text-indigo-300">Aparecerá en la pantalla y celebrará (o sufrirá) contigo.</p>
            <button
              type="button"
              onClick={() => {
                setAvatar(avatarAlAzar());
                setGiro((g) => g + 1);
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-sm font-semibold"
            >
              <Dices className="w-4 h-4" /> Al azar
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {Object.entries(AVATAR_OPCIONES).map(([k, ops]) => (
            <div key={k}>
              <p className="text-xs font-semibold text-indigo-200">{ETIQUETAS[k]}</p>
              <div className="mt-1 flex gap-1.5 overflow-x-auto pb-1">
                {ops.map((v) => {
                  const sel = avatar[k] === v;
                  return k === 'color' ? (
                    <button
                      key={v}
                      type="button"
                      onClick={() => cambiar(k, v)}
                      aria-label={`Color ${v}`}
                      aria-pressed={sel}
                      className={`shrink-0 w-9 h-9 rounded-full border-4 ${sel ? 'border-white' : 'border-transparent'}`}
                      style={{ background: v }}
                    />
                  ) : (
                    <button
                      key={v}
                      type="button"
                      onClick={() => cambiar(k, v)}
                      aria-label={`${ETIQUETAS[k]}: ${v}`}
                      aria-pressed={sel}
                      className={`shrink-0 rounded-xl p-1 ${sel ? 'bg-white/30 ring-2 ring-white' : 'bg-white/5 hover:bg-white/15'}`}
                    >
                      <Avatar a={{ ...avatar, [k]: v }} className="w-11 h-11" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
        <button
          disabled={enviando || pin.length !== 6 || nombre.trim().length < 2}
          className="mt-5 w-full py-3.5 rounded-xl bg-amber-400 text-indigo-950 font-black text-lg disabled:opacity-50"
        >
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
        <p className="mt-3 text-xs text-indigo-300">Usa un apodo que tu profesor reconozca.</p>
      </form>
    </div>
  );
}

function Opciones({ e, restante, responder }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center text-sm text-indigo-200">
        <span>
          Pregunta {e.idx + 1} de {e.total}
        </span>
        <span className={`tabular-nums font-black text-lg ${restante <= 5 ? 'text-rose-300 tv-latido' : 'text-white'}`}>{restante} s</span>
      </div>
      <p className="mt-2 text-base leading-snug bg-white/10 rounded-xl p-3">{e.pregunta.q}</p>
      <div className="mt-3 grid gap-2 flex-1 content-start">
        {e.pregunta.ops.map((o, i) => (
          <button
            key={i}
            onClick={() => responder(i)}
            className={`${OPCIONES[i].bg} ${OPCIONES[i].hover} active:scale-[0.98] transition rounded-xl p-3 flex gap-3 items-start text-left text-sm font-semibold`}
          >
            <Forma i={i} className="w-6 h-6 shrink-0" />
            <span>{o}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const FRASES_MAL = ['¡La próxima es tuya!', 'Respira y vuelve con todo.', 'Revisa la correcta: sale en la prueba.', 'Nadie gana todas.'];

/** Decide la escena según el resultado, la rapidez y la racha. */
const escena = (r, racha, idx) => {
  const frac = r.ms !== null ? r.ms / (r.segundos * 1000) : 1;
  const seg = r.ms !== null ? (r.ms / 1000).toFixed(1).replace('.', ',') : null;
  if (r.acerte) {
    if (racha >= 3 && frac < 0.5)
      return { tipo: 'imparable', titulo: '¡IMPARABLE!', sub: `Racha de ${racha} y en ${seg} s`, fondo: 'from-amber-400 to-rose-500', expr: 'feliz', anim: 'tv-saltar-rapido', confeti: 90 };
    if (frac < 0.34)
      return { tipo: 'rapido', titulo: '¡Rapidísimo!', sub: `Respondiste en ${seg} s`, fondo: 'from-emerald-500 to-cyan-500', expr: 'feliz', anim: 'tv-saltar-rapido', confeti: 60 };
    if (frac > 0.75)
      return { tipo: 'justo', titulo: '¡Justo a tiempo!', sub: `Por un pelo: ${seg} s`, fondo: 'from-emerald-600 to-teal-600', expr: 'feliz', anim: 'tv-saltar', confeti: 15 };
    return { tipo: 'bien', titulo: '¡Correcto!', sub: `En ${seg} s`, fondo: 'from-emerald-500 to-emerald-700', expr: 'feliz', anim: 'tv-saltar', confeti: 35 };
  }
  if (r.respondi === null)
    return { tipo: 'dormido', titulo: '¡Se te pasó el tiempo!', sub: 'Tu monigote se quedó dormido', fondo: 'from-slate-600 to-slate-800', expr: 'dormido', anim: '', confeti: 0 };
  if (r.rachaRota >= 2)
    return { tipo: 'racha', titulo: 'Se cortó tu racha', sub: `Llevabas ${r.rachaRota} seguidas 💔`, fondo: 'from-rose-600 to-purple-800', expr: 'triste', anim: 'tv-temblar', confeti: 0 };
  return { tipo: 'mal', titulo: 'Incorrecto', sub: FRASES_MAL[idx % FRASES_MAL.length], fondo: 'from-rose-600 to-rose-800', expr: 'triste', anim: 'tv-temblar', confeti: 0 };
};

function Resultado({ e, avatar }) {
  const r = e.resultado;
  const s = escena(r, e.racha, e.idx);
  const cambio = r.posAnterior ? r.posAnterior - e.posicion : 0;

  return (
    <Centro>
      {s.confeti > 0 && <Confeti cantidad={s.confeti} />}
      <div className={`relative w-full rounded-3xl p-6 bg-gradient-to-br ${s.fondo} tv-pop`}>
        <div className="relative mx-auto w-40 h-40">
          <div className={s.anim}>
            <Avatar a={avatar} expresion={s.expr} className="w-40 h-40" />
          </div>
          {(s.tipo === 'mal' || s.tipo === 'racha') && <Nube />}
          {s.tipo === 'dormido' && (
            <span className="absolute right-2 top-2 text-2xl font-black tv-zzz" aria-hidden="true">
              Z
            </span>
          )}
          {s.tipo === 'imparable' && (
            <span className="absolute -right-2 top-0 text-4xl tv-fuego" aria-hidden="true">
              🔥
            </span>
          )}
        </div>
        <p className="text-3xl font-black mt-3">{s.titulo}</p>
        <p className="mt-1 text-white/90">{s.sub}</p>
        {r.acerte && <p className="text-2xl font-black mt-2 tv-subir">+{r.ganados} puntos</p>}
        {r.acerte && e.racha >= 2 && s.tipo !== 'imparable' && (
          <p className="mt-1 font-semibold">
            <span className="tv-fuego">🔥</span> Racha de {e.racha}
          </p>
        )}
      </div>

      {!r.acerte && (
        <div className="mt-4 w-full bg-white/10 rounded-xl p-4 text-left text-sm tv-subir">
          <p className="text-indigo-200 flex items-center gap-2">
            La correcta era <Forma i={r.ok} className="w-4 h-4" />
          </p>
          <p className="mt-1">{r.opCorrecta}</p>
        </div>
      )}

      <div className="mt-5 tv-subir" style={{ animationDelay: '.3s' }}>
        <p className="text-lg">
          Vas <b>{e.posicion}°</b> de {e.jugadores} · <b className="tabular-nums">{e.puntos}</b> pts
        </p>
        {cambio > 0 && <p className="text-emerald-300 font-bold">⬆ Subiste {cambio} {cambio === 1 ? 'puesto' : 'puestos'}</p>}
        {cambio < 0 && <p className="text-rose-300 font-bold">⬇ Bajaste {-cambio} {cambio === -1 ? 'puesto' : 'puestos'}</p>}
      </div>
    </Centro>
  );
}

function Nube() {
  return (
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24" aria-hidden="true">
      <svg viewBox="0 0 100 40" className="w-24">
        <path d="M20 35 Q5 35 8 24 Q8 12 24 14 Q30 2 46 6 Q60 0 68 12 Q86 10 88 24 Q96 34 80 35 Z" fill="#64748b" />
      </svg>
      {[18, 40, 62, 80].map((x, i) => (
        <span key={x} className="tv-gota absolute top-7 w-1 h-3 rounded-full bg-sky-300" style={{ left: `${x}%`, animationDelay: `${i * 0.25}s` }} />
      ))}
    </div>
  );
}

function Final({ e, avatar }) {
  const podio = e.posicion <= 3;
  return (
    <Centro>
      {podio && <Confeti cantidad={e.posicion === 1 ? 120 : 60} />}
      <div className={podio ? 'tv-saltar' : 'tv-flotar'}>
        <Avatar a={avatar} expresion={podio ? 'feliz' : 'neutral'} className="w-36 h-36" />
      </div>
      <p className="text-3xl font-black mt-3 flex items-center gap-2">
        {podio && <Trophy className="w-8 h-8 text-amber-300" />} Lugar {e.posicion} de {e.jugadores}
      </p>
      <p className="text-indigo-200 mt-1">{e.puntos} puntos</p>
      <ol className="mt-6 w-full max-w-xs space-y-2 text-left">
        {e.podio.map((j, n) => (
          <li key={j.nombre} className={`flex items-center gap-2 rounded-lg px-3 py-2 font-bold ${n === 0 ? 'bg-amber-400 text-indigo-950' : 'bg-white/10'}`}>
            <span className="w-5">{n + 1}.</span>
            <Avatar a={j.avatar} expresion="feliz" className="w-8 h-8" />
            <span className="flex-1 truncate">{j.nombre}</span>
            <span>{j.puntos}</span>
          </li>
        ))}
      </ol>
    </Centro>
  );
}
