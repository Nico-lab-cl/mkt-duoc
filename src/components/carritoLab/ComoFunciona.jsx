import {
  Eye,
  ShoppingCart,
  AtSign,
  LogOut,
  Clock,
  Send,
  KeyRound,
  Cookie,
  UserX,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { Termino } from './Glosario';

/**
 * Explicación paso a paso de cómo funciona un carrito abandonado en la vida
 * real, para usar al inicio de la clase antes de jugar con el simulador.
 */

const PASOS = [
  {
    icon: Eye,
    titulo: 'Entra a la tienda',
    texto: (
      <>
        Si es su primera visita, es un <b>visitante anónimo</b>. La tienda todavía no sabe quién es, pero el{' '}
        <Termino id="remarketing">píxel</Termino> y la <Termino id="cookie">cookie</Termino> ya empiezan a anotar
        qué mira.
      </>
    )
  },
  {
    icon: ShoppingCart,
    titulo: 'Agrega un zapato al carro',
    texto: (
      <>
        La tienda guarda qué variante eligió: modelo, color y talla. Eso es un <Termino id="sku">SKU</Termino>.
        Todavía no sabe a quién pertenece el carro.
      </>
    )
  },
  {
    icon: AtSign,
    titulo: 'Deja su email (o no)',
    texto: (
      <>
        Es el paso clave: <b>sin email no hay correo de recuperación</b>. Abajo están las cuatro formas en que la
        tienda puede saber quién es.
      </>
    ),
    destacado: true
  },
  {
    icon: LogOut,
    titulo: 'Se va sin pagar',
    texto: (
      <>
        Cierra la pestaña o el celular. <b>Eso no le avisa nada a la tienda</b>: no existe un aviso de «cerré la
        pestaña». Simplemente deja de hacer cosas.
      </>
    )
  },
  {
    icon: Clock,
    titulo: 'Pasa el tiempo',
    texto: (
      <>
        Cuando lleva un rato sin actividad, su <Termino id="sesion">sesión</Termino> vence (en VTEX, a los 30
        minutos). Como no hubo pago, la tienda marca el carro como abandonado y le manda un{' '}
        <Termino id="evento">evento</Termino> al <Termino id="crm">CRM</Termino> con los datos en formato{' '}
        <Termino id="json">JSON</Termino>.
      </>
    )
  },
  {
    icon: Send,
    titulo: 'El CRM le escribe',
    texto: (
      <>
        Una <Termino id="automatizacion">automatización</Termino> revisa si dio{' '}
        <Termino id="consentimiento">permiso</Termino> para cada canal, arma el mensaje con la foto, la talla y el
        precio, y lo envía. Si algún dato viene sucio, el mensaje sale roto.
      </>
    )
  }
];

const CAPTURA = [
  {
    icon: AtSign,
    titulo: 'Escribe su email en el paso 1 del checkout',
    texto:
      'Las tiendas piden el email antes que la dirección o la tarjeta. Apenas lo escribe y pasa al siguiente campo, la tienda lo guarda junto al carro, aunque nunca apriete «Pagar». Es la forma más común.',
    color: 'emerald'
  },
  {
    icon: KeyRound,
    titulo: 'Ya tenía su cuenta abierta',
    texto:
      'Si inició sesión en una visita anterior y no la cerró, la tienda sabe quién es desde que entra, sin que escriba nada.',
    color: 'emerald'
  },
  {
    icon: Cookie,
    titulo: 'Dejó su email antes, en otro formulario',
    texto:
      'Por ejemplo, en el popup del newsletter hace un mes. La cookie de su navegador une esa visita con su email. Ojo: si cambia de navegador o borra las cookies, la tienda deja de reconocerlo.',
    color: 'amber'
  },
  {
    icon: UserX,
    titulo: 'No dejó nada',
    texto:
      'Miró, agregó al carro y se fue sin escribir su email en ningún lado. El CRM no puede escribirle: no sabe quién es. Lo único que queda es mostrarle anuncios del zapato en Instagram o Google (remarketing).',
    color: 'rose'
  }
];

const DATOS = [
  ['Email', 'Paso 1 del checkout, la cuenta o la cookie', 'Con espacios o mayúsculas → cliente duplicado', 'trim'],
  ['Nombre', 'La cuenta o el checkout', 'Vacío si sólo dejó el email → «Hola ,»', 'crm'],
  ['Foto', 'La variante (SKU)', 'Foto de otro color, o ninguna', 'sku'],
  ['Talla', 'La variante (SKU)', '«Talla 37,38,39,40» en vez de 38', 'sku'],
  ['Permiso', 'La tabla de consentimiento', 'WhatsApp a quien no lo aceptó', 'consentimiento']
];

const tono = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  amber: 'border-amber-200 bg-amber-50 text-amber-900',
  rose: 'border-rose-200 bg-rose-50 text-rose-900'
};

