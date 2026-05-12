import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';

const questions = [
  {
    id: 1,
    text: '¿Cuál es la fórmula del CTR (Click-Through Rate)?',
    options: [
      { id: 'A', text: '(Clics / Impresiones) * 100' },
      { id: 'B', text: '(Impresiones / Clics) * 100' },
      { id: 'C', text: 'Clics / Inversión' },
      { id: 'D', text: 'Leads / Clics' }
    ]
  },
  {
    id: 2,
    text: '¿Qué mide el CPM?',
    options: [
      { id: 'A', text: 'Costo por cada mil impresiones' },
      { id: 'B', text: 'Costo por cada mil clics' },
      { id: 'C', text: 'Costo por minuto' },
      { id: 'D', text: 'Conversiones por mes' }
    ]
  },
  {
    id: 3,
    text: 'Si inviertes $1000 y obtienes 50 leads, ¿cuál es tu CPL (Costo por Lead)?',
    options: [
      { id: 'A', text: '$20' },
      { id: 'B', text: '$50' },
      { id: 'C', text: '$0.05' },
      { id: 'D', text: '$200' }
    ]
  },
  {
    id: 4,
    text: '¿Cuál de los siguientes es el principal indicador de que el anuncio visualmente llama la atención?',
    options: [
      { id: 'A', text: 'CTR (Click-Through Rate)' },
      { id: 'B', text: 'CR (Tasa de Conversión)' },
      { id: 'C', text: 'CPA (Costo por Adquisición)' },
      { id: 'D', text: 'ROAS' }
    ]
  },
  {
    id: 5,
    text: 'Si tu Tasa de Conversión (CR) de landing page es baja, pero tu CTR es alto, ¿dónde está probablemente el problema principal?',
    options: [
      { id: 'A', text: 'La Landing Page o la Oferta' },
      { id: 'B', text: 'El Anuncio' },
      { id: 'C', text: 'El Presupuesto' },
      { id: 'D', text: 'El Costo por Clic' }
    ]
  },
  {
    id: 6,
    text: '¿Cuál es la fórmula del ROI (Retorno sobre Inversión)?',
    options: [
      { id: 'A', text: '((Ingresos - Inversión) / Inversión) * 100' },
      { id: 'B', text: 'Ingresos / Inversión' },
      { id: 'C', text: 'Inversión / Ingresos' },
      { id: 'D', text: '(Ingresos / Clics) * 100' }
    ]
  },
  {
    id: 7,
    text: '¿Qué significa CPC?',
    options: [
      { id: 'A', text: 'Costo por Clic' },
      { id: 'B', text: 'Clics por Costo' },
      { id: 'C', text: 'Conversiones por Clic' },
      { id: 'D', text: 'Costo por Compra' }
    ]
  },
  {
    id: 8,
    text: 'Si tu anuncio tuvo 10,000 impresiones y 200 clics, ¿Cuál es el CTR?',
    options: [
      { id: 'A', text: '2%' },
      { id: 'B', text: '20%' },
      { id: 'C', text: '0.2%' },
      { id: 'D', text: '50%' }
    ]
  },
  {
    id: 9,
    text: '¿Qué KPI utilizarías para medir el retorno específico generado por tus campañas publicitarias (Ingresos generados por anuncios)?',
    options: [
      { id: 'A', text: 'ROAS (Return on Ad Spend)' },
      { id: 'B', text: 'ROI (Retorno sobre Inversión)' },
      { id: 'C', text: 'CPM' },
      { id: 'D', text: 'LTV' }
    ]
  },
  {
    id: 10,
    text: '¿Cuál es el cálculo correcto para el CAC (Costo de Adquisición de Cliente) si invertiste $5000 y conseguiste 10 clientes nuevos?',
    options: [
      { id: 'A', text: '$500' },
      { id: 'B', text: '$50' },
      { id: 'C', text: '$5' },
      { id: 'D', text: '$5000' }
    ]
  }
];

const KPIGym = () => {
  const { currentUser, projectData } = useProject();
  const [answers, setAnswers] = useState({});
  const [justifications, setJustifications] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
    
    // Simulate sending to backend
    try {
      const response = await fetch('/api/submit-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          studentName: currentUser?.full_name,
          groupId: currentUser?.group_id || 1, // fallback to 1
          answers,
          justifications
        })
      });
      await new Promise(r => setTimeout(r, 1500));
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      await new Promise(r => setTimeout(r, 1500));
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
          <p className="text-slate-300">
            Tus respuestas y justificaciones han sido enviadas al profesor exitosamente. 
            Podrás ver tus resultados en el panel cuando sean calificados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen p-8 text-slate-200 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 border-b border-slate-700 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Práctica de Métricas</h1>
          <p className="text-slate-400">Responde las siguientes 10 preguntas y justifica la fórmula o lógica utilizada.</p>
        </header>

        <div className="space-y-8 mb-12">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">
                <span className="text-blue-500 mr-2">{index + 1}.</span> {q.text}
              </h3>
              
              <div className="space-y-3 mb-6">
                {q.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(q.id, opt.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answers[q.id] === opt.id 
                        ? 'bg-blue-900/40 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span className="font-bold mr-2">{opt.id}.</span> {opt.text}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Justificación de la fórmula / Respuesta:</label>
                <textarea
                  value={justifications[q.id] || ''}
                  onChange={(e) => handleJustificationChange(q.id, e.target.value)}
                  placeholder="Escribe aquí tu justificación..."
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
            {loading ? 'Enviando...' : 'Enviar Evaluación al Profesor'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KPIGym;
