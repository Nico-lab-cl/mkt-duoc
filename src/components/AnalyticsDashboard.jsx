import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Users, 
  RefreshCw, 
  PieChart, 
  Layout, 
  MessageSquare, 
  Wand2, 
  Zap, 
  MessageCircle, 
  QrCode, 
  Layers
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [groupId, setGroupId] = useState('999');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredTimelinePoint, setHoveredTimelinePoint] = useState(null);
  const [hoveredSocialBar, setHoveredSocialBar] = useState(null);
  const [hoveredScoreBar, setHoveredScoreBar] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/stats?groupId=${groupId}`);
      const resData = await response.json();
      if (resData.success) {
        setData(resData);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [groupId]);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <RefreshCw className="text-blue-500 animate-spin" size={40} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando Analíticas...</p>
      </div>
    );
  }

  const { summary, moduleUsage, leadsRange, leadsSocial, scoreDistribution, leadsTimeline } = data;

  // --- Helpers para Gráficos SVG ---
  
  // 1. Donut Chart para Leads Range
  const totalLeadsRange = leadsRange?.reduce((sum, item) => sum + item.value, 0) || 0;
  let accumulatedPercent = 0;
  const donutColors = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#8b5cf6', // violet
    '#f59e0b', // amber
    '#ec4899', // pink
    '#06b6d4', // cyan
  ];

  // 2. Módulo traducción estética
  const getModuleName = (id) => {
    const names = {
      meta: 'Meta Ads',
      chatflow: 'M. Conversacional',
      kpi: 'KPI Lab',
      leadmagnet: 'Lead Magnet Studio',
      n8n: 'N8N Automatizaciones',
      whatsapp: 'WhatsApp Integración',
      qr: 'Generador QR'
    };
    return names[id] || id;
  };

  const getModuleIcon = (id, size = 16) => {
    const icons = {
      meta: <Layout size={size} />,
      chatflow: <MessageSquare size={size} />,
      kpi: <BarChart3 size={size} />,
      leadmagnet: <Wand2 size={size} />,
      n8n: <Zap size={size} />,
      whatsapp: <MessageCircle size={size} />,
      qr: <QrCode size={size} />
    };
    return icons[id] || <Layers size={size} />;
  };

  const getModuleColor = (id) => {
    const colors = {
      meta: 'bg-blue-500 text-blue-600',
      chatflow: 'bg-emerald-500 text-emerald-600',
      kpi: 'bg-violet-500 text-violet-600',
      leadmagnet: 'bg-fuchsia-500 text-fuchsia-600',
      n8n: 'bg-orange-500 text-orange-600',
      whatsapp: 'bg-green-500 text-green-600',
      qr: 'bg-slate-700 text-slate-800'
    };
    return colors[id] || 'bg-slate-500 text-slate-600';
  };

  // 3. SVG Line Path Generator para Leads Timeline
  const generateLinePath = (points, width, height) => {
    if (!points || points.length === 0) return '';
    const maxVal = Math.max(...points.map(p => p.count), 5);
    const xStep = width / (points.length - 1 || 1);
    
    return points.map((p, i) => {
      const x = i * xStep;
      const y = height - (p.count / maxVal) * (height - 20) - 10;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const generateAreaPath = (points, width, height) => {
    if (!points || points.length === 0) return '';
    const linePath = generateLinePath(points, width, height);
    const xStep = width / (points.length - 1 || 1);
    const lastX = (points.length - 1) * xStep;
    return `${linePath} L ${lastX} ${height} L 0 ${height} Z`;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* HEADER CONTROL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">Panel de Estadísticas</h3>
          <p className="text-slate-500 text-sm font-medium">Analiza en tiempo real el comportamiento, métricas y captación de alumnos.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filtrar por Grupo:</label>
          <select 
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100 cursor-pointer"
          >
            <option value="all">Todos los Equipos</option>
            <option value="1">Equipo 1</option>
            <option value="2">Equipo 2</option>
            <option value="3">Equipo 3</option>
            <option value="999">Feria Vocacional (Invitados)</option>
          </select>
          <button 
            onClick={fetchStats}
            className="p-2 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            title="Refrescar Datos"
          >
            <RefreshCw size={18} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Leads Captados</span>
          </div>
          <p className="text-4xl font-black text-slate-800 tracking-tighter mb-1">{summary.leadsCount}</p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Feria Vocacional</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Módulos Abiertos</span>
          </div>
          <p className="text-4xl font-black text-slate-800 tracking-tighter mb-1">
            {moduleUsage.reduce((sum, item) => sum + item.value, 0)}
          </p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Clicks e Interacciones</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Award size={20} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nota Promedio KPI</span>
          </div>
          <p className="text-4xl font-black text-slate-800 tracking-tighter mb-1">{summary.avgScore} <span className="text-sm font-bold text-slate-400">/ 10</span></p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{summary.evaluationsCount} Alumnos evaluados</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <QrCode size={20} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Escaneos de QRs</span>
          </div>
          <p className="text-4xl font-black text-slate-800 tracking-tighter mb-1">{summary.qrScansCount}</p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Enlaces acortados activos</p>
        </div>
      </div>

      {/* SECUNDARIOS CARD DETALLES ENTREGAS */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Meta Campaigns</span>
          <span className="text-lg font-extrabold text-slate-800">{summary.campaignsCount}</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Chatbots Diseñados</span>
          <span className="text-lg font-extrabold text-slate-800">{summary.chatflowsCount}</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Lead Magnets Creados</span>
          <span className="text-lg font-extrabold text-slate-800">{summary.leadMagnetsCount}</span>
        </div>
      </div>

      {/* CHARTS LAYER 1: TIMELINE & MODULE ACCESS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CHART: REGISTRO DE LEADS EN EL TIEMPO */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <h4 className="text-lg font-black text-slate-800 tracking-tighter uppercase italic mb-6">Registro de Leads en el Tiempo</h4>
          {leadsTimeline.length > 0 ? (
            <div className="relative">
              {/* Timeline SVG Container */}
              <div className="h-64 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  {[0, 1, 2, 3, 4].map((grid, gIdx) => (
                    <line 
                      key={grid} 
                      x1="0" 
                      y1={10 + grid * 45} 
                      x2="500" 
                      y2={10 + grid * 45} 
                      stroke="#f1f5f9" 
                      strokeDasharray="4 4" 
                      strokeWidth="1.5"
                    />
                  ))}

                  {/* Gradient Area */}
                  <path 
                    d={generateAreaPath(leadsTimeline, 500, 200)} 
                    fill="url(#areaGrad)" 
                  />

                  {/* Connection Line */}
                  <path 
                    d={generateLinePath(leadsTimeline, 500, 200)} 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />

                  {/* Hover Tracker Line */}
                  {hoveredTimelinePoint !== null && (
                    <line 
                      x1={hoveredTimelinePoint * (500 / (leadsTimeline.length - 1))} 
                      y1="0" 
                      x2={hoveredTimelinePoint * (500 / (leadsTimeline.length - 1))} 
                      y2="200" 
                      stroke="#94a3b8" 
                      strokeWidth="1" 
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Data Nodes */}
                  {leadsTimeline.map((p, i) => {
                    const maxVal = Math.max(...leadsTimeline.map(pt => pt.count), 5);
                    const x = i * (500 / (leadsTimeline.length - 1 || 1));
                    const y = 200 - (p.count / maxVal) * 180 - 10;
                    return (
                      <circle 
                        key={i} 
                        cx={x} 
                        cy={y} 
                        r={hoveredTimelinePoint === i ? "6" : "4"} 
                        fill={hoveredTimelinePoint === i ? "#2563eb" : "#3b82f6"} 
                        stroke="white" 
                        strokeWidth="2"
                        className="transition-all cursor-pointer"
                        onMouseEnter={() => setHoveredTimelinePoint(i)}
                        onMouseLeave={() => setHoveredTimelinePoint(null)}
                      />
                    );
                  })}
                </svg>

                {/* Timeline Hover Tooltip */}
                {hoveredTimelinePoint !== null && (
                  <div 
                    className="absolute bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xl border border-slate-700 pointer-events-none z-20"
                    style={{
                      left: `${Math.min(80, hoveredTimelinePoint * (100 / (leadsTimeline.length - 1)))}%`,
                      top: '10px',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <p className="text-[10px] text-slate-400">{leadsTimeline[hoveredTimelinePoint].time}</p>
                    <p className="text-cyan-400 font-extrabold">{leadsTimeline[hoveredTimelinePoint].count} Leads</p>
                  </div>
                )}
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between mt-2 px-1">
                {leadsTimeline.map((p, i) => (
                  <span key={i} className="text-[10px] font-bold text-slate-400">{p.time}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl">
              <span className="text-slate-400 text-sm font-bold">Sin datos para esta vista</span>
            </div>
          )}
        </div>

        {/* CHART: APERTURA DE MÓDULOS */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <h4 className="text-lg font-black text-slate-800 tracking-tighter uppercase italic mb-6">Uso y Accesos por Módulo</h4>
          {moduleUsage.length > 0 ? (
            <div className="space-y-4">
              {moduleUsage.map((mod, index) => {
                const maxVal = Math.max(...moduleUsage.map(m => m.value), 1);
                const percent = (mod.value / maxVal) * 100;
                return (
                  <div 
                    key={mod.name} 
                    className="space-y-1.5"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-700">
                        <div className={`p-1.5 rounded-lg ${getModuleColor(mod.name).split(' ')[0]} bg-opacity-15 ${getModuleColor(mod.name).split(' ')[1]}`}>
                          {getModuleIcon(mod.name, 14)}
                        </div>
                        {getModuleName(mod.name)}
                      </div>
                      <span className="font-extrabold text-slate-800">{mod.value} clicks</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/50">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${
                          mod.name === 'meta' ? 'from-blue-400 to-blue-600' :
                          mod.name === 'chatflow' ? 'from-emerald-400 to-emerald-600' :
                          mod.name === 'kpi' ? 'from-violet-400 to-violet-600' :
                          mod.name === 'leadmagnet' ? 'from-fuchsia-400 to-fuchsia-600' :
                          mod.name === 'n8n' ? 'from-orange-400 to-orange-600' :
                          mod.name === 'whatsapp' ? 'from-green-400 to-green-600' :
                          'from-slate-500 to-slate-700'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                      
                      {/* Tooltip on bar hover */}
                      {hoveredBar === index && (
                        <div className="absolute right-2 top-0 bottom-0 flex items-center">
                          <span className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow">
                            {Math.round(percent)}% del máximo
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 rounded-2xl">
              <span className="text-slate-400 text-sm font-bold">Aún no se registran aperturas</span>
            </div>
          )}
        </div>
      </div>

      {/* CHARTS LAYER 2: LEADS RANGE & SOCIAL PREFERENCES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CHART: DONUT CHART DE CARRERAS ASIGNADAS */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <h4 className="text-lg font-black text-slate-800 tracking-tighter uppercase italic mb-6">Rangos y Perfiles Asignados</h4>
          {leadsRange.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Donut SVG */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                  {leadsRange.map((item, index) => {
                    const percent = (item.value / totalLeadsRange) * 100;
                    const strokeDasharray = `${percent} ${100 - percent}`;
                    const strokeDashoffset = 100 - accumulatedPercent;
                    accumulatedPercent += percent;
                    
                    const color = donutColors[index % donutColors.length];
                    const isHovered = hoveredSlice === index;
                    
                    return (
                      <circle 
                        key={item.name}
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent" 
                        stroke={color} 
                        strokeWidth={isHovered ? "14" : "12"} 
                        strokeDasharray={strokeDasharray} 
                        strokeDashoffset={strokeDashoffset}
                        pathLength="100"
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredSlice(index)}
                        onMouseLeave={() => setHoveredSlice(null)}
                      />
                    );
                  })}
                </svg>

                {/* Donut center metrics */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  {hoveredSlice !== null ? (
                    <>
                      <span className="text-2xl font-black text-slate-800">
                        {Math.round((leadsRange[hoveredSlice].value / totalLeadsRange) * 100)}%
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest max-w-[100px] truncate">
                        {leadsRange[hoveredSlice].name}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-black text-slate-800">{totalLeadsRange}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leads Totales</span>
                    </>
                  )}
                </div>
              </div>

              {/* Legends */}
              <div className="flex-grow space-y-2">
                {leadsRange.map((item, index) => {
                  const percent = Math.round((item.value / totalLeadsRange) * 100) || 0;
                  const color = donutColors[index % donutColors.length];
                  return (
                    <div 
                      key={item.name} 
                      className={`flex items-center justify-between p-2 rounded-xl transition-all ${hoveredSlice === index ? 'bg-slate-50 scale-102 border-l-4' : 'border-l-4 border-transparent'}`}
                      style={{ borderLeftColor: hoveredSlice === index ? color : 'transparent' }}
                      onMouseEnter={() => setHoveredSlice(index)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-xs font-bold text-slate-700 truncate">{item.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-800 pl-4">{item.value} ({percent}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center border border-dashed border-slate-200 rounded-2xl">
              <span className="text-slate-400 text-sm font-bold">Sin datos para perfiles vocacionales</span>
            </div>
          )}
        </div>

        {/* CHART: REDES SOCIALES FAVORITAS */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <h4 className="text-lg font-black text-slate-800 tracking-tighter uppercase italic mb-6">Red Social Favorita de los Leads</h4>
          {leadsSocial.length > 0 ? (
            <div className="h-56 flex items-end gap-6 pt-6">
              {leadsSocial.map((item, index) => {
                const maxVal = Math.max(...leadsSocial.map(s => s.value), 1);
                const heightPercent = (item.value / maxVal) * 80; // max height is 80%
                const barColors = [
                  'from-purple-500 to-indigo-600',
                  'from-slate-900 to-black',
                  'from-green-400 to-green-600',
                  'from-blue-600 to-blue-800',
                  'from-blue-400 to-blue-500',
                ];
                
                return (
                  <div 
                    key={item.name} 
                    className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                    onMouseEnter={() => setHoveredSocialBar(index)}
                    onMouseLeave={() => setHoveredSocialBar(null)}
                  >
                    {/* Val top */}
                    <span className={`text-[10px] font-extrabold text-slate-700 mb-2 transition-all ${hoveredSocialBar === index ? 'scale-125 text-indigo-600' : ''}`}>
                      {item.value}
                    </span>

                    {/* Styled Vertical Bar */}
                    <div 
                      className={`w-full rounded-t-xl bg-gradient-to-t transition-all duration-700 ease-out shadow-sm group-hover:shadow-lg ${barColors[index % barColors.length]}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    
                    {/* Channel Label */}
                    <span className="text-[10px] font-bold text-slate-500 mt-3 truncate max-w-[65px] text-center">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center border border-dashed border-slate-200 rounded-2xl">
              <span className="text-slate-400 text-sm font-bold">Sin datos de redes sociales</span>
            </div>
          )}
        </div>
      </div>

      {/* CHART LAYER 3: EVALUATION SCORE DISTRIBUTION */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
        <h4 className="text-lg font-black text-slate-800 tracking-tighter uppercase italic mb-6">Distribución de Calificaciones (Examen KPI)</h4>
        {scoreDistribution.length > 0 ? (
          <div className="h-64 flex items-end gap-3 pt-6 border-b border-slate-100 pb-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
              const scoreData = scoreDistribution.find(d => parseInt(d.score) === score) || { score, count: 0 };
              const maxVal = Math.max(...scoreDistribution.map(s => s.count), 1);
              const heightPercent = (scoreData.count / maxVal) * 80;
              const isHigh = score >= 7;
              
              return (
                <div 
                  key={score} 
                  className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  onMouseEnter={() => setHoveredScoreBar(score)}
                  onMouseLeave={() => setHoveredScoreBar(null)}
                >
                  {/* Tooltip on score bar */}
                  {hoveredScoreBar === score && scoreData.count > 0 && (
                    <div className="absolute bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-xl -top-12 z-20 pointer-events-none whitespace-nowrap">
                      {scoreData.count} {scoreData.count === 1 ? 'Alumno' : 'Alumnos'}
                    </div>
                  )}

                  <span className={`text-[10px] font-extrabold text-slate-650 mb-1 ${hoveredScoreBar === score ? 'text-blue-600 scale-110' : ''}`}>
                    {scoreData.count > 0 ? scoreData.count : ''}
                  </span>

                  <div 
                    className={`w-full rounded-t-lg transition-all duration-500 bg-gradient-to-t ${
                      scoreData.count === 0 ? 'bg-slate-100' : (
                        isHigh ? 'from-emerald-400 to-emerald-500' : 'from-blue-400 to-blue-500'
                      )
                    }`}
                    style={{ height: `${scoreData.count === 0 ? '4px' : `${heightPercent}%`}` }}
                  />

                  <span className={`text-xs font-black mt-2 ${hoveredScoreBar === score ? 'text-slate-800 scale-125' : 'text-slate-400'}`}>
                    {score}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center border border-dashed border-slate-200 rounded-2xl">
            <span className="text-slate-400 text-sm font-bold">Aún no hay evaluaciones aprobadas</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
