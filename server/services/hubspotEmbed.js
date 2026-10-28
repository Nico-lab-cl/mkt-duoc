/**
 * Códigos de HubSpot del Laboratorio Martech (/lab).
 *
 * El código que pegan los alumnos nunca se publica tal cual: de él solo se
 * sacan la región, la cuenta y el formulario, y la página se arma con las
 * plantillas de abajo. Así un script ajeno a HubSpot no llega a ejecutarse.
 *
 * Lo usan el servidor (para validar y publicar) y el editor de la SPA (para
 * avisar al alumno antes de guardar), por eso no depende de nada de Node.
 */

const PORTAL = '(\\d{3,12})';
const FORM_ID = '([0-9a-fA-F-]{8,64})';
const REGION = '([a-z]{2,4}\\d{1,2})';

const attr = (code, name, pattern) =>
  code.match(new RegExp(`${name}\\s*=\\s*["']${pattern}["']`, 'i'))?.[1] || null;

const prop = (code, name, pattern) =>
  code.match(new RegExp(`["']?${name}["']?\\s*:\\s*["']${pattern}["']`, 'i'))?.[1] || null;

// "na1" vive en js.hsforms.net; el resto en js-<región>.hsforms.net
const hostFor = (base, region) => (!region || region === 'na1' ? `js.${base}` : `js-${region}.${base}`);

// Si el alumno pegó el script de HubSpot, se respeta su dominio (solo si es de HubSpot)
const formsHost = (code, region) =>
  code.match(/\/\/(js(?:-[a-z]{2,4}\d{1,2})?\.hsforms\.net)\//i)?.[1].toLowerCase() || hostFor('hsforms.net', region);

/**
 * Formulario. Acepta el código actual de HubSpot (div "hs-form-frame") y el
 * clásico (hbspt.forms.create). Devuelve null si no reconoce ninguno.
 */
export const parseHubspotForm = (raw) => {
  const code = String(raw || '');

  if (/hs-form-frame/i.test(code)) {
    const portalId = attr(code, 'data-portal-id', PORTAL);
    const formId = attr(code, 'data-form-id', FORM_ID);
    if (!portalId || !formId) return null;
    const region = attr(code, 'data-region', REGION) || 'na1';
    return { kind: 'frame', host: formsHost(code, region), region, portalId, formId };
  }

  if (/hbspt\.forms\.create/i.test(code)) {
    const portalId = prop(code, 'portalId', PORTAL);
    const formId = prop(code, 'formId', FORM_ID);
    if (!portalId || !formId) return null;
    const region = prop(code, 'region', REGION) || 'na1';
    return { kind: 'legacy', host: formsHost(code, region), region, portalId, formId };
  }

  return null;
};

/** Código de seguimiento (js.hs-scripts.com/<cuenta>.js). Es el que activa el chat. */
export const parseHubspotTracking = (raw) => {
  const match = String(raw || '').match(/\/\/(js(?:-([a-z]{2,4}\d{1,2}))?\.hs-scripts\.com)\/(\d{3,12})\.js/i);
  if (!match) return null;
  return { region: match[2]?.toLowerCase() || 'na1', portalId: match[3] };
};

export const renderHubspotForm = ({ kind, host, region, portalId, formId }) => {
  if (kind === 'legacy') {
    const options = JSON.stringify({ region, portalId, formId });
    return `<script charset="utf-8" src="https://${host}/forms/embed/v2.js"></script>
<script>hbspt.forms.create(${options});</script>`;
  }
  return `<script src="https://${host}/forms/embed/${portalId}.js" defer></script>
<div class="hs-form-frame" data-region="${region}" data-form-id="${formId}" data-portal-id="${portalId}"></div>`;
};

export const renderHubspotTracking = ({ region, portalId }) =>
  `<script id="hs-script-loader" async defer src="https://${hostFor('hs-scripts.com', region)}/${portalId}.js"></script>`;
