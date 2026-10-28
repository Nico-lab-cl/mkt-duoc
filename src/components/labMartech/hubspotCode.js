/**
 * Lectura rápida del código que pegan los alumnos, para avisarles en el editor
 * si pegaron lo que corresponde antes de probar en vivo. No valida contra
 * HubSpot: solo reconoce los formatos de inserción que HubSpot entrega hoy.
 */

const portalFrom = (code) =>
  code.match(/portalId["']?\s*[:=]\s*["']?(\d+)/i)?.[1] ||
  code.match(/data-portal-id=["'](\d+)/i)?.[1] ||
  code.match(/forms\/embed\/(?:v2\/)?(\d+)\.js/i)?.[1] ||
  code.match(/hs-scripts\.com\/(\d+)\.js/i)?.[1] ||
  null;

const formIdFrom = (code) =>
  code.match(/formId["']?\s*[:=]\s*["']([\w-]+)/i)?.[1] || code.match(/data-form-id=["']([\w-]+)/i)?.[1] || null;

const isTracking = (code) => /hs-scripts\.com|hs-script-loader/i.test(code);
const isForm = (code) => /hbspt\.forms\.create|hs-form-frame|hsforms\.net\/forms\/embed/i.test(code);
const isShareLink = (code) => /^https?:\/\/\S*(share\.hsforms\.com|hubspot\.com)\S*$/i.test(code.trim());

// Cada aviso: { level: 'ok' | 'warn' | 'error', text }
export const checkFormEmbed = (raw) => {
  const code = raw.trim();
  if (!code) return [];
  if (isShareLink(code)) {
    return [{ level: 'error', text: 'Pegaste un enlace, no el código. En HubSpot ve a Compartir → Insertar código y copia el bloque que empieza con <script.' }];
  }
  if (!code.includes('<')) {
    return [{ level: 'error', text: 'Esto no parece código HTML. Debe empezar con <script o <div.' }];
  }
  if (!isForm(code)) {
    if (isTracking(code)) {
      return [{ level: 'error', text: 'Esto es el código de seguimiento, no el del formulario. Pégalo en el cuadro de abajo.' }];
    }
    return [{ level: 'warn', text: 'No reconocemos un formulario de HubSpot en este código. Revisa que lo copiaste completo.' }];
  }
  const portal = portalFrom(code);
  const formId = formIdFrom(code);
  const notes = [{ level: 'ok', text: `Formulario de HubSpot detectado${portal ? ` · cuenta ${portal}` : ''}${formId ? ` · formulario ${formId.slice(0, 8)}…` : ''}` }];
  if (!formId) notes.push({ level: 'warn', text: 'No encontramos el ID del formulario. Copia el código completo, sin cortar el final.' });
  return notes;
};

export const checkHeadCode = (raw, formEmbed = '') => {
  const code = raw.trim();
  if (!code) return [];
  if (!code.includes('<')) {
    return [{ level: 'error', text: 'Esto no parece código HTML. Debe empezar con <script.' }];
  }
  if (!isTracking(code)) {
    if (isForm(code)) {
      return [{ level: 'error', text: 'Esto es el código del formulario. Pégalo en el cuadro de arriba.' }];
    }
    return [{ level: 'warn', text: 'No reconocemos el código de seguimiento de HubSpot (debe contener hs-scripts.com).' }];
  }
  const portal = portalFrom(code);
  const notes = [{ level: 'ok', text: `Código de seguimiento detectado${portal ? ` · cuenta ${portal}` : ''}. El chatbot aparecerá si su chatflow está activo.` }];
  const formPortal = portalFrom(formEmbed);
  if (portal && formPortal && portal !== formPortal) {
    notes.push({ level: 'warn', text: `El formulario es de la cuenta ${formPortal} y el seguimiento de la cuenta ${portal}. Deberían ser la misma.` });
  }
  return notes;
};
