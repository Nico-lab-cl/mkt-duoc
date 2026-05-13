import React, { useState } from 'react';
import { PALETTES, CALC_TYPES, getCustomPalette } from './blockTypes';

// Interactive calculator for preview
const CalcPreview = ({ data, palette }) => {
  const calcDef = CALC_TYPES[data.calcType] || CALC_TYPES.roi;
  const [vals, setVals] = useState(() => {
    const init = {};
    calcDef.fields.forEach(f => { init[f.key] = data.inputs?.[f.key] || 0; });
    return init;
  });
  const result = calcDef.compute(vals);

  return (
    <div style={{ padding: '32px 48px' }}>
      {data.heading && <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>{data.heading}</h3>}
      <p style={{ fontSize: '11px', fontWeight: 600, color: palette.primary, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>{calcDef.label}</p>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {calcDef.fields.map(f => (
          <div key={f.key} style={{ flex: 1, minWidth: '120px' }}>
            <label style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>{f.label}</label>
            <input
              type="number"
              value={vals[f.key]}
              onChange={e => setVals(prev => ({ ...prev, [f.key]: Number(e.target.value) }))}
              style={{ width: '100%', padding: '10px 14px', border: `2px solid ${palette.light}`, borderRadius: '10px', fontSize: '14px', fontWeight: 700, color: '#1e293b', outline: 'none', background: palette.bg }}
            />
          </div>
        ))}
      </div>
      <div style={{ background: palette.gradient, borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '32px', fontWeight: 900, color: 'white', lineHeight: 1 }}>{result.value}</p>
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>{result.label}</p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '6px' }}>{result.detail}</p>
      </div>
    </div>
  );
};

