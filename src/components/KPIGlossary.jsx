import React, { useState } from 'react';
import { kpiData } from '../data/kpis';

const KPIGlossary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');

  const filteredKPIs = kpiData.filter(kpi => {
    const matchesSearch = kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          kpi.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todas' || kpi.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-900 min-h-screen p-8 text-slate-200 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-slate-700 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Glosario Interactivo de KPIs</h1>
          <p className="text-slate-400">Domina las métricas de Meta Ads para tomar decisiones estratégicas.</p>
        </header>

        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <div className="flex gap-2">
            {['Todas', 'Atracción', 'Conversión'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input 
            type="text" 
            placeholder="Buscar KPI..." 
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKPIs.map(kpi => (
            <div key={kpi.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-blue-900/20 transition-all flex flex-col h-full">
              <div className="mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  kpi.category === 'Atracción' 
                    ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50' 
                    : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'
                }`}>
                  {kpi.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{kpi.name}</h3>
              <p className="text-sm text-slate-400 mb-4 flex-grow">{kpi.definition}</p>
              
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 mb-4">
                <p className="text-xs text-slate-500 mb-1">Fórmula</p>
                <code className="text-sm font-mono text-blue-400">{kpi.formula}</code>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Contexto de Aplicación</p>
                  <p className="text-sm text-slate-300">{kpi.application_context}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">¿Bueno o Malo?</p>
                  <p className="text-sm text-slate-300 border-l-2 border-blue-500 pl-2">{kpi.good_vs_bad}</p>
                </div>
              </div>
            </div>
          ))}
          {filteredKPIs.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No se encontraron KPIs que coincidan con tu búsqueda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPIGlossary;
