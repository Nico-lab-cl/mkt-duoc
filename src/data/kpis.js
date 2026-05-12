export const kpiData = [
  {
    "id": "cr",
    "nombre": "Tasa de Conversión (CR)",
    "categoria": "Conversión",
    "definicion": "El porcentaje de personas que completaron la acción deseada (compra, lead) luego de hacer clic.",
    "formula": "(Conversiones / Clics) * 100",
    "ejemplo_practico": "Si tienes 1.000 clics y 20 personas llenan el formulario, tu CR es del 2%.",
    "justificacion": "Fundamental para saber si tu landing page, oferta o formulario convence a la gente de realizar la acción.",
    "good_vs_bad": "Si tienes muchos clics pero baja CR, el problema no es el anuncio, sino la página de destino (lenta, no convence o difícil de navegar)."
  },
  {
    "id": "cpl",
    "nombre": "Costo por Lead (CPL)",
    "categoria": "Costos",
    "definicion": "Lo que te cuesta conseguir un nuevo cliente potencial (datos de contacto).",
    "formula": "Importe gastado / Leads",
    "ejemplo_practico": "Si gastas $100 y consigues 4 leads, tu CPL es de $25.",
    "justificacion": "Métrica vital para controlar el presupuesto en campañas B2B, inmobiliarias o servicios profesionales.",
    "good_vs_bad": "Depende de la industria. Lo importante es que el CPL permita un CAC rentable tras el cierre de ventas."
  },
  {
    "id": "coste_por_resultado",
    "nombre": "Coste por resultado",
    "categoria": "Conversión",
    "definicion": "El coste medio por cada resultado conseguido, basado en el objetivo de tu campaña (ej. compras, leads).",
    "formula": "Importe gastado / Resultados",
    "ejemplo_practico": "Si gastas $100 y consigues 5 ventas, tu coste por resultado es $20.",
    "justificacion": "Es la métrica más importante para evaluar la eficiencia directa de tu objetivo principal de campaña.",
    "good_vs_bad": "Si es mayor al margen de ganancia de tu producto, la campaña genera pérdidas. Debes pausarla o probar nuevos creativos."
  },
  {
    "id": "roas",
    "nombre": "ROAS",
    "categoria": "Conversión",
    "definicion": "Retorno de la inversión publicitaria. Mide los ingresos brutos generados por cada dólar gastado en anuncios.",
    "formula": "Valor de conversión de compras / Importe gastado",
    "ejemplo_practico": "Si gastas $100 y tus ventas suman $300, tu ROAS es de 3 (o 300%).",
    "justificacion": "Crucial para e-commerce. Indica si las ventas generadas cubren el costo publicitario directamente.",
    "good_vs_bad": "Un ROAS de 1 significa que quedaste en cero. Busca un ROAS > 2 o > 3 para cubrir los costos logísticos y del producto."
  },
  {
    "id": "roi",
    "nombre": "ROI",
    "categoria": "Conversión",
    "definicion": "Retorno sobre la inversión total. Considera el beneficio neto tras restar TODOS los costos del negocio, no solo la publicidad.",
    "formula": "((Ingresos - Costos Totales) / Costos Totales) * 100",
    "ejemplo_practico": "Si ingresas $500 y todos tus costos (producto, ads, sueldos) son $400, tu ROI es 25%.",
    "justificacion": "Es la métrica de negocio definitiva. Define si la empresa en su conjunto está ganando dinero.",
    "good_vs_bad": "Un ROI positivo indica rentabilidad neta. Un ROI negativo significa que perdiste dinero. Siempre debe ser mayor a 0."
  },
  {
    "id": "importe_gastado",
    "nombre": "Importe gastado",
    "categoria": "Costos",
    "definicion": "La cantidad total estimada de dinero que has gastado en tu campaña, conjunto de anuncios o anuncio.",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "Si tu presupuesto diario es $10 y corrió por 5 días, tu importe gastado será aprox $50.",
    "justificacion": "Es fundamental para calcular todas las métricas de rentabilidad (CPA, CPC, CPM, etc) y controlar el pacing del presupuesto.",
    "good_vs_bad": "Revisa que se esté consumiendo el presupuesto según lo planeado. Si no se gasta, hay problemas de entrega o audiencias muy reducidas."
  },
  {
    "id": "alcance",
    "nombre": "Alcance",
    "categoria": "Atracción",
    "definicion": "El número de personas únicas que han visto tus anuncios al menos una vez.",
    "formula": "Métrica base entregada por la plataforma (Impresiones / Frecuencia)",
    "ejemplo_practico": "Si tu anuncio se mostró 1.500 veces a 1.000 personas distintas, tu alcance es 1.000.",
    "justificacion": "Mide el tamaño real de la audiencia que estás logrando impactar. Vital para campañas de reconocimiento de marca.",
    "good_vs_bad": "Si el alcance es demasiado pequeño y el importe gastado alto, estás saturando a una audiencia minúscula."
  },
  {
    "id": "frecuencia",
    "nombre": "Frecuencia",
    "categoria": "Atracción",
    "definicion": "El promedio de veces que cada persona ha visto tu anuncio.",
    "formula": "Impresiones / Alcance",
    "ejemplo_practico": "Si el anuncio tiene 2.000 impresiones y un alcance de 1.000 personas, la frecuencia es 2.0.",
    "justificacion": "Indica el nivel de exposición repetida. Es necesaria cierta repetición para generar recuerdo, pero demasiada causa fatiga publicitaria.",
    "good_vs_bad": "Idealmente entre 1.5 y 3. Si la frecuencia sube de 4 o 5 y los resultados caen, es momento imperativo de renovar las creatividades."
  },
  {
    "id": "cpm",
    "nombre": "CPM (Coste por 1000 impresiones)",
    "categoria": "Costos",
    "definicion": "El coste medio que pagas por cada 1.000 impresiones de tu anuncio.",
    "formula": "(Importe gastado / Impresiones) * 1000",
    "ejemplo_practico": "Si gastas $10 y tu anuncio se muestra 2.000 veces, tu CPM es $5.",
    "justificacion": "Es el indicador de cuán 'cara' está la subasta o qué tan competitiva es la audiencia a la que apuntas.",
    "good_vs_bad": "Un CPM muy alto significa mucha competencia o baja calidad de anuncio. Debes intentar abrir la segmentación o mejorar la pieza gráfica."
  },
  {
    "id": "impresiones",
    "nombre": "Impresiones",
    "categoria": "Atracción",
    "definicion": "El número total de veces que tus anuncios aparecieron en la pantalla de un dispositivo.",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "Si un usuario ve tu anuncio 3 veces, cuenta como 3 impresiones.",
    "justificacion": "Es el volumen bruto de exposición de tu marca. Sin impresiones, no hay ninguna otra métrica subsecuente.",
    "good_vs_bad": "Necesitas volumen de impresiones para generar clics, pero siempre monitoreando que la frecuencia no se dispare."
  },
  {
    "id": "visualizaciones",
    "nombre": "Visualizaciones",
    "categoria": "Atracción",
    "definicion": "Cantidad de veces que un usuario visualizó una experiencia inmersiva o contenido dinámico.",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "Número de veces que alguien abrió tu experiencia instantánea (Canvas) a pantalla completa.",
    "justificacion": "Mide el nivel de atención primaria a formatos más complejos que una imagen estática.",
    "good_vs_bad": "Si es bajo en formatos inmersivos, tu primera imagen o miniatura no incita a abrir la experiencia completa."
  },
  {
    "id": "espectadores",
    "nombre": "Espectadores",
    "categoria": "Interacción",
    "definicion": "Personas que observaron tu video durante un lapso considerable o eventos en vivo.",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "En una campaña de Live Shopping, la cantidad de usuarios que se mantuvieron viendo la transmisión.",
    "justificacion": "Mide el enganche real con contenido largo y eventos.",
    "good_vs_bad": "Buscas aumentar la retención. Si los espectadores caen rápidamente, el contenido de inicio debe ser más magnético."
  },
  {
    "id": "thruplays",
    "nombre": "Thruplays",
    "categoria": "Interacción",
    "definicion": "Cantidad de veces que tu video se reprodujo completo o durante al menos 15 segundos.",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "De 1.000 vistas de video, 200 personas lo vieron completo (o 15 segundos). Tienes 200 Thruplays.",
    "justificacion": "Filtra a los usuarios que solo hicieron scroll rápido de aquellos que realmente consumieron el mensaje principal del video.",
    "good_vs_bad": "Si tienes muchísimas impresiones pero pocos Thruplays, tu video no atrapa la atención en los primeros 3 segundos (el gancho falla)."
  },
  {
    "id": "reproducciones_de_video",
    "nombre": "Reproducciones de video",
    "categoria": "Interacción",
    "definicion": "Número de veces que tu video empezó a reproducirse. Meta suele medirlo a los 2 o 3 segundos continuos.",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "1.000 personas se detuvieron al menos 3 segundos en su feed para ver tu video.",
    "justificacion": "Es el indicador de 'parada de scroll'. Te dice si la primera imagen del video es llamativa.",
    "good_vs_bad": "Compara esto con las impresiones. Si nadie le da 'play' visual, cambia los colores o textos iniciales del video."
  },
  {
    "id": "coste_por_thruplay",
    "nombre": "Coste por Thruplay",
    "categoria": "Costos",
    "definicion": "El costo medio de cada visualización de video completada o de al menos 15 segundos.",
    "formula": "Importe gastado / Thruplays",
    "ejemplo_practico": "Si gastas $50 y obtienes 500 Thruplays, el coste por Thruplay es $0.10.",
    "justificacion": "Mide la eficiencia económica para entregar el mensaje completo de tu video a la audiencia.",
    "good_vs_bad": "Si el costo es muy alto, el video es aburrido y la gente lo abandona antes de los 15s. Hazlo más dinámico y al punto."
  },
  {
    "id": "cpc",
    "nombre": "Costo por clic (CPC)",
    "categoria": "Costos",
    "definicion": "Costo promedio por cada clic en el enlace, anuncio o botón de llamada a la acción.",
    "formula": "Importe gastado / Clics",
    "ejemplo_practico": "Si gastas $100 y obtienes 200 clics, tu CPC es de $0.50.",
    "justificacion": "Determina qué tan eficiente eres llevando tráfico hacia tu web o activo digital.",
    "good_vs_bad": "Un CPC alto agota tu presupuesto rápido. Para bajarlo, debes mejorar el CTR (hacer anuncios más atractivos)."
  },
  {
    "id": "ctr",
    "nombre": "CTR (Click-Through Rate)",
    "categoria": "Interacción",
    "definicion": "El porcentaje de veces que las personas vieron tu anuncio e hicieron clic en él.",
    "formula": "(Clics / Impresiones) * 100",
    "ejemplo_practico": "Si tu anuncio se muestra 1.000 veces y recibe 20 clics, tu CTR es del 2%.",
    "justificacion": "Es el termómetro definitivo de la calidad y relevancia de tus creatividades (imágenes/textos).",
    "good_vs_bad": "Un CTR < 1% en Meta Ads suele indicar que el anuncio es aburrido o irrelevante para la audiencia. Un CTR > 2% es saludable."
  },
  {
    "id": "clics",
    "nombre": "Clics",
    "categoria": "Atracción",
    "definicion": "El número total de clics en tu anuncio. Puede incluir clics en enlaces, en la página, en 'ver más', etc.",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "Tu anuncio generó 300 clics totales a lo largo de la semana.",
    "justificacion": "Mide la capacidad de tu anuncio para incitar a la acción física del usuario en la pantalla.",
    "good_vs_bad": "A mayor cantidad de clics, más posibilidades de conversión, pero siempre enfócate en Clics en el Enlace Saliente para medir tráfico real."
  },
  {
    "id": "visitas_al_perfil_instagram",
    "nombre": "Visitas al perfil de Instagram",
    "categoria": "Interacción",
    "definicion": "Número de veces que los usuarios visitaron tu perfil de Instagram tras ver tu anuncio.",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "150 personas tocaron el nombre de tu cuenta en el anuncio y fueron a ver tu feed.",
    "justificacion": "Esencial en campañas enfocadas en ganar seguidores o construir autoridad de marca en Instagram.",
    "good_vs_bad": "Si tienes muchas visitas pero no ganas seguidores, tu feed no está optimizado o no hay contenido de valor alineado al anuncio."
  },
  {
    "id": "visitas_pagina_destino",
    "nombre": "Visitas a la página de destino",
    "categoria": "Interacción",
    "definicion": "Número de veces que una persona hizo clic en el enlace y la página web cargó completamente (dispara el píxel).",
    "formula": "Métrica base entregada por el Píxel de Meta",
    "ejemplo_practico": "De 100 clics en el enlace, 85 usuarios esperaron a que la página cargara. Tienes 85 visitas a la página de destino.",
    "justificacion": "Esta es la métrica de tráfico real. Muchas personas hacen clic y cierran antes de que cargue la web.",
    "good_vs_bad": "Si la diferencia entre Clics y Visitas a la página es mayor al 30%, tu sitio web es muy lento. Optimiza la velocidad de carga."
  },
  {
    "id": "coste_por_visita_pagina",
    "nombre": "Coste por visita a la página de destino",
    "categoria": "Costos",
    "definicion": "Costo promedio por cada vez que la página web logró cargar y registrar al usuario.",
    "formula": "Importe gastado / Visitas a la página de destino",
    "ejemplo_practico": "Si gastas $50 y logras 100 visitas reales a tu web, el costo es de $0.50.",
    "justificacion": "Es más preciso que el CPC porque refleja lo que pagas por tráfico que efectivamente ve tu sitio web.",
    "good_vs_bad": "Si es mucho más caro que tu CPC, significa que estás perdiendo dinero en usuarios que no esperan a que tu sitio cargue."
  },
  {
    "id": "coste_por_me_gusta",
    "nombre": "Coste por me gusta",
    "categoria": "Costos",
    "definicion": "Costo medio de cada 'Me gusta' obtenido en la página o publicación a causa del anuncio.",
    "formula": "Importe gastado / Cantidad de Me gusta",
    "ejemplo_practico": "Si gastas $20 y tu página de Facebook gana 40 likes, tu costo por me gusta es $0.50.",
    "justificacion": "Se usa en campañas de crecimiento de audiencia social o branding.",
    "good_vs_bad": "El valor varía según el nicho. Lo ideal es mantenerlo bajo con creatividades muy empáticas o memes relacionados al negocio."
  },
  {
    "id": "seguidores_instagram",
    "nombre": "Seguidores de Instagram",
    "categoria": "Conversión",
    "definicion": "Usuarios que comenzaron a seguir tu cuenta tras interactuar con un anuncio.",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "Hiciste una campaña de perfil de Instagram y ganaste 500 seguidores nuevos en 3 días.",
    "justificacion": "Métrica clave para construir comunidad a largo plazo y potenciar el alcance orgánico futuro.",
    "good_vs_bad": "Si inviertes mucho en alcance y no generas seguidores, tu cuenta carece de contenido atractivo o la promesa del anuncio fue falsa."
  },
  {
    "id": "me_gusta_facebook",
    "nombre": "Me gusta de Facebook",
    "categoria": "Interacción",
    "definicion": "Cantidad de personas que dieron 'Like' a tu página de Facebook desde tu anuncio.",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "Tu anuncio generó 300 Me Gusta nuevos a tu Fanpage.",
    "justificacion": "Crea prueba social (social proof) para la marca.",
    "good_vs_bad": "Hoy en día los likes en Facebook no garantizan alcance. No es recomendable invertir demasiado presupuesto en esta métrica exclusivamente."
  },
  {
    "id": "comentarios_publicacion",
    "nombre": "Comentarios de publicación",
    "categoria": "Interacción",
    "definicion": "El número de comentarios que las personas dejaron en tu anuncio.",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "Tu anuncio de zapatillas recibió 45 comentarios preguntando por tallas y precios.",
    "justificacion": "Es una señal fuerte de interés o intención de compra. El algoritmo premia los anuncios con muchos comentarios abaratando el CPM.",
    "good_vs_bad": "Un alto número de comentarios positivos ayuda enormemente. Si los comentarios son negativos, debes pausar el anuncio inmediatamente."
  },
  {
    "id": "reacciones_publicacion",
    "nombre": "Reacciones a la publicación",
    "categoria": "Interacción",
    "definicion": "El número de reacciones (Me gusta, Me encanta, Me divierte, etc.) en tu anuncio.",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "Un anuncio emocional recibió 500 'Me encanta' y 200 'Me importa'.",
    "justificacion": "Demuestra resonancia emocional. Las reacciones tienen más peso que los simples 'likes' en el algoritmo de Meta.",
    "good_vs_bad": "Generar reacciones diversas (ej. Me divierte) incrementa drásticamente la viralidad y reduce el costo de distribución del anuncio."
  },
  {
    "id": "respuestas_eventos",
    "nombre": "Respuestas a eventos",
    "categoria": "Interacción",
    "definicion": "Cantidad de personas que indicaron 'Asistiré' o 'Me interesa' en un evento de Facebook promocionado.",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "Para un webinar, 250 personas marcaron 'Asistiré' en Facebook.",
    "justificacion": "Sirve para campañas locales (bares, conciertos) o eventos online masivos.",
    "good_vs_bad": "Recuerda que en Facebook, un 'Asistiré' no garantiza asistencia real (suele ir solo el 10%). Si el número es bajo, replantea la oferta."
  },
  {
    "id": "veces_guardado",
    "nombre": "Veces que se ha guardado la publicación",
    "categoria": "Interacción",
    "definicion": "Cuántas veces las personas guardaron tu anuncio (muy común en Instagram).",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "Un anuncio tipo carrusel con tips de marketing fue guardado 80 veces.",
    "justificacion": "Es la métrica de 'valor'. Si alguien guarda un post, es porque lo considera sumamente útil para el futuro.",
    "good_vs_bad": "Generar guardados le dice al algoritmo que tu contenido es Premium. Aumenta drásticamente la calidad percibida de la cuenta."
  },
  {
    "id": "visitas",
    "nombre": "Visitas",
    "categoria": "Atracción",
    "definicion": "Agrupa métricas de tráfico genérico tanto dentro de la app (tiendas de Meta) como en sitios web.",
    "formula": "Métrica base entregada por la plataforma",
    "ejemplo_practico": "Usuarios que visitaron tu catálogo en Instagram Shops.",
    "justificacion": "Indica el volumen de usuarios que pasaron a una segunda etapa de exploración comercial.",
    "good_vs_bad": "Si hay muchas visitas pero nulas compras, los precios o el catálogo no son competitivos."
  },
  {
    "id": "interacciones_publicacion",
    "nombre": "Interacciones con la publicación",
    "categoria": "Interacción",
    "definicion": "La suma total de todas las acciones que las personas realizan en relación con tus anuncios (likes, clics, comentarios, guardados).",
    "formula": "Suma de todas las interacciones",
    "ejemplo_practico": "Si tuviste 50 likes, 10 clics y 5 comentarios, tienes 65 interacciones.",
    "justificacion": "Métrica de salud global del anuncio. Mide la relevancia general de la creatividad.",
    "good_vs_bad": "Buscas un alto volumen. Anuncios con muchas interacciones ganan las subastas más fácilmente y consiguen CPMs más bajos."
  },
  {
    "id": "interaccion_pagina",
    "nombre": "Interacción con la página",
    "categoria": "Interacción",
    "definicion": "Suma de acciones realizadas en tu página de Facebook/Instagram como resultado del anuncio (menciones, check-ins).",
    "formula": "Suma de interacciones en página",
    "ejemplo_practico": "Alguien vio el anuncio y luego hizo check-in en tu tienda física.",
    "justificacion": "Demuestra impacto de branding más allá del anuncio específico.",
    "good_vs_bad": "Es un excelente indicador de salud de marca si es consistente."
  },
  {
    "id": "comentarios_publicaciones",
    "nombre": "Comentarios de publicaciones",
    "categoria": "Interacción",
    "definicion": "Específicamente el conteo de los comentarios orgánicos y pagados en el post promovido.",
    "formula": "Métrica base",
    "ejemplo_practico": "Acumulación de respuestas de los usuarios debatiendo sobre el producto del anuncio.",
    "justificacion": "Genera comunidad. El texto en los comentarios también ayuda a indexar el anuncio algorítmicamente.",
    "good_vs_bad": "Si es alto y positivo, fomenta las ventas (Social Proof). Debes responder a todos los comentarios para multiplicar la métrica por 2."
  },
  {
    "id": "coste_interaccion_pagina",
    "nombre": "Coste por interacción con la página",
    "categoria": "Costos",
    "definicion": "Cuánto pagaste en promedio para que alguien realizara una acción valiosa en tu página.",
    "formula": "Importe gastado / Interacciones con la página",
    "ejemplo_practico": "Gastaste $100 y tuviste 200 interacciones de página, el costo fue de $0.50.",
    "justificacion": "Sirve para optimizar campañas exclusivas de crecimiento y dinamización de comunidades.",
    "good_vs_bad": "Mantenerlo bajo asegura que el presupuesto está impactando a audiencias altamente afines."
  },
  {
    "id": "coste_interaccion_publicacion",
    "nombre": "Coste por interacción con la publicación",
    "categoria": "Costos",
    "definicion": "Costo promedio para generar un like, comentario, compartida o clic en tu anuncio específico.",
    "formula": "Importe gastado / Interacciones con la publicación",
    "ejemplo_practico": "Gastaste $50 y conseguiste 1.000 interacciones globales. El costo fue $0.05.",
    "justificacion": "Ideal para evaluar campañas de 'Interacción' pura (Engagement).",
    "good_vs_bad": "Si es alto, el contenido promocionado no es natural ni nativo para redes sociales; parece 'demasiado un anuncio'."
  },
  {
    "id": "coste_contacto_mensajes",
    "nombre": "Coste por contacto de mensajes",
    "categoria": "Costos",
    "definicion": "Costo medio por cada conversación (nueva o existente) iniciada a través de WhatsApp, Messenger o DM de Instagram.",
    "formula": "Importe gastado / Contactos de mensajes",
    "ejemplo_practico": "Gastaste $100 y 20 personas te escribieron un DM. El costo es de $5 por mensaje.",
    "justificacion": "Crucial para negocios de servicios, inmobiliarias o clínicas que cierran ventas por chat.",
    "good_vs_bad": "Compara este costo con la tasa de cierre del equipo de ventas. Si cierran el 10%, entonces necesitas 10 mensajes para 1 venta."
  },
  {
    "id": "coste_contacto_mensajes_nuevo",
    "nombre": "Coste por contacto de mensajes nuevo",
    "categoria": "Costos",
    "definicion": "Costo medio por cada conversación iniciada con personas que NUNCA antes le habían escrito a tu negocio.",
    "formula": "Importe gastado / Contactos de mensajes nuevos",
    "ejemplo_practico": "De 20 mensajes totales, 5 eran clientes antiguos y 15 prospectos nuevos. Gastaste $100, así que cada contacto nuevo costó $6.66.",
    "justificacion": "Mide el costo real de adquisición de leads frescos (prospectación), separándolos de la retención.",
    "good_vs_bad": "Suele ser un poco más caro que el costo por mensaje general, pero es el oxígeno del negocio. Mantén la métrica por debajo de tu rentabilidad objetivo."
  }
];
