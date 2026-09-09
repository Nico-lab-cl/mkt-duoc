import React from 'react';
import { BriefingRunner, sectionsOf } from './briefing/kit';
import CONFIG, { STEPS, PALETTES, FILE_CATEGORIES, SLUG, PUBLIC_PATH } from './briefing/candidataStephany';

/**
 * Briefing de campaña política — Stephany Valdez.
 * Ruta pública: /formulario-campana-stephany-valdez
 *
 * El cuestionario vive en `briefing/candidataStephany.js` y el motor en
 * `briefing/kit.jsx`. Aquí solo se unen los dos.
 */
const CandidataBriefingForm = () => <BriefingRunner config={CONFIG} />;

export const BRIEFING_SECTIONS = sectionsOf(STEPS);
export { PALETTES, FILE_CATEGORIES, SLUG, PUBLIC_PATH };

export default CandidataBriefingForm;
