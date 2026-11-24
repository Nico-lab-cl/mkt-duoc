import { useCallback, useEffect, useRef, useState } from 'react';
import { Briefcase, RefreshCw, Wrench, Palette, Sparkles, GraduationCap, FileText, LogOut, Cloud, CloudOff, ClipboardList } from 'lucide-react';
import usePageScroll from '../feedbackDocente/usePageScroll';
import { useProject } from '../../context/ProjectContext';
import Login from '../Login';
import { MARCA } from './datos';
import Caso from './Caso';
import Flywheel from './Flywheel';
import Herramientas from './Herramientas';
import TallerDiseno from './TallerDiseno';
import TuPieza from './TuPieza';
import Simulacro from './Simulacro';
import Entregable from './Entregable';
import Revision from './Revision';
import Evaluacion from './Evaluacion';
import TriviaHost from '../trivia/TriviaHost';

/**
 * Laboratorio EFT · Eje 1 (MKA1213 Inbound Marketing II).
 * Rutas: /eft-lab (estudiantes, con su cuenta) y /eft-lab/revision (profesor).
 *
 * Repaso interactivo de la primera parte del examen final: Flywheel de
 * contenidos (IE1.1.1, IE1.1.2) y herramientas y principios de diseño
 * (IE1.2.1, IE1.2.2). El avance de cada estudiante se guarda en el servidor
 * (tabla eft_lab_entregas) para que el profesor lo revise.
 */

const LAB = 'eje1';
const RUTA = '/eft-lab';

const VISTAS = [
  { id: 'caso', label: 'El caso y la pauta', icon: Briefcase },
  { id: 'flywheel', label: 'Flywheel', icon: RefreshCw },
  { id: 'herramientas', label: 'Herramientas', icon: Wrench },
  { id: 'taller', label: 'Taller de diseño', icon: Palette },
  { id: 'pieza', label: 'Tu pieza', icon: Sparkles },
  { id: 'simulacro', label: 'Simulacro', icon: GraduationCap },
  { id: 'entregable', label: 'Mi entregable', icon: FileText }
];

const ESTADO_INICIAL = {
  persona: 'carolina',
  clasif: {},
  ejemplos: {},
  herrSel: [],
  herrNotas: {},
  herrElegida: '',
  escenarios: {},
  escenariosOtra: {},
  herrOtra: '',
  brief: {},
  autoeval: {},
  quiz: {}
};

const vistaInicial = () => {
  const h = window.location.hash.replace('#', '');
  return VISTAS.some((v) => v.id === h) ? h : 'caso';
};

const mismo = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function Encabezado({ children, subtitulo, titulo = 'Eje 1: Contenidos, Flywheel y diseño' }) {
  return (
    <header className="bg-slate-900 text-white print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-4 flex flex-wrap items-start gap-4 justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-teal-300 font-semibold">
            MKA1213 Inbound Marketing II · Laboratorio EFT
          </p>
          <h1 className="text-xl sm:text-2xl font-bold">{titulo}</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">{subtitulo}</p>
        </div>
        {children}
      </div>
    </header>
  );
}

const MODOS = {
  lab: { ruta: RUTA, titulo: 'Eje 1: Contenidos, Flywheel y diseño', doc: `Laboratorio EFT · ${MARCA}` },
  revision: { ruta: `${RUTA}/revision`, titulo: 'Revisión docente', doc: 'Revisión Laboratorio EFT' },
  evaluacion: { ruta: `${RUTA}/evaluacion`, titulo: 'Evaluación: Caso Smart Home', doc: 'Evaluación MKA1213' },
  trivia: { ruta: `${RUTA}/trivia`, titulo: 'Trivia en vivo', doc: 'Trivia MKA1213' }
};

const modoInicial = () => {
  const p = window.location.pathname.replace(/\/$/, '');
  if (p === MODOS.revision.ruta) return 'revision';
  if (p === MODOS.evaluacion.ruta) return 'evaluacion';
  if (p === MODOS.trivia.ruta) return 'trivia';
  return 'lab';
};

