import { useEffect, useRef, useState } from 'react';
import { CircleCheck, CircleX, Hourglass, Trophy } from 'lucide-react';
import usePageScroll from '../feedbackDocente/usePageScroll';
import Forma from './forma';
import { OPCIONES, useSondeo, segundosRestantes } from './comun';

/**
 * Trivia en vivo desde el celular. Ruta pública: /trivia?pin=123456
 * No requiere cuenta: el alumno se une con un nombre y su sesión queda en
 * este navegador para poder recargar sin perder los puntos.
 */

const clave = (pin) => `trivia-jugador-${pin}`;
const leerSesion = (pin) => {
  try {
    return pin ? JSON.parse(window.localStorage.getItem(clave(pin)) || 'null') : null;
  } catch {
    return null;
  }
};
const guardarSesion = (pin, s) => {
  try {
    if (s) window.localStorage.setItem(clave(pin), JSON.stringify(s));
    else window.localStorage.removeItem(clave(pin));
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
  const [sesion, setSesion] = useState(() => leerSesion(new URLSearchParams(window.location.search).get('pin')));
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
          guardarSesion(pin, null);
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

  const unirse = async (pinIngresado, nombre) => {
    setError('');
    try {
      const d = await pedir(`/api/trivia/${pinIngresado}/unirse`, { method: 'POST', body: JSON.stringify({ nombre }) });
      guardarSesion(pinIngresado, d);
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

  if (!sesion) return <Unirse pinInicial={pin} unirse={unirse} error={error} />;

  const e = estado;
  return (
    <div className="min-h-screen bg-indigo-950 text-white flex flex-col">
      <header className="px-4 py-3 flex justify-between items-center text-sm bg-black/20">
        <span className="font-bold truncate">{sesion.nombre}</span>
        <span className="tabular-nums font-bold">{e ? `${e.puntos} pts` : ''}</span>
      </header>
      {error && <p className="px-4 pt-2 text-sm text-rose-300">{error}</p>}
      <main className="flex-1 flex flex-col px-4 py-4">
        {!e && <Centro>Conectando…</Centro>}
        {e?.fase === 'lobby' && (
          <Centro>
            <p className="text-3xl font-black">¡Estás dentro!</p>
            <p className="text-indigo-200 mt-2">Mira la pantalla del profesor. La trivia parte en un momento.</p>
            <p className="text-indigo-300 mt-6 text-sm">{e.jugadores} jugadores conectados</p>
          </Centro>
        )}
        {e?.fase === 'pregunta' &&
          (e.respondi === null && elegida === null ? (
            <Opciones e={e} restante={segundosRestantes(finEn)} responder={responder} />
          ) : (
            <Centro>
              <Hourglass className="w-14 h-14 text-amber-300 animate-pulse" />
              <p className="text-2xl font-black mt-4">Respuesta enviada</p>
              <p className="text-indigo-200 mt-2">Esperando a los demás… ({segundosRestantes(finEn)} s)</p>
            </Centro>
          ))}
        {(e?.fase === 'resultado' || e?.fase === 'ranking') && <Resultado e={e} />}
        {e?.fase === 'final' && (
          <Centro>
            <Trophy className="w-16 h-16 text-amber-300" />
            <p className="text-3xl font-black mt-3">Lugar {e.posicion} de {e.jugadores}</p>
            <p className="text-indigo-200 mt-1">{e.puntos} puntos</p>
            <ol className="mt-6 w-full max-w-xs space-y-2 text-left">
              {e.podio.map((j, n) => (
                <li key={j.nombre} className={`flex justify-between rounded-lg px-4 py-2 font-bold ${n === 0 ? 'bg-amber-400 text-indigo-950' : 'bg-white/10'}`}>
                  <span>
                    {n + 1}. {j.nombre}
                  </span>
                  <span>{j.puntos}</span>
                </li>
              ))}
            </ol>
          </Centro>
        )}
      </main>
    </div>
  );
}

function Centro({ children }) {
  return <div className="flex-1 flex flex-col items-center justify-center text-center px-2">{children}</div>;
}

function Unirse({ pinInicial, unirse, error }) {
  const [pin, setPin] = useState(pinInicial);
  const [nombre, setNombre] = useState('');
  const [enviando, setEnviando] = useState(false);
  const enviar = async (ev) => {
    ev.preventDefault();
    setEnviando(true);
    await unirse(pin.trim(), nombre);
    setEnviando(false);
  };
  return (
    <div className="min-h-screen bg-indigo-950 text-white flex items-center justify-center px-4">
      <form onSubmit={enviar} className="w-full max-w-sm bg-white/10 rounded-2xl p-6">
        <p className="text-sm text-indigo-300 font-semibold">MKA1213 · Caso Smart Home</p>
        <h1 className="text-3xl font-black mt-1">Trivia en vivo</h1>
        <label className="block mt-6 text-sm font-semibold">
          PIN del juego
          <input
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="mt-1 w-full rounded-xl p-3 bg-white text-2xl font-black tracking-widest text-center text-indigo-950 placeholder:text-slate-300"
            placeholder="000000"
            required
          />
        </label>
        <label className="block mt-4 text-sm font-semibold">
          Tu nombre o apodo
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value.slice(0, 20))}
            className="mt-1 w-full rounded-xl p-3 bg-white text-lg text-indigo-950 placeholder:text-slate-400"
            placeholder="Ej.: Cata R."
            autoComplete="nickname"
            required
          />
        </label>
        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
        <button
          disabled={enviando || pin.length !== 6 || nombre.trim().length < 2}
          className="mt-6 w-full py-3.5 rounded-xl bg-amber-400 text-indigo-950 font-black text-lg disabled:opacity-50"
        >
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
        <p className="mt-3 text-xs text-indigo-300">Usa un nombre que tu profesor reconozca: aparecerá en la pantalla.</p>
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
        <span className={`tabular-nums font-black text-lg ${restante <= 5 ? 'text-rose-300' : 'text-white'}`}>{restante} s</span>
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

function Resultado({ e }) {
  const r = e.resultado;
  const sin = r.respondi === null;
  return (
    <Centro>
      <div className={`w-full rounded-2xl p-6 ${r.acerte ? 'bg-emerald-600' : 'bg-rose-600'}`}>
        {r.acerte ? <CircleCheck className="w-14 h-14 mx-auto" /> : <CircleX className="w-14 h-14 mx-auto" />}
        <p className="text-3xl font-black mt-2">{r.acerte ? '¡Correcto!' : sin ? 'Sin respuesta' : 'Incorrecto'}</p>
        <p className="text-xl font-bold mt-1">{r.acerte ? `+${r.ganados} puntos` : '+0'}</p>
        {e.racha >= 2 && <p className="mt-1">🔥 Racha de {e.racha}</p>}
      </div>
      {!r.acerte && (
        <div className="mt-4 w-full bg-white/10 rounded-xl p-4 text-left text-sm">
          <p className="text-indigo-200 flex items-center gap-2">
            La correcta era <Forma i={r.ok} className="w-4 h-4" />
          </p>
          <p className="mt-1">{r.opCorrecta}</p>
        </div>
      )}
      <p className="mt-6 text-lg">
        Vas <b>{e.posicion}°</b> de {e.jugadores} · <b className="tabular-nums">{e.puntos}</b> pts
      </p>
    </Centro>
  );
}
