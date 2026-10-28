/**
 * Avisos del editor sobre el código que pegan los alumnos. Usa el mismo lector
 * que el servidor, así lo que aquí sale en verde es exactamente lo que se
 * publica, y lo que sale en rojo el servidor lo va a rechazar al guardar.
 */
import { parseHubspotForm, parseHubspotTracking } from '../../../server/services/hubspotEmbed.js';

const isShareLink = (code) => /^https?:\/\/\S+$/i.test(code);

// Cada aviso: { level: 'ok' | 'warn' | 'error', text }
export const checkFormEmbed = (raw) => {
  const code = raw.trim();
  if (!code) return [];
  if (isShareLink(code)) {
    return [{ level: 'error', text: 'Pegaste un enlace, no el código. En HubSpot ve a Compartir → Insertar código y copia el bloque que empieza con <script.' }];
  }
  const form = parseHubspotForm(code);
  if (!form) {
    if (parseHubspotTracking(code)) {
      return [{ level: 'error', text: 'Esto es el código de seguimiento, no el del formulario. Pégalo en el cuadro de abajo.' }];
    }
    return [{ level: 'error', text: 'No reconocemos un formulario de HubSpot en este código. Copia el código de inserción completo, sin cortar el final.' }];
  }
  return [{ level: 'ok', text: `Formulario de HubSpot detectado · cuenta ${form.portalId} · formulario ${form.formId.slice(0, 8)}…` }];
};

export const checkHeadCode = (raw, formEmbed = '') => {
  const code = raw.trim();
  if (!code) return [];
  const tracking = parseHubspotTracking(code);
  if (!tracking) {
    if (parseHubspotForm(code)) {
      return [{ level: 'error', text: 'Esto es el código del formulario. Pégalo en el cuadro de arriba.' }];
    }
    return [{ level: 'error', text: 'No reconocemos el código de seguimiento de HubSpot (debe contener js.hs-scripts.com).' }];
  }
  const notes = [{ level: 'ok', text: `Código de seguimiento detectado · cuenta ${tracking.portalId}. El chatbot aparecerá si su chatflow está activo.` }];
  const formPortal = parseHubspotForm(formEmbed)?.portalId;
  if (formPortal && formPortal !== tracking.portalId) {
    notes.push({ level: 'warn', text: `El formulario es de la cuenta ${formPortal} y el seguimiento de la cuenta ${tracking.portalId}. Deberían ser la misma.` });
  }
  return notes;
};

export const hasErrors = (notes) => notes.some((n) => n.level === 'error');