export default function EftLab() {
  usePageScroll();
  const { currentUser, setCurrentUser } = useProject();
  // Se fija al montar: el login de la app cambia la URL a "/" antes de volver aquí
  const [modo] = useState(modoInicial);
  const { ruta, titulo, doc } = MODOS[modo];

  // El login de la app principal deja la URL en "/"; la devolvemos a esta página.
  useEffect(() => {
    document.title = doc;
    if (currentUser && !window.location.pathname.startsWith(ruta)) {
      window.history.replaceState(null, '', ruta + window.location.hash);
    }
  }, [currentUser, ruta, doc]);

  const salir = () => {
    setCurrentUser(null);
    window.history.replaceState(null, '', ruta);
  };

  if (!currentUser || currentUser.role === 'guest') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Encabezado
          titulo={titulo}
          subtitulo={
            modo === 'evaluacion'
              ? 'Inicia sesión con tu cuenta del simulador para rendir la evaluación.'
              : 'Inicia sesión con tu cuenta del simulador para guardar tu avance. Tu profesor revisará tu trabajo desde aquí.'
          }
        />
        <Login onNext={() => {}} />
      </div>
    );
  }

  // La evaluación y el panel docente exigen la sesión firmada que entrega el login nuevo
  if (modo !== 'lab' && !currentUser.auth_token) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Encabezado titulo={titulo} subtitulo="Necesitamos que vuelvas a iniciar sesión." />
        <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl p-6 shadow-sm text-center">
          <p className="text-slate-700">Por seguridad, cierra sesión y vuelve a entrar con tu correo y contraseña.</p>
          <button onClick={salir} className="mt-4 px-5 py-2.5 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700">
            Volver a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  if (modo === 'revision') {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Encabezado titulo={titulo} subtitulo="Avance del laboratorio y resultados de la evaluación de cada estudiante.">
          <Usuario user={currentUser} salir={salir} />
        </Encabezado>
        {currentUser.role === 'admin' ? (
          <Revision user={currentUser} />
        ) : (
          <p className="max-w-6xl mx-auto p-6">Esta página es solo para el profesor.</p>
        )}
      </div>
    );
  }

  if (modo === 'trivia') {
    return currentUser.role === 'admin' ? (
      <TriviaHost user={currentUser} />
    ) : (
      <div className="min-h-screen bg-slate-50">
        <Encabezado titulo={titulo} subtitulo="Esta página es para el profesor.">
          <Usuario user={currentUser} salir={salir} />
        </Encabezado>
        <p className="max-w-6xl mx-auto p-6">
          Para jugar, entra a <a className="text-teal-700 underline" href="/trivia">/trivia</a> con el PIN que muestra la pantalla.
        </p>
      </div>
    );
  }

  if (modo === 'evaluacion') {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Encabezado titulo={titulo} subtitulo="Selección múltiple situacional · 3 ejes de la EFT">
          <Usuario user={currentUser} salir={salir} />
        </Encabezado>
        <Evaluacion user={currentUser} salir={salir} />
      </div>
    );
  }

  return <LabEstudiante user={currentUser} salir={salir} />;
}

function Usuario({ user, salir, extra }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {extra}
      <span className="px-3 py-2 rounded-lg bg-white/10">{user.full_name || user.email}</span>
      <button onClick={salir} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20">
        <LogOut className="w-4 h-4" /> Salir
      </button>
    </div>
  );
}