export default function ComoFunciona({ irA }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <section>
        <h2 className="text-2xl font-bold">¿Cómo funciona un carrito abandonado?</h2>
        <p className="text-slate-600 mt-2 max-w-3xl">
          En promedio, <b>7 de cada 10 carros se abandonan</b> (Baymard Institute, 50 estudios). El correo de
          «¿te olvidaste de algo?» intenta recuperar parte de esas ventas. Pero sólo funciona si la tienda sabe
          quién eras y si los datos del producto están bien escritos.
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-lg mb-3">El camino, paso a paso</h3>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PASOS.map(({ icon: Icon, titulo, texto, destacado }, i) => (
            <li
              key={titulo}
              className={`rounded-2xl border p-4 bg-white ${destacado ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white grid place-items-center text-sm font-bold">
                  {i + 1}
                </span>
                <Icon className="w-5 h-5 text-sky-600" />
                <span className="font-semibold">{titulo}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="font-semibold text-lg">Si nunca envió un formulario, ¿cómo consiguen su email?</h3>
        <p className="text-sm text-slate-600 mt-1 mb-3 max-w-3xl">
          No hace falta apretar «Enviar» ni «Pagar». Hay cuatro situaciones posibles:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {CAPTURA.map(({ icon: Icon, titulo, texto, color }) => (
            <div key={titulo} className={`rounded-2xl border p-4 ${tono[color]}`}>
              <p className="font-semibold flex items-center gap-2">
                <Icon className="w-5 h-5" /> {titulo}
              </p>
              <p className="text-sm mt-1.5 leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-700 mt-3 bg-white border border-slate-200 rounded-xl p-3 flex gap-2">
          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <span>
            Además, en VTEX el correo sólo les llega a quienes aceptaron recibir comunicaciones. Tener el email no
            basta: también hace falta el <Termino id="consentimiento">permiso</Termino>.
          </span>
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-lg mb-3">¿De dónde sale cada dato del correo?</h3>
        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-3 py-2">Lo que muestra el correo</th>
                <th className="px-3 py-2">De dónde lo saca</th>
                <th className="px-3 py-2">Qué sale mal si el dato está sucio</th>
              </tr>
            </thead>
            <tbody>
              {DATOS.map(([dato, origen, falla, term]) => (
                <tr key={dato} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-semibold">{dato}</td>
                  <td className="px-3 py-2">{origen}</td>
                  <td className="px-3 py-2 text-rose-800">
                    {falla} <Termino id={term} className="text-xs">(ver)</Termino>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-slate-900 text-white rounded-2xl p-5">
        <h3 className="font-semibold text-lg">Cómo usarlo en clase</h3>
        <ol className="list-decimal list-inside text-sm text-slate-200 mt-2 space-y-1.5">
          <li>
            Con todas las reglas <b>apagadas</b>, que abandonen un carro. Pregunten: ¿qué está mal en el correo?
          </li>
          <li>Prendan una regla a la vez y miren qué problema desaparece.</li>
          <li>Prueben con un visitante anónimo: ¿qué se puede hacer si no dejó su email?</li>
          <li>
            Pasen a la <b>Práctica</b>: cada equipo inventa sus productos, define sus campos y prueba su propio carro
            abandonado. El revisor les marca dónde se equivocaron.
          </li>
          <li>Al final, que copien su modelo, se lo pasen a la IA y comparen lo que dice con el revisor.</li>
        </ol>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => irA('simulador')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 font-semibold text-sm"
          >
            Ir al simulador <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => irA('practica')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 font-semibold text-sm"
          >
            Ir a la práctica <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
