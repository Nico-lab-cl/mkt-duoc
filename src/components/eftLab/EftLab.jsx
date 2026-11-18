import { useEffect, useState } from 'react';
import { Briefcase, RefreshCw, Wrench, Palette, Sparkles, GraduationCap, FileText, RotateCcw } from 'lucide-react';
import usePageScroll from '../feedbackDocente/usePageScroll';
import { MARCA } from './datos';
import Caso from './Caso';
import Flywheel from './Flywheel';
import Herramientas from './Herramientas';
import TallerDiseno from './TallerDiseno';
import TuPieza from './TuPieza';
import Simulacro from './Simulacro';
import Entregable from './Entregable';

/**
 * Laboratorio EFT · Eje 1 (MKA1213 Inbound Marketing II).
 * Ruta pública: /eft-lab
 *
 * Repaso interactivo de la primera parte del examen final: Flywheel de
 * contenidos (IE1.1.1, IE1.1.2) y herramientas y principios de diseño
 * (IE1.2.1, IE1.2.2). Todo vive en el navegador del alumno: el avance se
 * guarda en localStorage y nada viaja al servidor.
 */

const VISTAS = [
  { id: 'caso', label: 'El caso y la pauta', icon: Briefcase },
  { id: 'flywheel', label: 'Flywheel', icon: RefreshCw },
  { id: 'herramientas', label: 'Herramientas', icon: Wrench },
  { id: 'taller', label: 'Taller de diseño', icon: Palette },
  { id: 'pieza', label: 'Tu pieza', icon: Sparkles },
  { id: 'simulacro', label: 'Simulacro', icon: GraduationCap },
  { id: 'entregable', label: 'Mi entregable', icon: FileText }
];

const CLAVE = 'eft-lab-eje1-v1';

const ESTADO_INICIAL = {
  persona: 'carolina',
  clasif: {},
  ejemplos: {},
  herrSel: [],
  herrNotas: {},
  herrElegida: '',
  escenarios: {},
  brief: {},
  autoeval: {},
  quiz: {}
};

const leer = () => {
  try {
    const raw = window.localStorage.getItem(CLAVE);
    return raw ? { ...ESTADO_INICIAL, ...JSON.parse(raw) } : ESTADO_INICIAL;
  } catch {
    return ESTADO_INICIAL;
  }
};

const vistaInicial = () => {
  const h = window.location.hash.replace('#', '');
  return VISTAS.some((v) => v.id === h) ? h : 'caso';
};

export default function EftLab() {
  usePageScroll();
  const [vista, setVista] = useState(vistaInicial);
  const [estado, setEstado] = useState(leer);
  const [imagen, setImagen] = useState(null); // objectURL de la pieza subida (no se guarda)

  useEffect(() => {
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {
      /* modo incógnito o almacenamiento bloqueado: el lab sigue funcionando */
    }
  }, [estado]);

  useEffect(() => {
    document.title = `Laboratorio EFT · ${MARCA}`;
  }, []);

  const set = (campo, valor) =>
    setEstado((e) => ({ ...e, [campo]: typeof valor === 'function' ? valor(e[campo]) : valor }));

  const irA = (v) => {
    setVista(v);
    window.history.replaceState(null, '', `#${v}`);
    window.scrollTo(0, 0);
  };

  const reiniciar = () => {
    if (!window.confirm('¿Borrar todo tu avance en este navegador?')) return;
    setEstado(ESTADO_INICIAL);
    setImagen(null);
    irA('caso');
  };

  const props = { estado, set, irA };
  const idx = VISTAS.findIndex((v) => v.id === vista);
  const siguiente = VISTAS[idx + 1];

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
          <button
            onClick={reiniciar}
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4" /> Empezar de cero
          </button>
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
        {vista === 'caso' && <Caso {...props} />}
        {vista === 'flywheel' && <Flywheel {...props} />}
        {vista === 'herramientas' && <Herramientas {...props} />}
        {vista === 'taller' && <TallerDiseno {...props} />}
        {vista === 'pieza' && <TuPieza {...props} imagen={imagen} setImagen={setImagen} />}
        {vista === 'simulacro' && <Simulacro {...props} />}
        {vista === 'entregable' && <Entregable {...props} imagen={imagen} />}

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
      </main>
    </div>
  );
}