function LabEstudiante({ user, salir }) {
  const [vista, setVista] = useState(vistaInicial);
  const [estado, setEstado] = useState(ESTADO_INICIAL);
  const [meta, setMeta] = useState({ submitted_at: null, updated_at: null, has_image: false });
  const [carga, setCarga] = useState('cargando'); // cargando | listo | error
  const [guardado, setGuardado] = useState('ok'); // ok | guardando | error
  const [imgVersion, setImgVersion] = useState(0);
  const urgente = useRef(false);
  const ultimoEnviado = useRef(null);

  const headers = { 'Content-Type': 'application/json', 'x-user-id': String(user.id) };

  useEffect(() => {
    let vivo = true;
    fetch(`/api/eft-lab/${LAB}/me`, { headers: { 'x-user-id': String(user.id) } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d) => {
        if (!vivo) return;
        const inicial = { ...ESTADO_INICIAL, ...d.data };
        ultimoEnviado.current = inicial;
        setEstado(inicial);
        setMeta(d);
        setCarga('listo');
      })
      .catch(() => vivo && setCarga('error'));
    return () => {
      vivo = false;
    };
  }, [user.id]);

  const guardar = useCallback(
    async (datos, enviar = false) => {
      setGuardado('guardando');
      try {
        const r = await fetch(`/api/eft-lab/${LAB}/me`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ data: datos, enviar })
        });
        if (!r.ok) throw new Error();
        const d = await r.json();
        ultimoEnviado.current = datos;
        setMeta(d);
        // El servidor manda en la clasificación (un solo intento)
        if (!mismo(d.data.clasif, datos.clasif)) {
          setEstado((e) => ({ ...e, clasif: d.data.clasif }));
        }
        setGuardado('ok');
        return true;
      } catch {
        setGuardado('error');
        return false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user.id]
  );

  // Autoguardado: espera a que el estudiante deje de escribir. La clasificación
  // del Flywheel se guarda al instante para que no se pueda reintentar recargando.
  useEffect(() => {
    if (carga !== 'listo' || mismo(estado, ultimoEnviado.current)) return;
    const t = window.setTimeout(() => guardar(estado), urgente.current ? 0 : 1200);
    urgente.current = false;
    return () => window.clearTimeout(t);
  }, [estado, carga, guardar]);

  const set = (campo, valor, { inmediato = false } = {}) => {
    if (inmediato) urgente.current = true;
    setEstado((e) => ({ ...e, [campo]: typeof valor === 'function' ? valor(e[campo]) : valor }));
  };

  const irA = (v) => {
    setVista(v);
    window.history.replaceState(null, '', `#${v}`);
    window.scrollTo(0, 0);
  };

  const imagen = meta.has_image ? `/api/eft-lab/${LAB}/imagen/${user.id}?uid=${user.id}&v=${imgVersion}` : null;

  const subirImagen = async (dataUrl, mime) => {
    const r = await fetch(`/api/eft-lab/${LAB}/me/imagen`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ mime, data_base64: dataUrl })
    });
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      throw new Error(d.error || 'No se pudo subir la imagen');
    }
    setMeta((m) => ({ ...m, has_image: true }));
    setImgVersion((v) => v + 1);
  };

  const quitarImagen = async () => {
    await fetch(`/api/eft-lab/${LAB}/me/imagen`, { method: 'DELETE', headers });
    setMeta((m) => ({ ...m, has_image: false }));
  };

  const enviar = () => guardar(estado, true);

  const props = { estado, set, irA, user };
  const idx = VISTAS.findIndex((v) => v.id === vista);
  const siguiente = VISTAS[idx + 1];

  const indicador =
    carga !== 'listo' ? null : guardado === 'guardando' ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 text-slate-300">
        <Cloud className="w-4 h-4" /> Guardando…
      </span>
    ) : guardado === 'error' ? (
      <button onClick={() => guardar(estado)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600">
        <CloudOff className="w-4 h-4" /> Sin guardar · reintentar
      </button>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 text-teal-200">
        <Cloud className="w-4 h-4" /> Guardado
      </span>
    );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 flex flex-wrap items-start gap-4 justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-teal-300 font-semibold">
              MKA1213 Inbound Marketing II · Laboratorio EFT
            </p>
            <h1 className="text-xl sm:text-2xl font-bold">Eje 1: Contenidos, Flywheel y diseño</h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Repasa la primera parte del examen final con el caso {MARCA} (marca ficticia) y arma el material para tu
              informe y tu video.
            </p>
          </div>
          <Usuario
            user={user}
            salir={salir}
            extra={
              <>
                {user.role === 'admin' && (
                  <a href={`${RUTA}/revision`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700">
                    <ClipboardList className="w-4 h-4" /> Revisión
                  </a>
                )}
                {indicador}
              </>
            }
          />
        </div>
        <nav className="max-w-6xl mx-auto px-2 sm:px-4 mt-4 flex gap-1 overflow-x-auto">
          {VISTAS.map(({ id, label, icon: Icon }, i) => (
            <button
              key={id}
              onClick={() => irA(id)}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm rounded-t-xl whitespace-nowrap ${
                vista === id ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" /> {i + 1}. {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {carga === 'cargando' && <p className="text-slate-500">Cargando tu avance…</p>}
        {carga === 'error' && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4">
            No pudimos cargar tu avance. Revisa tu conexión y recarga la página. Si sigue fallando, cierra sesión y vuelve
            a entrar.
          </div>
        )}
        {carga === 'listo' && (
          <>
            {vista === 'caso' && <Caso {...props} />}
            {vista === 'flywheel' && <Flywheel {...props} />}
            {vista === 'herramientas' && <Herramientas {...props} />}
            {vista === 'taller' && <TallerDiseno {...props} />}
            {vista === 'pieza' && <TuPieza {...props} imagen={imagen} subirImagen={subirImagen} quitarImagen={quitarImagen} />}
            {vista === 'simulacro' && <Simulacro {...props} />}
            {vista === 'entregable' && (
              <Entregable {...props} imagen={imagen} meta={meta} onEnviar={enviar} guardado={guardado} />
            )}

            {siguiente && (
              <div className="mt-8 flex justify-end print:hidden">
                <button
                  onClick={() => irA(siguiente.id)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700"
                >
                  Siguiente: {siguiente.label} →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