// Renders a single block in the preview
const BlockPreview = ({ block, palette, isFirst }) => {
  const { type, data } = block;
  const p = palette;
  const bg = data.blockBg;

  const wrap = (content, customStyles = {}) => (
    <div style={{ position: 'relative', overflow: 'hidden', ...customStyles }}>
      {bg && (
        <>
          <img src={bg} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.85)', zIndex: 1 }} />
        </>
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>{content}</div>
    </div>
  );

  switch (type) {
    case 'hero':
      const heroBg = data.bgImage || bg;
      return (
        <div style={{ position: 'relative', overflow: 'hidden', padding: heroBg ? '60px 48px 48px' : '40px 48px 32px', minHeight: heroBg ? '240px' : 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          {heroBg ? (
            <>
              <img src={heroBg} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: `linear-gradient(180deg, ${p.secondary}cc 0%, ${p.primary}ee 60%, ${p.primary} 100%)`, zIndex: 1 }} />
            </>
          ) : (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: p.gradient, zIndex: 0 }} />
          )}
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 2 }} />
          <div style={{ position: 'relative', zIndex: 3 }}>
            <h1 style={{ fontSize: heroBg ? '30px' : '26px', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: '10px', textShadow: heroBg ? '0 2px 12px rgba(0,0,0,0.3)' : 'none' }}>
              {data.title || 'Tu Título Aquí'}
            </h1>
            {data.subtitle && <p style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, maxWidth: '85%' }}>{data.subtitle}</p>}
            {data.showCta && data.ctaText && (
              <div style={{ marginTop: '18px' }}>
                <span style={{ display: 'inline-block', padding: '10px 24px', background: 'white', color: p.primary, fontWeight: 800, fontSize: '12px', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{data.ctaText}</span>
              </div>
            )}
          </div>
        </div>
      );

    case 'text':
      return wrap(
        <div style={{ padding: '24px 48px' }}>
          {data.heading && <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '10px', letterSpacing: '-0.3px' }}>{data.heading}</h3>}
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.8, textAlign: data.align || 'left', whiteSpace: 'pre-wrap' }}>{data.body || ''}</p>
        </div>
      );

    case 'checklist':
      return wrap(
        <div style={{ padding: '24px 48px' }}>
          {data.heading && <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '14px' }}>{data.heading}</h3>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(data.items || []).map((item, idx) => (
              <div key={item.id || idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 16px', borderRadius: '10px', background: idx % 2 === 0 ? p.bg : '#fff', border: `1px solid ${p.light}` }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '6px', border: `2.5px solid ${p.primary}`, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: p.primary }}>{idx + 1}</span>
                </div>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155', lineHeight: 1.5 }}>{item.text || '...'}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'image':
      return wrap(
        data.src ? (
          <div style={{ padding: data.fullWidth ? '0' : '24px 48px' }}>
            <img src={data.src} alt={data.caption || ''} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: data.fullWidth ? '0' : '14px' }} />
            {data.caption && <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginTop: '8px', fontStyle: 'italic', padding: '0 48px' }}>{data.caption}</p>}
          </div>
        ) : (
          <div style={{ padding: '24px 48px' }}>
            <div style={{ height: '160px', background: p.bg, borderRadius: '14px', border: `2px dashed ${p.light}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.accent, fontSize: '13px', fontWeight: 600 }}>📷 Sube una imagen</div>
          </div>
        )
      );

    case 'calculator':
      return wrap(<CalcPreview data={data} palette={p} />);

    case 'cta':
      return wrap(
        <div style={{ padding: '32px 48px', textAlign: 'center' }}>
          {data.heading && <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>{data.heading}</h3>}
          {data.description && <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '18px', maxWidth: '80%', margin: '0 auto 18px' }}>{data.description}</p>}
          <span style={{
            display: 'inline-block', padding: '14px 36px',
            background: data.style === 'outline' ? 'transparent' : p.gradient,
            color: data.style === 'outline' ? p.primary : 'white',
            border: data.style === 'outline' ? `2px solid ${p.primary}` : 'none',
            fontWeight: 800, fontSize: '13px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>{data.buttonText || 'Acción'}</span>
        </div>
      );

    case 'stats':
      return wrap(
        <div style={{ padding: '28px 48px' }}>
          {data.heading && <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginBottom: '16px', textAlign: 'center' }}>{data.heading}</h3>}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            {(data.items || []).map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', padding: '16px', background: p.bg, borderRadius: '14px', border: `1px solid ${p.light}` }}>
                <p style={{ fontSize: '28px', fontWeight: 900, color: p.primary, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'testimonial':
      return wrap(
        <div style={{ padding: '28px 48px' }}>
          <div style={{ background: p.bg, borderRadius: '16px', padding: '24px', border: `1px solid ${p.light}`, position: 'relative' }}>
            <div style={{ fontSize: '36px', color: p.accent, lineHeight: 1, marginBottom: '8px' }}>"</div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '16px' }}>{data.quote || 'Testimonio aquí...'}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: p.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 800, fontSize: '14px' }}>{(data.author || 'A')[0]}</span>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{data.author || 'Nombre'}</p>
                <p style={{ fontSize: '10px', color: '#94a3b8' }}>{data.role || 'Cargo'}</p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'divider':
      return wrap(
        <div style={{ padding: '16px 48px' }}>
          {data.style === 'dots' ? (
            <div style={{ textAlign: 'center', color: p.accent, fontSize: '18px', letterSpacing: '8px' }}>• • •</div>
          ) : data.style === 'space' ? (
            <div style={{ height: '24px' }} />
          ) : (
            <div style={{ height: '2px', background: p.light, borderRadius: '1px' }} />
          )}
        </div>
      );

    case 'form':
      return wrap(
        <div style={{ padding: '28px 48px' }}>
          <div style={{ background: p.bg, borderRadius: '16px', padding: '28px', border: `1px solid ${p.light}` }}>
            {data.heading && <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '6px', textAlign: 'center' }}>{data.heading}</h3>}
            {data.description && <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginBottom: '18px' }}>{data.description}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(data.fields || []).map((f, i) => (
                <input key={i} type="text" placeholder={f} readOnly style={{ width: '100%', padding: '11px 16px', border: `1.5px solid ${p.light}`, borderRadius: '10px', fontSize: '13px', color: '#94a3b8', background: 'white', boxSizing: 'border-box' }} />
              ))}
              <button style={{ width: '100%', padding: '12px', background: p.gradient, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{data.buttonText || 'Enviar'}</button>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

// Full page preview
const LivePreview = React.forwardRef(({ blocks, palette, resolvedPalette, author }, ref) => {
  const p = resolvedPalette || PALETTES.find(pl => pl.id === palette) || PALETTES[0];
  
  const getPalette = (pid) => {
    if (pid?.startsWith('custom-')) return getCustomPalette(pid.replace('custom-', ''));
    return PALETTES.find(pl => pl.id === pid) || p;
  };

  return (
    <div ref={ref} style={{ width: '100%', minHeight: '842px', background: 'white', fontFamily: "'Inter','Segoe UI',sans-serif", overflow: 'hidden' }} className="shadow-2xl mx-auto">
      {blocks.map((block, i) => {
        const blockPalette = getPalette(block.paletteId);
        return <BlockPreview key={block.id} block={block} palette={blockPalette} isFirst={i === 0} />;
      })}
      {/* Footer */}
      <div style={{ margin: '0 48px', padding: '20px 0', borderTop: `2px solid ${p.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: p.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: '11px', fontWeight: 900 }}>{(author || 'A')[0].toUpperCase()}</span>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b' }}>{author || 'Tu marca'}</span>
        </div>
        <span style={{ fontSize: '9px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>softwarespectra.cl</span>
      </div>
    </div>
  );
});
LivePreview.displayName = 'LivePreview';

export default LivePreview;
export { BlockPreview };
