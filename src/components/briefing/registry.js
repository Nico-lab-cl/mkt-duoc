import {
  BRIEFING_SECTIONS as CLINICA_SECTIONS,
  FILE_CATEGORIES as CLINICA_FILES,
  PALETTES as CLINICA_PALETTES
} from '../ClinicaBriefingForm';
import {
  BRIEFING_SECTIONS as CANDIDATA_SECTIONS,
  FILE_CATEGORIES as CANDIDATA_FILES,
  PALETTES as CANDIDATA_PALETTES
} from '../CandidataBriefingForm';

/**
 * Cada cliente tiene su propio cuestionario, sus categorías de archivo y sus
 * paletas. El panel de administración usa este registro para saber cómo leer un
 * briefing según el `form_slug` con el que llegó.
 */
export const BRIEFING_FORMS = {
  'clinica-conectamedica': {
    slug: 'clinica-conectamedica',
    label: 'Clínica Conecta Médica',
    subjectLabel: 'Clínica',
    fallbackName: 'Clínica sin nombre',
    publicPath: '/formulario-clinica-conectamedica',
    sections: CLINICA_SECTIONS,
    fileCategories: CLINICA_FILES,
    palettes: CLINICA_PALETTES
  },
  'campana-stephany-valdez': {
    slug: 'campana-stephany-valdez',
    label: 'Campaña Stephany Valdez',
    subjectLabel: 'Candidatura',
    fallbackName: 'Campaña sin nombre',
    publicPath: '/formulario-campana-stephany-valdez',
    sections: CANDIDATA_SECTIONS,
    fileCategories: CANDIDATA_FILES,
    palettes: CANDIDATA_PALETTES
  }
};

export const DEFAULT_FORM = BRIEFING_FORMS['clinica-conectamedica'];

export const formOf = (slug) => BRIEFING_FORMS[slug] || DEFAULT_FORM;

export default BRIEFING_FORMS;
