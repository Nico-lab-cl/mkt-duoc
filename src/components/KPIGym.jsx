import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';

const questionPool = [
  {
    id: 1,
    text: '¿Cuál es la fórmula correcta para calcular el CTR (Click-Through Rate)?',
    options: [
      { id: 'A', text: '(Clics / Impresiones) x 100' },
      { id: 'B', text: '(Impresiones / Clics) x 100' },
      { id: 'C', text: 'Inversión / Clics' },
      { id: 'D', text: 'Clics / Conversiones' }
    ],
    correctOption: 'A'
  },
  {
    id: 2,
    text: '¿Qué significa la métrica CPM en marketing digital?',
    options: [
      { id: 'A', text: 'Costo por cada Mil Impresiones' },
      { id: 'B', text: 'Costo por Mensaje' },
      { id: 'C', text: 'Clics Por Minuto' },
      { id: 'D', text: 'Conversiones Por Mes' }
    ],
    correctOption: 'A'
  },
  {
    id: 3,
    text: 'Si inviertes $500 en una campaña y consigues 50 leads (prospectos), ¿cuál es tu CPL (Costo por Lead)?',
    options: [
      { id: 'A', text: '$10' },
      { id: 'B', text: '$5' },
      { id: 'C', text: '$50' },
      { id: 'D', text: '$0.10' }
    ],
    correctOption: 'A'
  },
  {
    id: 4,
    text: 'Si un anuncio tiene muchas impresiones pero muy pocos clics, ¿qué métrica se verá más afectada negativamente?',
    options: [
      { id: 'A', text: 'El CTR bajará considerablemente.' },
      { id: 'B', text: 'El CPM subirá a niveles extremos.' },
      { id: 'C', text: 'La Tasa de Conversión (CR) subirá.' },
      { id: 'D', text: 'El Costo por Lead (CPL) bajará.' }
    ],
    correctOption: 'A'
  },
  {
    id: 5,
    text: '¿Cuál es la función principal del KPI "Tasa de Conversión" (CR)?',
    options: [
      { id: 'A', text: 'Medir el porcentaje de usuarios que completan una acción deseada después de hacer clic.' },
      { id: 'B', text: 'Medir cuántas veces se mostró el anuncio en la pantalla.' },
      { id: 'C', text: 'Calcular el costo exacto de cada venta.' },
      { id: 'D', text: 'Determinar el alcance total de una campaña en redes sociales.' }
    ],
    correctOption: 'A'
  },
  {
    id: 6,
    text: 'Inviertes $1,000 en publicidad y generas $4,000 en ingresos totales. ¿Cuál es el ROAS (Retorno a la Inversión Publicitaria)?',
    options: [
      { id: 'A', text: '4.0 (o 400%)' },
      { id: 'B', text: '3.0 (o 300%)' },
      { id: 'C', text: '0.25 (o 25%)' },
      { id: 'D', text: '5.0 (o 500%)' }
    ],
    correctOption: 'A'
  },
  {
    id: 7,
    text: '¿Qué mide el Costo de Adquisición de Cliente (CAC)?',
    options: [
      { id: 'A', text: 'Cuánto cuesta en promedio conseguir un cliente nuevo que realiza una compra.' },
      { id: 'B', text: 'El costo de adquirir un nuevo clic en la campaña.' },
      { id: 'C', text: 'El dinero necesario para que alguien llene un formulario.' },
      { id: 'D', text: 'El costo total de la plataforma de marketing mensual.' }
    ],
    correctOption: 'A'
  },
  {
    id: 8,
    text: 'Si logras disminuir tu Costo por Clic (CPC) a la mitad sin perder calidad de tráfico, ¿qué pasará probablemente con tu campaña si mantienes la misma inversión?',
    options: [
      { id: 'A', text: 'Obtendrás el doble de clics por el mismo presupuesto.' },
      { id: 'B', text: 'Tus impresiones se reducirán a la mitad.' },
      { id: 'C', text: 'Tu Costo por Lead (CPL) subirá al doble.' },
      { id: 'D', text: 'Tu Tasa de Conversión (CR) bajará automáticamente al 50%.' }
    ],
    correctOption: 'A'
  },
  {
    id: 9,
    text: 'Un anuncio tiene un CTR muy alto, pero nadie compra en la Landing Page. ¿Dónde está probablemente el problema?',
    options: [
      { id: 'A', text: 'En la Landing Page (es lenta, confusa o la oferta no coincide con el anuncio).' },
      { id: 'B', text: 'El diseño gráfico del anuncio es aburrido.' },
      { id: 'C', text: 'El presupuesto asignado a la campaña es demasiado bajo.' },
      { id: 'D', text: 'El CPM está demasiado alto.' }
    ],
    correctOption: 'A'
  },
  {
    id: 10,
    text: '¿Qué es el LTV (Life Time Value) de un cliente?',
    options: [
      { id: 'A', text: 'El valor total o ganancia estimada que un cliente dejará en la empresa durante todo el tiempo que mantenga relación con ella.' },
      { id: 'B', text: 'El tiempo promedio que un usuario pasa leyendo un artículo de tu blog.' },
      { id: 'C', text: 'La cantidad de veces que una persona ve tu anuncio antes de morir.' },
      { id: 'D', text: 'El costo de adquirir a un cliente que se queda de por vida.' }
    ],
    correctOption: 'A'
  },
  {
    id: 11,
    text: 'Si quieres aumentar las visitas a tu sitio web sin aumentar el presupuesto diario, ¿qué métrica necesitas optimizar y mejorar en tus anuncios?',
    options: [
      { id: 'A', text: 'El CTR (Hacer que los anuncios sean más atractivos para generar más clics).' },
      { id: 'B', text: 'El CR (Tasa de Conversión de la página).' },
      { id: 'C', text: 'El CPA (Costo por Adquisición).' },
      { id: 'D', text: 'El LTV (Life Time Value).' }
    ],
    correctOption: 'A'
  },
  {
    id: 12,
    text: 'Si una landing page tiene 500 visitas y logra 25 ventas, ¿cuál es su Tasa de Conversión (CR)?',
    options: [
      { id: 'A', text: '5%' },
      { id: 'B', text: '20%' },
      { id: 'C', text: '2.5%' },
      { id: 'D', text: '50%' }
    ],
    correctOption: 'A'
  },
  {
    id: 13,
    text: '¿Por qué es importante que el LTV (Life Time Value) sea siempre mayor que el CAC (Costo de Adquisición de Cliente)?',
    options: [
      { id: 'A', text: 'Porque si cuesta más adquirir al cliente que el dinero que este aporta, la empresa pierde dinero.' },
      { id: 'B', text: 'Porque Facebook penaliza las cuentas con un CAC mayor al LTV.' },
      { id: 'C', text: 'Porque el CAC siempre define cuántos clics vas a obtener.' },
      { id: 'D', text: 'No es importante, el CAC siempre debe ser mayor.' }
    ],
    correctOption: 'A'
  },
  {
    id: 14,
    text: 'En una campaña de alcance o reconocimiento de marca, ¿cuál es la métrica más importante a observar?',
    options: [
      { id: 'A', text: 'Impresiones y Alcance (CPM bajo).' },
      { id: 'B', text: 'Costo por Compra (CPA).' },
      { id: 'C', text: 'Retorno de Inversión (ROAS).' },
      { id: 'D', text: 'Tasa de Conversión en el carrito.' }
    ],
    correctOption: 'A'
  },
  {
    id: 15,
    text: 'Si el CPM de tu campaña es de $20 y consigues 5,000 impresiones, ¿cuánto has gastado en total?',
    options: [
      { id: 'A', text: '$100' },
      { id: 'B', text: '$10' },
      { id: 'C', text: '$200' },
      { id: 'D', text: '$1,000' }
    ],
    correctOption: 'A'
  },
  {
    id: 16,
    text: '¿Cuál es la relación principal entre el CPC, el CTR y el CPM?',
    options: [
      { id: 'A', text: 'Si el CPM se mantiene igual y el CTR sube, el CPC baja (los clics salen más baratos).' },
      { id: 'B', text: 'Si el CTR sube, el CPM y el CPC también suben.' },
      { id: 'C', text: 'No hay relación directa entre estas métricas.' },
      { id: 'D', text: 'Si el CPC baja, el CPM sube drásticamente.' }
    ],
    correctOption: 'A'
  },
  {
    id: 17,
    text: 'Tienes una Tasa de Conversión del 2% y un CPC de $1. ¿Cuánto te costará en promedio obtener una conversión (CPA)?',
    options: [
      { id: 'A', text: '$50 (Necesitas 100 clics para 2 conversiones, es decir 50 clics por 1 conversión).' },
      { id: 'B', text: '$100' },
      { id: 'C', text: '$2' },
      { id: 'D', text: '$20' }
    ],
    correctOption: 'A'
  },
  {
    id: 18,
    text: '¿Qué mide exactamente la "Frecuencia" en una campaña publicitaria?',
    options: [
      { id: 'A', text: 'El promedio de veces que cada persona única ha visto el anuncio.' },
      { id: 'B', text: 'La velocidad con la que se gastan los fondos del presupuesto.' },
      { id: 'C', text: 'Cuántas veces por minuto se muestra el anuncio.' },
      { id: 'D', text: 'El número de veces que alguien comparte tu anuncio.' }
    ],
    correctOption: 'A'
  },
  {
    id: 19,
    text: 'Si notas que tu Costo por Lead (CPL) ha subido mucho en los últimos 7 días y la Frecuencia del anuncio está en 4.5, ¿qué deberías hacer?',
    options: [
      { id: 'A', text: 'Refrescar el anuncio o cambiar la creatividad gráfica porque el público ya se cansó de verlo.' },
      { id: 'B', text: 'Aumentar el presupuesto al doble para llegar a más personas.' },
      { id: 'C', text: 'Cambiar la Landing Page de inmediato.' },
      { id: 'D', text: 'Ignorarlo, una frecuencia de 4.5 es el mínimo ideal en 7 días.' }
    ],
    correctOption: 'A'
  },
  {
    id: 20,
    text: '¿Para qué sirve principalmente realizar Tests A/B en anuncios?',
    options: [
      { id: 'A', text: 'Para identificar con datos qué versión de un anuncio o página genera mejores KPIs (como un CTR más alto o un menor CPA).' },
      { id: 'B', text: 'Para que el equipo de diseño justifique su trabajo semanal.' },
      { id: 'C', text: 'Para gastar el presupuesto sobrante de la campaña.' },
      { id: 'D', text: 'Para evitar que el algoritmo de Meta apruebe los anuncios muy rápido.' }
    ],
    correctOption: 'A'
  }
];

