import React, { useState, useEffect, useMemo } from 'react';
import { kpiData } from '../data/kpis';

const generateCase = () => {
  const inversion = Math.floor(Math.random() * 900) + 100; // 100 to 1000
  const impresiones = Math.floor(Math.random() * 90000) + 10000; // 10000 to 100000
  const clics = Math.floor(Math.random() * (impresiones * 0.05)) + 50; // Max 5% CTR
  const leads = Math.floor(Math.random() * (clics * 0.2)) + 5; // Max 20% CR
  const productPrice = Math.floor(Math.random() * 80) + 20; // 20 to 100
  
  return { inversion, impresiones, clics, leads, productPrice };
};

const roundToTwo = (num) => Math.round(num * 100) / 100;

const KPIGym = () => {
  const [businessCase, setBusinessCase] = useState(null);
  const [answers, setAnswers] = useState({
    cpm: '',
    ctr: '',
    cpc: '',
    cpl: ''
  });
  
  const [validation, setValidation] = useState({
    cpm: null,
    ctr: null,
    cpc: null,
    cpl: null
  });

  const [allCorrect, setAllCorrect] = useState(false);
  const [strategyAnswer, setStrategyAnswer] = useState(null);

  useEffect(() => {
    setBusinessCase(generateCase());
  }, []);

  const correctValues = useMemo(() => {
    if (!businessCase) return {};
    return {
      cpm: roundToTwo((businessCase.inversion / businessCase.impresiones) * 1000),
      ctr: roundToTwo((businessCase.clics / businessCase.impresiones) * 100),
      cpc: roundToTwo(businessCase.inversion / businessCase.clics),
      cpl: roundToTwo(businessCase.inversion / businessCase.leads)
    };
  }, [businessCase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
    // Reset validation when user types
    setValidation(prev => ({ ...prev, [name]: null }));
  };

  const checkAnswers = () => {
    let newValidation = { ...validation };
    let correctCount = 0;

    Object.keys(answers).forEach(key => {
      const userAnswer = parseFloat(answers[key]);
      if (isNaN(userAnswer)) {
        newValidation[key] = false;
      } else {
        // Accept answers with a small margin of error (0.05) due to rounding
        const isCorrect = Math.abs(userAnswer - correctValues[key]) <= 0.05;
        newValidation[key] = isCorrect;
        if (isCorrect) correctCount++;
      }
    });

    setValidation(newValidation);

    if (correctCount === 4) {
      setAllCorrect(true);
    }
  };

  const getTooltip = (key) => {
    if (validation[key] === false) {
      const kpiEntry = kpiData.find(k => k.id === key);
      if (kpiEntry && kpiEntry.formula) {
        return `Recuerda la fórmula: ${kpiEntry.formula}`;
      }
      return "Fórmula no encontrada. Vuelve a intentarlo.";
    }
    return null;
  };

  const renderInputCard = (title, key, prefix, suffix = '') => {
    const isError = validation[key] === false;
    const isSuccess = validation[key] === true;

    return (
      <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative">
        <label className="block text-sm font-bold text-slate-300 mb-2">{title}</label>
        <div className="relative">
          {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{prefix}</span>}
          <input
            type="number"
            step="0.01"
            name={key}
            value={answers[key]}
            onChange={handleChange}
            className={`w-full bg-slate-900 border ${
              isError ? 'border-red-500 focus:ring-red-500' : isSuccess ? 'border-emerald-500 focus:ring-emerald-500' : 'border-slate-600 focus:ring-blue-500'
            } rounded-lg py-3 ${prefix ? 'pl-8' : 'pl-4'} pr-8 text-white focus:outline-none focus:ring-2 font-mono text-lg transition-colors`}
            placeholder="0.00"
            disabled={allCorrect}
          />
          {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{suffix}</span>}
        </div>
        
        {isError && (
          <div className="mt-3 text-sm text-red-300 bg-red-900/40 p-3 rounded-lg border border-red-800/50 flex items-start gap-2">
            <span className="text-xl">💡</span>
            <p>{getTooltip(key)} Vuelve a intentarlo.</p>
          </div>
        )}
      </div>
    );
  };

  if (!businessCase) return <div className="p-8 text-white min-h-screen bg-slate-900 flex items-center justify-center">Generando caso...</div>;

  return (
    <div className="bg-slate-900 min-h-screen p-8 text-slate-200 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 border-b border-slate-700 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Gimnasio de Métricas</h1>
          <p className="text-slate-400">Pon a prueba tu conocimiento matemático y analítico con casos de negocio simulados.</p>
        </header>

        <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-800/50 rounded-2xl p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
            📊 Caso de Negocio Activo
          </h2>
          
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <p className="text-lg text-slate-300 leading-relaxed">
              Tu cliente invirtió <strong className="text-white bg-slate-800 px-2 py-1 rounded">${businessCase.inversion} USD</strong> en Meta Ads. 
              El anuncio se mostró <strong className="text-white bg-slate-800 px-2 py-1 rounded">{businessCase.impresiones.toLocaleString()} veces</strong> y consiguió <strong className="text-white bg-slate-800 px-2 py-1 rounded">{businessCase.clics.toLocaleString()} clics</strong>. 
              De esos clics, <strong className="text-white bg-slate-800 px-2 py-1 rounded">{businessCase.leads.toLocaleString()} personas</strong> llenaron el formulario.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {renderInputCard('Calcula el CPM (Costo por 1000 Impresiones)', 'cpm', '$')}
          {renderInputCard('Calcula el CTR (Porcentaje de Clics)', 'ctr', '', '%')}
          {renderInputCard('Calcula el CPC (Costo por Clic)', 'cpc', '$')}
          {renderInputCard('Calcula el CPL (Costo por Lead)', 'cpl', '$')}
        </div>

        {!allCorrect && (
          <div className="flex justify-end">
            <button 
              onClick={checkAnswers}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-900/50 hover:shadow-blue-600/50 transition-all text-lg"
            >
              Validar Cálculos
            </button>
          </div>
        )}

        {allCorrect && (
          <div className="mt-12 bg-slate-800 border-2 border-emerald-600/50 rounded-2xl p-8 shadow-2xl shadow-emerald-900/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-900/50 rounded-full flex items-center justify-center text-2xl border border-emerald-500/50">🏆</div>
              <div>
                <h3 className="text-2xl font-bold text-emerald-400">¡Cálculos Excelentes!</h3>
                <p className="text-slate-400">Ahora viene la decisión estratégica...</p>
              </div>
            </div>
            
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 mb-8">
              <p className="text-lg leading-relaxed">
                Viendo que el CPL es de <strong className="text-red-400 text-xl">${correctValues.cpl} USD</strong>, 
                pero tu cliente vende el producto final a <strong className="text-emerald-400 text-xl">${businessCase.productPrice} USD</strong> y 
                estadísticamente necesita <strong>3 leads</strong> para cerrar 1 venta... 
                <br/><br/>
                <span className="font-bold text-white">¿Cuál es tu decisión estratégica?</span>
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => setStrategyAnswer('A')}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  strategyAnswer === 'A' 
                    ? 'bg-blue-900/30 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <strong>A. Apagar la campaña.</strong> El costo de adquisición (CAC) supera el precio del producto. El cliente está perdiendo dinero.
              </button>
              <button 
                onClick={() => setStrategyAnswer('B')}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  strategyAnswer === 'B' 
                    ? 'bg-blue-900/30 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <strong>B. Aumentar el presupuesto.</strong> Aunque el CPL parezca alto, si generamos más volumen, seremos rentables.
              </button>
            </div>

            {strategyAnswer === 'A' && (
              <div className="mt-6 p-5 bg-emerald-900/30 border border-emerald-500/50 rounded-xl">
                <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">✓ Análisis Correcto</h4>
                <p className="text-emerald-100/80">
                  El CAC es de <strong>${(correctValues.cpl * 3).toFixed(2)} USD</strong> (3 leads * ${correctValues.cpl}). 
                  Como esto es mayor al valor de venta (${businessCase.productPrice}), el negocio no es rentable. Siempre debes cruzar marketing con finanzas. 🧠
                </p>
              </div>
            )}
            
            {strategyAnswer === 'B' && (
              <div className="mt-6 p-5 bg-red-900/30 border border-red-500/50 rounded-xl">
                <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2">✗ Análisis Incorrecto</h4>
                <p className="text-red-100/80">
                  Calcular el CAC es vital: necesitas 3 leads (${correctValues.cpl} x 3 = <strong>${(correctValues.cpl * 3).toFixed(2)} USD</strong>) para lograr una venta de ${businessCase.productPrice} USD. Estarías multiplicando pérdidas si escalas esta campaña.
                </p>
              </div>
            )}
            
            {strategyAnswer && (
              <div className="mt-8 flex justify-center border-t border-slate-700 pt-8">
                <button 
                  onClick={() => {
                    setBusinessCase(generateCase());
                    setAnswers({ cpm: '', ctr: '', cpc: '', cpl: '' });
                    setValidation({ cpm: null, ctr: null, cpc: null, cpl: null });
                    setAllCorrect(false);
                    setStrategyAnswer(null);
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>🔄</span> Generar Nuevo Caso
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIGym;
