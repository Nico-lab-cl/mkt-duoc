export const kpiData = [
  // Atracción
  {
    id: "impresiones",
    category: "Atracción",
    name: "Impresiones",
    definition: "El número total de veces que tu anuncio se mostró en pantalla.",
    formula: "N/A (Es un conteo directo)",
    application_context: "Mírala para entender el volumen total de exposición de tu anuncio.",
    good_vs_bad: "Un número alto es bueno, pero por sí solo no garantiza resultados. Debe cruzarse con otras métricas como CTR o Clics."
  },
  {
    id: "alcance",
    category: "Atracción",
    name: "Alcance",
    definition: "El número de personas únicas que vieron tu anuncio al menos una vez.",
    formula: "N/A (Es un conteo directo)",
    application_context: "Mírala si quieres saber a cuántos individuos diferentes estás impactando.",
    good_vs_bad: "Si el alcance es muy bajo respecto a las impresiones, tu anuncio se está repitiendo mucho a las mismas personas."
  },
  {
    id: "frecuencia",
    category: "Atracción",
    name: "Frecuencia",
    definition: "El promedio de veces que cada persona vio tu anuncio.",
    formula: "Impresiones / Alcance",
    application_context: "Mírala para evitar la fatiga del anuncio. Si es muy alta, la gente se aburrirá de verte.",
    good_vs_bad: "Idealmente entre 1.5 y 3. Si sube mucho y el CTR baja, cambia la creatividad."
  },
  {
    id: "cpm",
    category: "Atracción",
    name: "Costo Por Mil Impresiones (CPM)",
    definition: "Lo que pagas a Meta cada vez que tu anuncio se muestra 1.000 veces.",
    formula: "(Inversión / Impresiones) * 1000",
    application_context: "Mírala para saber cuán cara o competitiva es la audiencia a la que estás apuntando.",
    good_vs_bad: "Si el CPM es muy alto, tu audiencia puede ser pequeña, muy competitiva, o tu anuncio tiene baja relevancia."
  },
  {
    id: "ctr",
    category: "Atracción",
    name: "Click-Through Rate (CTR) %",
    definition: "El porcentaje de veces que las personas hicieron clic en tu anuncio tras verlo.",
    formula: "(Clics / Impresiones) * 100",
    application_context: "Mírala si quieres saber si tu creatividad o copy está llamando la atención.",
    good_vs_bad: "Si el CTR es bajo (< 1%), cambia la imagen o el texto persuasivo. Si es alto, tu anuncio es llamativo."
  },
  {
    id: "cpc",
    category: "Atracción",
    name: "Costo Por Clic (CPC)",
    definition: "Lo que pagas en promedio por cada clic que alguien hace en tu anuncio.",
    formula: "Inversión / Clics",
    application_context: "Mírala para evaluar la eficiencia en la generación de tráfico hacia tu web o formulario.",
    good_vs_bad: "Si el CPC es muy alto, revisa tu segmentación o intenta mejorar tu CTR para abaratar los clics."
  },
  {
    id: "clics_enlace",
    category: "Atracción",
    name: "Clics en el enlace",
    definition: "El número total de clics que dirigieron a las personas a tu destino.",
    formula: "N/A (Conteo directo)",
    application_context: "Mírala para ver el volumen real de tráfico que tu anuncio está generando.",
    good_vs_bad: "Buscas generar volumen, pero siempre prestando atención a la calidad del clic y su costo."
  },
  // Conversión
  {
    id: "cr",
    category: "Conversión",
    name: "Tasa de Conversión (CR) %",
    definition: "El porcentaje de personas que completaron la acción deseada (ej. llenar un lead) luego de hacer clic.",
    formula: "(Leads / Clics) * 100",
    application_context: "Mírala para saber si tu landing page, oferta o formulario convence a la gente de dejar sus datos.",
    good_vs_bad: "Si tienes muchos clics pero una baja CR, el problema no es el anuncio, es la página de destino o la fricción del formulario."
  },
  {
    id: "cpl",
    category: "Conversión",
    name: "Costo Por Lead (CPL)",
    definition: "Lo que te cuesta conseguir un nuevo cliente potencial o registro.",
    formula: "Inversión / Leads",
    application_context: "Mírala para controlar el presupuesto y la rentabilidad al captar prospectos.",
    good_vs_bad: "Si el CPL supera el margen que tienes para adquirir un cliente, tu campaña dejará de ser rentable. Apágala o mejora la conversión."
  },
  {
    id: "cac",
    category: "Conversión",
    name: "Costo de Adquisición de Cliente (CAC)",
    definition: "Lo que te cuesta convertir a un prospecto en un cliente que efectivamente paga.",
    formula: "Inversión / Clientes Finales",
    application_context: "Mírala para entender la rentabilidad final de tu negocio, sumando los costos de marketing.",
    good_vs_bad: "El CAC debe ser siempre menor al Life Time Value (LTV) del cliente. Si tu CAC es de $100 pero tu cliente deja $50, estás perdiendo dinero."
  },
  {
    id: "roas",
    category: "Conversión",
    name: "Retorno sobre Inversión Publicitaria (ROAS)",
    definition: "Cuánto dinero generas en ventas por cada dólar invertido en publicidad.",
    formula: "Ingresos por Ventas / Inversión Publicitaria",
    application_context: "Mírala en campañas de e-commerce o venta directa para evaluar el desempeño directo del gasto publicitario.",
    good_vs_bad: "Un ROAS de 1 significa que quedaste en cero. Debe ser mayor a 1 para cubrir los costos del producto. Idealmente mayor a 3."
  },
  {
    id: "roi",
    category: "Conversión",
    name: "Retorno sobre la Inversión (ROI)",
    definition: "El beneficio real obtenido tras restar todos los costos.",
    formula: "((Ingresos - Costos Totales) / Costos Totales) * 100",
    application_context: "Mírala para tomar decisiones a nivel empresarial. Es la métrica financiera más importante.",
    good_vs_bad: "Un ROI positivo indica que el negocio es rentable. Un ROI negativo significa que estás perdiendo dinero."
  }
];
