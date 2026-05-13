import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronUp, ChevronDown, Upload, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { BLOCK_DEFS, PALETTES, CALC_TYPES, createBlock, uid, getCustomPalette } from './blockTypes';

// Editor for a specific block's data
const BlockDataEditor = ({ block, onUpdate }) => {
  const { type, data } = block;
  const fileRef = useRef(null);
  const u = (field, value) => onUpdate({ ...data, [field]: value });

  const Input = ({ label, field, placeholder, multiline, type: inputType }) => (
    <div className="mb-3">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">{label}</label>
      {multiline ? (
        <textarea value={data[field] || ''} onChange={e => u(field, e.target.value)} placeholder={placeholder} rows={4}
          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white resize-none" />
      ) : (
        <input type={inputType || 'text'} value={data[field] || ''} onChange={e => u(field, inputType === 'number' ? Number(e.target.value) : e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white font-medium" />
      )}
    </div>
  );

  const ImageUpload = ({ field, label }) => {
    const ref = useRef(null);
    const handleFile = (e) => {
      const file = e.target.files?.[0];
      if (file) { const r = new FileReader(); r.onload = (ev) => u(field, ev.target.result); r.readAsDataURL(file); }
    };
    return (
      <div className="mb-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">{label}</label>
        <input ref={ref} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        {data[field] ? (
          <div className="relative group rounded-xl overflow-hidden border border-slate-200">
            <img src={data[field]} alt="" className="w-full h-28 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => ref.current?.click()} className="px-3 py-1.5 bg-white text-slate-800 rounded-lg text-[10px] font-bold">Cambiar</button>
              <button onClick={() => u(field, null)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-bold">Quitar</button>
            </div>
          </div>
        ) : (
          <button onClick={() => ref.current?.click()} className="w-full p-5 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all flex flex-col items-center gap-1 group">
            <Upload size={18} className="text-slate-400 group-hover:text-blue-500" />
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600">Subir imagen</span>
          </button>
        )}
      </div>
    );
  };

  switch (type) {
    case 'hero':
      return (<>
        <Input label="Título" field="title" placeholder="Título principal" />
        <Input label="Subtítulo" field="subtitle" placeholder="Propuesta de valor" />
        <ImageUpload field="bgImage" label="Imagen de fondo" />
        <div className="flex items-center gap-3 mb-3">
          <input type="checkbox" checked={data.showCta || false} onChange={e => u('showCta', e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" />
          <span className="text-xs font-bold text-slate-600">Mostrar botón CTA</span>
        </div>
        {data.showCta && <Input label="Texto del botón" field="ctaText" placeholder="Descargar Gratis" />}
      </>);

    case 'text':
      return (<>
        <Input label="Encabezado (opcional)" field="heading" placeholder="Sección de texto" />
        <Input label="Contenido" field="body" placeholder="Escribe tu texto..." multiline />
        <div className="mb-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Alineación</label>
          <div className="flex gap-2">
            {['left', 'center', 'justify'].map(a => (
              <button key={a} onClick={() => u('align', a)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${data.align === a ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                {a === 'left' ? 'Izquierda' : a === 'center' ? 'Centro' : 'Justificado'}
              </button>
            ))}
          </div>
        </div>
      </>);

    case 'checklist':
      return (<>
        <Input label="Título del checklist" field="heading" placeholder="Tu Checklist" />
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Ítems</label>
        {(data.items || []).map((item, idx) => (
          <div key={item.id} className="flex items-center gap-2 mb-2 group">
            <span className="text-[10px] font-bold text-slate-300 w-4 text-center">{idx+1}</span>
            <input type="text" value={item.text} onChange={e => {
              const items = [...data.items]; items[idx] = { ...item, text: e.target.value }; u('items', items);
            }} className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white" placeholder="Ítem..." />
            <button onClick={() => { if (data.items.length > 1) u('items', data.items.filter((_,i) => i !== idx)); }}
              className="p-1 text-slate-300 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12} /></button>
          </div>
        ))}
        <button onClick={() => u('items', [...(data.items||[]), { id: uid(), text: '', done: false }])}
          className="w-full mt-1 py-2 border-2 border-dashed border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center justify-center gap-1">
          <Plus size={12} /> Agregar ítem
        </button>
      </>);

    case 'image':
      return (<>
        <ImageUpload field="src" label="Imagen" />
        <Input label="Pie de imagen" field="caption" placeholder="Descripción de la imagen" />
        <div className="flex items-center gap-3 mb-3">
          <input type="checkbox" checked={data.fullWidth !== false} onChange={e => u('fullWidth', e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" />
          <span className="text-xs font-bold text-slate-600">Ancho completo</span>
        </div>
      </>);

    case 'calculator':
      return (<>
        <Input label="Título" field="heading" placeholder="Calculadora de..." />
        <div className="mb-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Tipo de cálculo</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(CALC_TYPES).map(([key, ct]) => (
              <button key={key} onClick={() => {
                const newInputs = {}; ct.fields.forEach(f => { newInputs[f.key] = data.inputs?.[f.key] || 0; });
                u('calcType', key); u('inputs', newInputs);
              }} className={`p-2.5 rounded-xl text-[10px] font-bold border-2 transition-all ${data.calcType === key ? 'bg-blue-50 border-blue-400 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                {ct.label}
              </button>
            ))}
          </div>
        </div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Valores por defecto</label>
        {(CALC_TYPES[data.calcType]?.fields || []).map(f => (
          <div key={f.key} className="mb-2">
            <input type="number" value={data.inputs?.[f.key] || 0} onChange={e => u('inputs', { ...data.inputs, [f.key]: Number(e.target.value) })}
              placeholder={f.label} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white" />
            <span className="text-[9px] text-slate-400 mt-0.5 block">{f.label}</span>
          </div>
        ))}
      </>);

    case 'cta':
      return (<>
        <Input label="Título" field="heading" placeholder="¿Listo para empezar?" />
        <Input label="Descripción" field="description" placeholder="Texto motivacional" />
        <Input label="Texto del botón" field="buttonText" placeholder="Descargar Ahora" />
        <div className="mb-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Estilo</label>
          <div className="flex gap-2">
            {[{v:'filled',l:'Sólido'},{v:'outline',l:'Borde'}].map(s => (
              <button key={s.v} onClick={() => u('style', s.v)} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${data.style === s.v ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200 text-slate-500'}`}>{s.l}</button>
            ))}
          </div>
        </div>
      </>);

    case 'stats':
      return (<>
        <Input label="Título (opcional)" field="heading" placeholder="Nuestros resultados" />
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Métricas</label>
        {(data.items || []).map((s, idx) => (
          <div key={idx} className="flex gap-2 mb-2 group">
            <input type="text" value={s.value} onChange={e => { const items = [...data.items]; items[idx] = { ...s, value: e.target.value }; u('items', items); }}
              placeholder="85%" className="w-20 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none text-center" />
            <input type="text" value={s.label} onChange={e => { const items = [...data.items]; items[idx] = { ...s, label: e.target.value }; u('items', items); }}
              placeholder="Etiqueta" className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
            <button onClick={() => { if (data.items.length > 1) u('items', data.items.filter((_,i) => i !== idx)); }}
              className="p-1 text-slate-300 hover:text-red-500 rounded opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
          </div>
        ))}
        <button onClick={() => u('items', [...(data.items||[]), { value: '0', label: 'Métrica' }])}
          className="w-full mt-1 py-2 border-2 border-dashed border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center justify-center gap-1">
          <Plus size={12} /> Agregar métrica
        </button>
      </>);

    case 'testimonial':
      return (<>
        <Input label="Cita" field="quote" placeholder="Lo que dijo el cliente..." multiline />
        <Input label="Nombre" field="author" placeholder="María González" />
        <Input label="Cargo / Rol" field="role" placeholder="Directora de Marketing" />
      </>);

    case 'divider':
      return (
        <div className="mb-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Estilo</label>
          <div className="flex gap-2">
            {[{v:'line',l:'Línea'},{v:'dots',l:'Puntos'},{v:'space',l:'Espacio'}].map(s => (
              <button key={s.v} onClick={() => u('style', s.v)} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${data.style === s.v ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200 text-slate-500'}`}>{s.l}</button>
            ))}
          </div>
        </div>
      );

    case 'form':
      return (<>
        <Input label="Título" field="heading" placeholder="Obtén acceso ahora" />
        <Input label="Descripción" field="description" placeholder="Texto de apoyo" />
        <Input label="Texto del botón" field="buttonText" placeholder="Enviar" />
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Campos</label>
        {(data.fields || []).map((f, idx) => (
          <div key={idx} className="flex gap-2 mb-2 group">
            <input type="text" value={f} onChange={e => { const fields = [...data.fields]; fields[idx] = e.target.value; u('fields', fields); }}
              className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
            <button onClick={() => u('fields', data.fields.filter((_,i) => i !== idx))}
              className="p-1 text-slate-300 hover:text-red-500 rounded opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
          </div>
        ))}
        <button onClick={() => u('fields', [...(data.fields||[]), 'Nuevo campo'])}
          className="w-full mt-1 py-2 border-2 border-dashed border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center justify-center gap-1">
          <Plus size={12} /> Agregar campo
        </button>
      </>);

    default: return <p className="text-xs text-slate-400">Sin opciones disponibles</p>;
  }
};

// Block list + editor panel
const EditorPanel = ({ blocks, setBlocks, selectedId, setSelectedId, palette, setPalette, customHex, setCustomHex, author, setAuthor }) => {
  const updateBlock = (id, newData) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, data: newData } : b));
  };
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setBlocks(items);
  };
  const removeBlock = (id) => {
    if (blocks.length <= 1) return;
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  };
  const [showAddMenu, setShowAddMenu] = React.useState(false);
  const addBlock = (type) => {
    const newBlock = createBlock(type);
    setBlocks(prev => [...prev, newBlock]);
    setSelectedId(newBlock.id);
    setShowAddMenu(false);
  };

  const selectedBlock = blocks.find(b => b.id === selectedId);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      {/* Global settings */}
      <div className="p-4 border-b border-slate-100">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Paleta de Colores</label>
        <div className="flex gap-1.5 flex-wrap mb-3">
          {PALETTES.map(p => (
            <button key={p.id} onClick={() => setPalette(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-[10px] font-bold transition-all ${palette === p.id ? 'border-slate-800 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
              <div className={`w-3.5 h-3.5 rounded-full border border-slate-200 ${p.id === 'none' ? 'bg-white' : ''}`} style={p.id !== 'none' ? { background: p.gradient } : {}} />
              {p.name}
            </button>
          ))}
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border-2 border-slate-200 bg-slate-50">
            <input type="color" value={customHex} onChange={(e) => { setCustomHex(e.target.value); setPalette('custom'); }} className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent" />
            <span className="text-[10px] font-bold text-slate-600 uppercase">HEX</span>
          </div>
        </div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Autor / Marca</label>
        <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Tu marca"
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white font-medium" />
      </div>

      {/* Block list */}
      <div className="p-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Bloques ({blocks.length})</label>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="blocks-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1.5">
                {blocks.map((block, idx) => {
                  const def = BLOCK_DEFS[block.type];
                  const isSelected = selectedId === block.id;
                  return (
                    <Draggable key={block.id} draggableId={block.id} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => setSelectedId(isSelected ? null : block.id)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-grab active:cursor-grabbing transition-all border-2 ${isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-100 hover:border-slate-200'} ${snapshot.isDragging ? 'shadow-lg border-blue-400 z-50' : ''}`}
                        >
                          <span className="text-sm">{def?.emoji || '📦'}</span>
                          <span className={`flex-grow text-xs font-bold truncate ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                            {block.data?.title || block.data?.heading || def?.label || block.type}
                          </span>
                          <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                            <button onClick={() => removeBlock(block.id)} className="p-1 text-slate-300 hover:text-red-500 ml-1"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add block */}
        <div className="relative mt-3">
          <button onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-1.5">
            <Plus size={14} /> Agregar bloque
          </button>
          <AnimatePresence>
            {showAddMenu && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 p-2 grid grid-cols-2 gap-1">
                {Object.entries(BLOCK_DEFS).map(([key, def]) => (
                  <button key={key} onClick={() => addBlock(key)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-blue-50 text-left transition-all">
                    <span className="text-sm">{def.emoji}</span>
                    <span className="text-[10px] font-bold text-slate-600">{def.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Selected block editor */}
      <AnimatePresence>
        {selectedBlock && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-100">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{BLOCK_DEFS[selectedBlock.type]?.emoji}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Editar: {BLOCK_DEFS[selectedBlock.type]?.label}</span>
                </div>
                <button onClick={() => setSelectedId(null)} className="p-1 hover:bg-slate-100 rounded-lg"><X size={14} className="text-slate-400" /></button>
              </div>
              <BlockDataEditor block={selectedBlock} onUpdate={(newData) => updateBlock(selectedBlock.id, newData)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditorPanel;