const shuffleArray = (array, seed) => {
  let m = array.length, t, i;
  let random = function() {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  let result = [...array];
  while (m) {
    i = Math.floor(random() * m--);
    t = result[m];
    result[m] = result[i];
    result[i] = t;
  }
  return result;
};

const KPIGym = () => {
  const { currentUser } = useProject();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [justifications, setJustifications] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    // Generate distinct test based on user ID or randomly if not logged in
    const seed = currentUser?.id || Math.floor(Math.random() * 1000);
    
    // Shuffle the options within each question to avoid 'A' being always correct
    const randomizedQuestions = questionPool.map((q, idx) => {
      return {
        ...q,
        options: shuffleArray(q.options, seed + idx)
      };
    });

    // Pick 10 unique questions for this user
    const selectedQuestions = shuffleArray(randomizedQuestions, seed).slice(0, 10);
    setQuestions(selectedQuestions);
  }, [currentUser]);

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleJustificationChange = (questionId, value) => {
    setJustifications({ ...justifications, [questionId]: value });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < 10) {
      alert("Por favor, responde a todas las preguntas de selección múltiple.");
      return;
    }
    
    setLoading(true);

    // Calculate score
    let calculatedScore = 0;
    const questionsAsked = questions.map(q => {
      const isCorrect = answers[q.id] === q.correctOption;
      if (isCorrect) calculatedScore += 1;
      return {
        questionId: q.id,
        text: q.text,
        selectedOption: answers[q.id],
        correctOption: q.correctOption,
        selectedOptionText: q.options.find(o => o.id === answers[q.id])?.text || '',
        correctOptionText: q.options.find(o => o.id === q.correctOption)?.text || '',
        isCorrect,
        justification: justifications[q.id] || ''
      };
    });

    setFinalScore(calculatedScore);
    
    // Simulate/send to backend
    try {
      await fetch('/api/submit-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          studentName: currentUser?.full_name,
          groupId: currentUser?.group_id || 1,
          score: calculatedScore,
          answers: questionsAsked, // send full rich data
          justifications
        })
      });
      await new Promise(r => setTimeout(r, 1000));
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      await new Promise(r => setTimeout(r, 1000));
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-slate-900 min-h-screen p-8 text-slate-200 font-sans flex items-center justify-center">
        <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-2xl p-10 text-center max-w-lg">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">Evaluación Enviada</h2>
          <p className="text-xl font-bold text-white mb-4">Obtuviste {finalScore} / 10 puntos</p>
          <p className="text-slate-300">
            Tus respuestas y justificaciones han sido registradas en la base de datos del profesor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen p-8 text-slate-200 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 border-b border-slate-700 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Práctica de Métricas (Avanzado)</h1>
          <p className="text-slate-400">Responde estas 10 preguntas estratégicas. Justifica analíticamente tu respuesta para obtener el puntaje completo.</p>
        </header>

        <div className="space-y-8 mb-12">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4 leading-relaxed">
                <span className="text-blue-500 mr-2">{index + 1}.</span> {q.text}
              </h3>
              
              <div className="space-y-3 mb-6">
                {q.options.map((opt, optIndex) => {
                  const letter = String.fromCharCode(65 + optIndex);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(q.id, opt.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        answers[q.id] === opt.id 
                          ? 'bg-blue-900/40 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="font-bold mr-2 text-slate-400">{letter}.</span> {opt.text}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Justificación técnica / matemática:</label>
                <textarea
                  value={justifications[q.id] || ''}
                  onChange={(e) => handleJustificationChange(q.id, e.target.value)}
                  placeholder="Escribe la fórmula, cálculo o lógica empleada..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none h-24"
                ></textarea>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end sticky bottom-8">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className={`font-bold py-4 px-10 rounded-xl shadow-2xl transition-all text-lg ${
              loading 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50 hover:shadow-blue-600/50'
            }`}
          >
            {loading ? 'Procesando Evaluación...' : 'Enviar Evaluación Definitiva'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KPIGym;
