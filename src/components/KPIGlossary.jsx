import React, { useState, useEffect } from 'react';
import { kpiData } from '../data/kpis';
import { Search, Filter, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const KPIGlossary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = ['Todas', 'Atracción', 'Interacción', 'Conversión'];

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  const filteredKPIs = kpiData.filter(kpi => {
    const matchesSearch = kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          kpi.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todas' || kpi.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredKPIs.length / itemsPerPage);
  const currentItems = filteredKPIs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Atracción': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Interacción': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'Conversión': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="bg-[#0B1120] min-h-full p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4 text-blue-400">
             <BookOpen size={32} />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Diccionario de Métricas</h1>
          <p className="text-slate-400 text-lg">Domina los KPIs de Meta Ads, Google Ads y analítica financiera para tomar decisiones respaldadas por datos.</p>
        </header>

        {/* Filtros y Búsqueda */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <Filter size={18} className="text-slate-500 mr-2" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full lg:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar métrica (ej. CTR)..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grilla de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {currentItems.map(kpi => (
            <div key={kpi.id} className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-slate-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${getCategoryColor(kpi.category)}`}>
                  {kpi.category}
                </span>
              </div>
              
              <h3 className="text-xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors">{kpi.name}</h3>
              
              <p className="text-sm text-slate-400 mb-6 flex-grow leading-relaxed">
                {kpi.definition}
              </p>
              
              <div className="space-y-4">
                {/* Caja de Fórmula */}
                <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Fórmula Matemática</span>
                  <code className="text-sm font-mono text-blue-300 break-words">{kpi.formula}</code>
                </div>
                
                {/* Contexto y Decisión */}
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <div className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-lg">
                    <span className="text-blue-500 text-lg">👀</span>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Cuándo mirarla</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{kpi.application_context}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-lg border-l-2 border-emerald-500/50">
                    <span className="text-emerald-500 text-lg">💡</span>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Criterio de Decisión</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{kpi.good_vs_bad}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredKPIs.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="inline-flex items-center justify-center p-4 bg-slate-800 rounded-full mb-4">
                 <Search size={32} className="text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No encontramos esa métrica</h3>
              <p className="text-slate-500">Intenta buscar con otros términos o cambia la categoría de filtrado.</p>
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pb-12">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                    currentPage === idx + 1 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default KPIGlossary;
