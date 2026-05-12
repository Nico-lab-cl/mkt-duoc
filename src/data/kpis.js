export const kpiData = [
  // ------------------------------------
  // METRICAS DE ATRACCION (Meta & Google)
  // ------------------------------------
  {
    id: "impresiones",
    category: "Atracción",
    name: "Impresiones",
    definition: "El número total de veces que tu anuncio se mostró en pantalla (Meta y Google).",
    formula: "N/A (Es un conteo directo)",
    application_context: "Mírala para entender el volumen total de exposición de tu anuncio.",
    good_vs_bad: "Un número alto es bueno, pero por sí solo no garantiza resultados. Debe cruzarse con otras métricas como CTR o Clics."
  },
  {
    id: "alcance",
    category: "Atracción",
    name: "Alcance",
    definition: "El número de personas únicas que vieron tu anuncio al menos una vez (Principalmente Meta).",
    formula: "N/A (Es un conteo directo)",
    application_context: "Mírala si quieres saber a cuántos individuos diferentes estás impactando.",
    good_vs_bad: "Si el alcance es muy bajo respecto a las impresiones, tu anuncio se está repitiendo mucho a las mismas personas (Alta frecuencia)."
  },
  {
    id: "frecuencia",
    category: "Atracción",
    name: "Frecuencia",
    definition: "El promedio de veces que cada persona vio tu anuncio.",
    formula: "Impresiones / Alcance",
    application_context: "Mírala para evitar la fatiga del anuncio en Meta Ads.",
    good_vs_bad: "Idealmente entre 1.5 y 3. Si sube mucho (>4) y el CTR baja, la gente se cansó de tu anuncio. Cambia la creatividad."
  },
  {
    id: "cpm",
    category: "Atracción",
    name: "Costo Por Mil Impresiones (CPM)",
    definition: "Lo que pagas cada vez que tu anuncio se muestra 1.000 veces.",
    formula: "(Inversión / Impresiones) * 1000",
    application_context: "Mírala para saber cuán cara o competitiva es la audiencia a la que estás apuntando.",
    good_vs_bad: "Si el CPM es muy alto, tu audiencia puede ser pequeña, muy competitiva (Black Friday, Navidad), o tu anuncio tiene baja relevancia."
  },
  {
    id: "ctr",
    category: "Atracción",
    name: "Click-Through Rate (CTR) %",
    definition: "El porcentaje de veces que las personas hicieron clic en tu anuncio tras verlo.",
    formula: "(Clics / Impresiones) * 100",
    application_context: "Mírala si quieres saber si tu creatividad, copy o título (en Google) está llamando la atención.",
    good_vs_bad: "Si el CTR es bajo (< 1% en Meta o < 5% en Google Búsqueda), cambia la imagen, texto o palabras clave. Si es alto, tu anuncio es llamativo."
  },
  {
    id: "cpc",
    category: "Atracción",
    name: "Costo Por Clic (CPC)",
    definition: "Lo que pagas en promedio por cada clic que alguien hace en tu anuncio.",
    formula: "Inversión / Clics",
    application_context: "Mírala para evaluar la eficiencia en la generación de tráfico hacia tu landing page.",
    good_vs_bad: "Si el CPC es muy alto, revisa tu segmentación/palabras clave o intenta mejorar tu CTR para abaratar los clics."
  },
  {
    id: "clics_enlace",
    category: "Atracción",
    name: "Clics en el enlace (Outbound Clicks)",
    definition: "El número total de clics que sacaron a las personas de la red social hacia tu destino (sitio web).",
    formula: "N/A (Conteo directo)",
    application_context: "Mírala para ver el volumen real de tráfico hacia tu web, descartando clics en 'ver más', perfil o likes.",
    good_vs_bad: "Buscas generar volumen, pero prestando atención a la calidad del clic y si esos clics realmente cargan la página."
  },
  {
    id: "impresion_share",
    category: "Atracción",
    name: "Porcentaje de Impresiones (IS)",
    definition: "Las impresiones recibidas divididas por las impresiones que podías haber recibido (Exclusivo Google Ads).",
    formula: "Impresiones reales / Impresiones elegibles",
    application_context: "Mírala para saber cuánta cuota de mercado estás perdiendo frente a competidores por bajo presupuesto o bajo ranking.",
    good_vs_bad: "Si tu IS es bajo (<50%), estás perdiendo muchas oportunidades. Aumenta el presupuesto o mejora el Nivel de Calidad de tus anuncios."
  },

  // ------------------------------------
  // METRICAS DE INTERACCION / ENGAGEMENT (Meta & Video)
  // ------------------------------------
  {
    id: "cpe",
    category: "Interacción",
    name: "Costo Por Interacción (CPE)",
    definition: "Costo promedio por cada interacción (like, comentario, compartir, clic) en Meta Ads.",
    formula: "Inversión / Interacciones Totales",
    application_context: "Mírala en campañas de reconocimiento de marca o engagement.",
    good_vs_bad: "Un CPE bajo indica que tu contenido es muy viral o genera mucha empatía con la audiencia."
  },
  {
    id: "tasa_interaccion",
    category: "Interacción",
    name: "Tasa de Interacción / Engagement Rate",
    definition: "Porcentaje de personas que interactuaron con el anuncio respecto a los que lo vieron.",
    formula: "(Interacciones / Impresiones o Alcance) * 100",
    application_context: "Mírala para medir la viralidad y relevancia de tu contenido en redes sociales.",
    good_vs_bad: "Tasas mayores al 3-5% suelen ser muy buenas. Si es baja, el contenido es aburrido o irrelevante para ese público."
  },
  {
    id: "cpv",
    category: "Interacción",
    name: "Costo Por Visualización (CPV)",
    definition: "Lo que pagas cada vez que alguien mira tu video (usualmente 3s en Meta, o 30s en YouTube).",
    formula: "Inversión / Visualizaciones de Video",
    application_context: "Mírala cuando corres campañas de Video Views en TikTok, YouTube o Reels.",
    good_vs_bad: "Busca CPVs de centavos de dólar. Si es alto, los primeros 3 segundos de tu video no logran capturar la atención (falta un 'hook')."
  },
  {
    id: "thruplay",
    category: "Interacción",
    name: "ThruPlay / Vistas al 100%",
    definition: "Cantidad de veces que un video se reprodujo completo o al menos 15 segundos.",
    formula: "N/A (Conteo)",
    application_context: "Mírala para saber si tu video no solo llama la atención al inicio, sino que retiene a la audiencia hasta el mensaje final.",
    good_vs_bad: "Si tienes miles de visualizaciones de 3 segundos pero muy pocos ThruPlays, tu video es 'clickbait' pero no retiene."
  },
  {
    id: "quality_score",
    category: "Interacción",
    name: "Nivel de Calidad (Quality Score)",
    definition: "Calificación del 1 al 10 que da Google a tus anuncios, keywords y landing page.",
    formula: "Algoritmo de Google (Relevancia + CTR esperado + Experiencia de Landing Page)",
    application_context: "Mírala SIEMPRE en Google Search. Determina cuánto pagas de CPC y tu posición.",
    good_vs_bad: "Un nivel de 8 a 10 te abarata los clics. Un nivel menor a 5 te hará pagar más dinero por peores posiciones."
  },

  // ------------------------------------
  // METRICAS DE CONVERSION (Business)
  // ------------------------------------
  {
    id: "cr",
    category: "Conversión",
    name: "Tasa de Conversión (CR) %",
    definition: "El porcentaje de personas que completaron la acción deseada (compra, lead) luego de hacer clic.",
    formula: "(Conversiones / Clics) * 100",
    application_context: "Mírala para saber si tu landing page, oferta o formulario convence a la gente de comprar o dejar datos.",
    good_vs_bad: "Si tienes muchos clics pero baja CR (ej. < 1% en e-commerce), el problema es la página de destino (lenta, cara, difícil de navegar)."
  },
  {
    id: "cpa",
    category: "Conversión",
    name: "Costo Por Acción / Adquisición (CPA)",
    definition: "Costo promedio por cada conversión generada (puede ser una compra, una descarga, etc).",
    formula: "Inversión / Conversiones",
    application_context: "Mírala cuando el objetivo principal no es solo un 'Lead', sino ventas en e-commerce o descargas de app.",
    good_vs_bad: "Si tu CPA es $20 y vendes zapatos de $15, tu campaña genera pérdidas. Debes optimizar para bajar el CPA."
  },
  {
    id: "cpl",
    category: "Conversión",
    name: "Costo Por Lead (CPL)",
    definition: "Lo que te cuesta conseguir un nuevo cliente potencial (datos de contacto).",
    formula: "Inversión / Leads",
    application_context: "Mírala para controlar el presupuesto en campañas B2B, inmobiliarias, automotriz o servicios.",
    good_vs_bad: "Depende de tu industria. En Real Estate un CPL de $30 puede ser excelente. En odontología podría ser muy caro."
  },
  {
    id: "cac",
    category: "Conversión",
    name: "Costo de Adquisición de Cliente (CAC)",
    definition: "Lo que te cuesta convertir a un prospecto en un cliente FINAL que paga.",
    formula: "Inversión Total de Marketing y Ventas / Clientes Nuevos",
    application_context: "Mírala para entender la rentabilidad final del negocio (CEO y CFO te pedirán esta métrica).",
    good_vs_bad: "El CAC debe ser 3 veces menor al LTV (Life Time Value). Si es igual o mayor, la empresa se irá a la quiebra."
  },
  {
    id: "roas",
    category: "Conversión",
    name: "Retorno sobre Inversión Publicitaria (ROAS)",
    definition: "Cuánto dinero generas en ventas brutas por cada dólar/peso invertido en publicidad.",
    formula: "Ingresos Publicitarios / Inversión Publicitaria",
    application_context: "Mírala en campañas de e-commerce o de venta directa para evaluar el desempeño de la plataforma.",
    good_vs_bad: "ROAS 1 = Recuperaste inversión. ROAS 3 = Por $1 ganas $3. Generalmente, un ROAS menor a 2 genera pérdidas tras restar costos de envío/producto."
  },
  {
    id: "roi",
    category: "Conversión",
    name: "Retorno sobre la Inversión (ROI)",
    definition: "El beneficio real obtenido tras restar TODOS los costos de la empresa (producto, envíos, sueldos, marketing).",
    formula: "((Ingresos Totales - Costos Totales) / Costos Totales) * 100",
    application_context: "La métrica financiera definitiva. Define si todo el negocio (no solo la campaña) fue rentable.",
    good_vs_bad: "Un ROI positivo indica rentabilidad neta. Un ROI negativo significa que perdiste dinero."
  },
  {
    id: "ltv",
    category: "Conversión",
    name: "Lifetime Value (LTV)",
    definition: "La ganancia neta o ingresos totales que un cliente genera a lo largo de toda su relación con la empresa.",
    formula: "Valor Promedio de Compra x Promedio de Frecuencia de Compra x Vida Útil del Cliente",
    application_context: "Mírala para saber cuánto puedes permitirte pagar por adquirir a un cliente (CAC).",
    good_vs_bad: "Si tu LTV es altísimo (ej. una suscripción mensual), puedes permitirte un CAC alto. Negocios sanos tienen LTV:CAC en ratio de 3:1."
  }
];
