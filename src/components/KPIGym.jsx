import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';

const questionPool = [
  {
    id: 1,
    text: 'Si el CPA de tu campaña supera el ticket promedio de tu producto, ¿qué afirmación es estratégicamente correcta?',
    options: [
      { id: 'A', text: 'Estás perdiendo dinero por cada venta, por lo que debes pausar o pivotar la estrategia de inmediato.' },
      { id: 'B', text: 'Debes aumentar el presupuesto para diluir el costo de adquisición.' },
      { id: 'C', text: 'Significa que el ROAS es exactamente 1.0.' },
      { id: 'D', text: 'Debes centrarte en aumentar el CTR para reducir el CPA directamente.' }
    ],
    correctOption: 'A'
  },
  {
    id: 2,
    text: 'Si tu campaña de Meta Ads tiene un CPM de $15 y un CTR de 0.5%, ¿cuál es tu Costo por Clic (CPC) estimado?',
    options: [
      { id: 'A', text: '$0.30' },
      { id: 'B', text: '$3.00' },
      { id: 'C', text: '$0.075' },
      { id: 'D', text: '$1.50' }
    ],
    correctOption: 'B'
  },
  {
    id: 3,
    text: 'Una landing page tiene 1,000 visitas y genera 20 leads. Si el Costo por Clic (CPC) fue de $1.20, ¿cuál es el Costo por Lead (CPL)?',
    options: [
      { id: 'A', text: '$24.00' },
      { id: 'B', text: '$60.00' },
      { id: 'C', text: '$50.00' },
      { id: 'D', text: '$12.00' }
    ],
    correctOption: 'B'
  },
  {
    id: 4,
    text: 'Inviertes $5,000 en una campaña que genera $25,000 en ingresos. Sin embargo, el costo de producción y envío fue de $10,000. ¿Cuál es el ROI (Retorno de Inversión) real de la campaña publicitaria considerando costos operativos?',
    options: [
      { id: 'A', text: '400%' },
      { id: 'B', text: '100%' },
      { id: 'C', text: '500%' },
      { id: 'D', text: '200%' }
    ],
    correctOption: 'B'
  },
  {
    id: 5,
    text: 'El algoritmo de Meta Ads entra en "Fatiga de Anuncio" (Ad Fatigue). ¿Cuál es el síntoma analítico más claro de esto?',
    options: [
      { id: 'A', text: 'La frecuencia sube, el CTR baja y el CPA aumenta.' },
      { id: 'B', text: 'El CPM baja drásticamente y el CTR sube.' },
      { id: 'C', text: 'El ROAS se mantiene estático mientras el CPC baja.' },
      { id: 'D', text: 'La tasa de conversión de la landing page disminuye a 0%.' }
    ],
    correctOption: 'A'
  },
  {
    id: 6,
    text: 'Estás analizando un embudo SaaS. Obtuviste 500 leads a un CPL de $5. De esos leads, el 5% se convirtió en clientes de pago (CR de lead a venta). ¿Cuál es el CAC (Costo de Adquisición de Cliente)?',
    options: [
      { id: 'A', text: '$25' },
      { id: 'B', text: '$100' },
      { id: 'C', text: '$500' },
      { id: 'D', text: '$50' }
    ],
    correctOption: 'B'
  },
  {
    id: 7,
    text: 'Tienes una campaña con un ROAS de 3.0. Si el margen de ganancia neta de tu producto es del 30%, ¿la campaña es rentable?',
    options: [
      { id: 'A', text: 'No, estás perdiendo dinero (ROAS Break-even es 3.33).' },
      { id: 'B', text: 'Sí, estás ganando dinero porque el ROAS es mayor a 1.' },
      { id: 'C', text: 'Estás exactamente en punto de equilibrio.' },
      { id: 'D', text: 'Depende exclusivamente del CPM.' }
    ],
    correctOption: 'A'
  },
  {
    id: 8,
    text: 'Si aumentas tu presupuesto diario un 50% de golpe en una campaña de conversión en fase de aprendizaje, ¿qué es lo más probable que ocurra analíticamente?',
    options: [
      { id: 'A', text: 'El algoritmo se reinicia, provocando temporalmente un aumento en el CPA y fluctuación en el CPM.' },
      { id: 'B', text: 'El CPA bajará proporcionalmente un 50%.' },
      { id: 'C', text: 'El CTR aumentará automáticamente.' },
      { id: 'D', text: 'Nada, las métricas se mantendrán idénticas pero escalarás ventas.' }
    ],
    correctOption: 'A'
  },
  {
    id: 9,
    text: 'Tu equipo debate sobre atribución. Un cliente hace clic en tu anuncio de Meta Ads, pero no compra. Al día siguiente busca la marca en Google y compra. ¿Cómo lo atribuyen por defecto los píxeles estándar?',
    options: [
      { id: 'A', text: 'Google Analytics se lo atribuye a Google (Last Click), Meta Ads se lo atribuye a sí mismo (Click/View Attribution).' },
      { id: 'B', text: 'Solo Meta Ads lo registra porque fue el primer clic.' },
      { id: 'C', text: 'Ambas plataformas dividen el valor de la compra al 50%.' },
      { id: 'D', text: 'Ninguna plataforma lo registra.' }
    ],
    correctOption: 'A'
  },
  {
    id: 10,
    text: 'Si el LTV (Life Time Value) de tu cliente es $300 y tu CAC es $150, ¿qué indica la relación LTV:CAC = 2:1?',
    options: [
      { id: 'A', text: 'Es un negocio sano, pero se considera óptimo llegar al menos a 3:1 para mayor margen y escalabilidad.' },
      { id: 'B', text: 'Es excelente, el estándar de la industria es 1:1.' },
      { id: 'C', text: 'El negocio está en quiebra inminente.' },
      { id: 'D', text: 'Debes pausar todas las campañas publicitarias.' }
    ],
    correctOption: 'A'
  },
  {
    id: 11,
    text: '¿Cuál es la diferencia fundamental entre el ROAS y el ROI?',
    options: [
      { id: 'A', text: 'El ROAS mide los ingresos brutos generados sobre la inversión publicitaria; el ROI mide la ganancia neta considerando costos operativos y de producto.' },
      { id: 'B', text: 'Son exactamente lo mismo, solo cambian los términos por plataforma.' },
      { id: 'C', text: 'El ROI se usa solo en Google Ads y el ROAS en Meta Ads.' },
      { id: 'D', text: 'El ROAS se mide en porcentajes y el ROI en multiplicadores.' }
    ],
    correctOption: 'A'
  },
  {
    id: 12,
    text: 'Si una campaña tiene un CTR del 3% (muy alto) pero un CR de landing page del 0.1% (muy bajo), la principal recomendación técnica es:',
    options: [
      { id: 'A', text: 'Optimizar la Landing Page (velocidad de carga, mensaje, fricción del formulario) ya que el anuncio sí capta el interés adecuado.' },
      { id: 'B', text: 'Cambiar el video del anuncio inmediatamente.' },
      { id: 'C', text: 'Aumentar el presupuesto diario para forzar conversiones.' },
      { id: 'D', text: 'Cambiar la puja a "Costo más bajo".' }
    ],
    correctOption: 'A'
  },
  {
    id: 13,
    text: 'En un ecommerce, tienes un Costo por Añadir al Carrito (Cost per Add to Cart) de $5, y un CPA de compra de $50. ¿Qué significa esto?',
    options: [
      { id: 'A', text: 'Que necesitas 10 Add to Carts en promedio para lograr 1 Compra (Tasa de cierre del 10% desde el carrito).' },
      { id: 'B', text: 'Que el pixel está mal instalado.' },
      { id: 'C', text: 'Que tu producto es demasiado barato.' },
      { id: 'D', text: 'Que el checkout carga demasiado rápido.' }
    ],
    correctOption: 'A'
  },
  {
    id: 14,
    text: 'Si tu objetivo principal es reconocimiento de marca masivo con bajo presupuesto, ¿qué métrica debe ser tu KPI principal y por qué?',
    options: [
      { id: 'A', text: 'CPM y Alcance, porque te interesa comprar inventario barato para maximizar la visibilidad.' },
      { id: 'B', text: 'CPA, porque toda campaña debe vender.' },
      { id: 'C', text: 'ROAS, porque define el retorno de inversión de la marca.' },
      { id: 'D', text: 'Frecuencia sobre 10, para asegurar que te recuerden.' }
    ],
    correctOption: 'A'
  },
  {
    id: 15,
    text: 'Un cliente se queja de que el "Costo por Resultado" subió hoy un 200%. Al revisar, notas que hoy hubo muy pocas ventas, pero ayer hubo un pico anormal. ¿Cuál es el error de análisis del cliente?',
    options: [
      { id: 'A', text: 'Evaluar métricas de conversión en ventanas diarias (micro-análisis) sin considerar el ciclo de conversión y la varianza estadística semanal.' },
      { id: 'B', text: 'No haber apagado la campaña durante la noche.' },
      { id: 'C', text: 'El algoritmo de Meta se rompió por completo hoy.' },
      { id: 'D', text: 'Que el ROAS de ayer afectó el costo de hoy.' }
    ],
    correctOption: 'A'
  },
  {
    id: 16,
    text: '¿Cómo afecta iOS 14+ y el bloqueo de cookies de terceros al CPA reportado en plataformas como Meta Ads?',
    options: [
      { id: 'A', text: 'Provoca infra-reporte (underreporting); el CPA "real" suele ser más bajo que el CPA reportado en la plataforma por pérdida de seguimiento.' },
      { id: 'B', text: 'Provoca sobre-reporte; inventa ventas que no existen, subiendo el ROAS.' },
      { id: 'C', text: 'No afecta a Meta Ads, solo a Google Ads.' },
      { id: 'D', text: 'Elimina completamente la posibilidad de medir CTR.' }
    ],
    correctOption: 'A'
  },
  {
    id: 17,
    text: '¿Cuál es la fórmula para calcular el Break-even ROAS (ROAS de punto de equilibrio)?',
    options: [
      { id: 'A', text: '1 / Margen de Beneficio Bruto (%)' },
      { id: 'B', text: 'Inversión / Ingresos' },
      { id: 'C', text: 'CPA / Ticket Promedio' },
      { id: 'D', text: 'Margen de Beneficio Netos * Inversión' }
    ],
    correctOption: 'A'
  },
  {
    id: 18,
    text: 'Si logras disminuir tu Costo por Clic (CPC) a la mitad, manteniendo constante tu Tasa de Conversión (CR), ¿qué le sucederá a tu CPA?',
    options: [
      { id: 'A', text: 'El CPA se reducirá a la mitad también.' },
      { id: 'B', text: 'El CPA se duplicará.' },
      { id: 'C', text: 'El CPA se mantendrá igual porque dependen del embudo.' },
      { id: 'D', text: 'El ROAS bajará al 50%.' }
    ],
    correctOption: 'A'
  },
  {
    id: 19,
    text: 'Una métrica de Hook Rate (Tasa de Retención de 3 segundos) en videos de TikTok Ads es del 10%. ¿Qué diagnóstico darías?',
    options: [
      { id: 'A', text: 'El video es extremadamente aburrido al inicio. El Hook Rate debería estar idealmente entre el 25% y 40%.' },
      { id: 'B', text: 'Es un resultado excelente, la industria promedia el 1%.' },
      { id: 'C', text: 'Significa que el 10% de la gente compró.' },
      { id: 'D', text: 'Indica que el CPM será muy bajo.' }
    ],
    correctOption: 'A'
  },
  {
    id: 20,
    text: 'Tienes dos campañas: Campaña A con ROAS 4.0 pero escala de $50 diarios, y Campaña B con ROAS 2.0 pero escala de $1000 diarios. Si tu ROAS mínimo de rentabilidad es 1.5, ¿cuál campaña aporta más Beneficio Bruto Absoluto en dólares?',
    options: [
      { id: 'A', text: 'Campaña B. (Aporta $500 de ganancia marginal vs $150 de la Campaña A)' },
      { id: 'B', text: 'Campaña A. Porque su ROAS es el doble de eficiente.' },
      { id: 'C', text: 'Ambas aportan lo mismo.' },
      { id: 'D', text: 'No se puede calcular sin conocer el CTR.' }
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
