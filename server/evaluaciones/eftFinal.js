/**
 * Evaluación MKA1213 · Caso Smart Home.
 * Banco de 60 preguntas entregado por el profesor (20 por eje de la EFT),
 * con el texto, las alternativas y la respuesta correcta originales. Solo se
 * agregó `exp`, la justificación que ven los alumnos en la retroalimentación.
 *
 * Este archivo vive SOLO en el servidor: el navegador del estudiante nunca
 * recibe `ok` ni `exp` mientras rinde. `ok` es el índice de la alternativa
 * correcta dentro de `ops` (A = 0, B = 1, C = 2, D = 3); el orden se baraja
 * para cada estudiante.
 */

const EJES = {
  1: 'Eje 1 · Flywheel, storytelling, formatos y diseño',
  2: 'Eje 2 · SEO On-Page, Off-Page, Pillar y Cluster Pages',
  3: 'Eje 3 · Segmentación, contenido personalizado y automatización'
};

const P = (n, eje, q, ops, ok, exp) => ({ id: `p${String(n).padStart(2, '0')}`, eje, q, ops, ok, exp });

const PREGUNTAS = [
  // ───────────── EJE 1: Flywheel, Storytelling, Formatos y Principios de Diseño ─────────────
  P(1, 1,
    'Para lanzar un refrigerador inteligente, el equipo publica en fase de Atracción un Whitepaper técnico de 25 páginas sobre protocolos IoT. ¿Por qué esta decisión genera fricción en el Flywheel?',
    [
      'Porque los whitepapers son documentos PDF que no permiten enlazar hacia la landing page, de modo que el lector no tiene cómo avanzar a la siguiente etapa del Flywheel.',
      'Porque en Atracción se requieren formatos rápidos (visuales/auditivos) antes de exigir lectura profunda propia de etapas de consideración o decisión.',
      'Porque el Flywheel desaconseja los documentos escritos extensos en productos tecnológicos y recomienda reemplazarlos siempre por demostraciones en tienda física.',
      'Porque el Whitepaper es exclusivo de la fase de Deleite.'
    ], 1,
    'En Atracción la persona aún no conoce la marca: necesita formatos breves y fáciles de consumir. Un documento técnico largo exige un esfuerzo que corresponde a etapas más avanzadas.'),

  P(2, 1,
    'En un anuncio de Canva para Instagram, el botón "Cotiza tu cocina Smart" tiene el mismo gris claro del fondo y está lejos del texto de beneficios. ¿Qué dos principios de diseño fallan?',
    [
      'Repetición y Simetría.',
      'Contraste (para jerarquizar el CTA) y Proximidad (para agrupar elementos vinculados).',
      'Alineación y Exportación CMYK.',
      'Tipografía y Kerning.'
    ], 1,
    'El botón no se distingue del fondo (falla el contraste) y está separado del beneficio que lo justifica (falla la proximidad).'),

  P(3, 1,
    'En un video corto para la etapa Interactuar del Flywheel, ¿cuál debe ser el foco central del Storytelling?',
    [
      'Enumerar la garantía legal del fabricante y las certificaciones del producto, porque en Interactuar lo que más pesa es la seguridad jurídica de la compra.',
      'Introducir un conflicto inicial sin mencionar cómo ayuda el producto, para mantener la intriga y que el usuario vuelva a buscar la marca por su cuenta.',
      'Relatar detalles de cómo el electrodoméstico mejora la vida cotidiana del cliente para construir una relación significativa.',
      'Solicitar una reseña de 5 estrellas por compras previas, ya que la prueba social de otros clientes es el foco central de cualquier relato en esta etapa.'
    ], 2,
    'En Interactuar la persona ya tiene interés: la historia debe mostrar cómo el producto mejora su vida diaria para construir relación y acercarla a la decisión.'),

  P(4, 1,
    'Al comparar Canva frente a herramientas como Illustrator para una campaña de electrodomésticos, ¿qué afirmación técnica es correcta?',
    [
      'Canva permite vectorización avanzada, pinceles personalizados y exportación nativa AI/EPS sin limitaciones, por lo que hoy reemplaza por completo a Illustrator incluso en piezas de imprenta y en el desarrollo de identidad de marca.',
      'Canva destaca por su agilidad, plantillas y colaboración en tiempo real para formatos digitales, mientras que Illustrator ofrece precisión avanzada en vectorización, kerning y formatos AI/EPS/SVG.',
      'Illustrator solo sirve para presentaciones y no para piezas de marketing.',
      'Ambas herramientas tienen exactamente las mismas funciones de edición vectorial.'
    ], 1,
    'Cada herramienta tiene su fuerte: Canva es ágil y colaborativa para piezas digitales; Illustrator da control vectorial y tipográfico profesional.'),

  P(5, 1,
    'En el diseño de una infografía sobre ahorro energético, los títulos, textos e iconos están dispuestos en ejes desordenados sin cuadrícula común. ¿Qué principio se vulnera y qué consecuencia genera?',
    [
      'Repetición; al no seguir una cuadrícula, la infografía impide reconocer los colores y la tipografía de la marca.',
      'Alineación; rompe la cohesión visual, genera fatiga visual y reduce la usabilidad y percepción profesional.',
      'Proximidad; elimina el contraste del botón CTA.',
      'Contraste; los elementos desordenados reducen la diferencia entre fondo y texto, y el archivo no se puede exportar a PDF.'
    ], 1,
    'Sin un eje o cuadrícula común, los elementos no se relacionan entre sí: la pieza se ve desordenada, cansa la vista y pierde credibilidad.'),

  P(6, 1,
    'El equipo diseña un post de Instagram para la fase Atraer usando 5 tipografías distintas y saturando el lienzo con múltiples bloques de texto. Según las buenas prácticas de diseño, ¿cuál es el error principal?',
    [
      'No haber usado formato eBook en lugar de un post.',
      'Usar demasiadas fuentes y saturar elementos confunde visualmente al usuario y rompe la coherencia de marca.',
      'Haber utilizado una herramienta de mediana complejidad como Canva en lugar de programar la pieza directamente en código HTML.',
      'Incluir un llamado a la acción (CTA) claro en la parte inferior.'
    ], 1,
    'Demasiadas tipografías y bloques de texto compiten entre sí: el mensaje se pierde y la marca se ve inconsistente. Lo recomendable es pocas fuentes y espacio en blanco.'),

  P(7, 1,
    '¿Qué formato resulta más efectivo en la etapa Atraer para captar rápidamente la atención de un usuario que aún no conoce la línea Smart Home?',
    [
      'Una plantilla editable de planificación mensual descargable, porque obliga a dejar el correo y así se identifica al usuario desde el primer contacto.',
      'Videos cortos (Reels/TikToks) con miniaturas llamativas y titulares claros, o infografías que sinteticen datos complejos.',
      'Un manual técnico de instalación post-venta, porque demuestra desde el inicio lo simple que es configurar los productos Smart Home en casa.',
      'Una encuesta de satisfacción transaccional, porque permite conocer qué espera el usuario de la marca antes de mostrarle cualquier contenido.'
    ], 1,
    'Para quien no conoce la marca funcionan los formatos rápidos y visuales que captan la atención en segundos. Manuales y encuestas son para clientes.'),

  P(8, 1,
    'Una marca de electrodomésticos usa sistemáticamente el mismo tono azul eléctrico, tipografía y logotipo en sus anuncios, landing page y eBook. ¿Qué principio de diseño aplica?',
    [
      'Proximidad.',
      'Repetición, fortaleciendo la consistencia, identidad y reconocimiento de marca.',
      'Contraste cromático.',
      'Alineación asimétrica.'
    ], 1,
    'Repetir colores, tipografías y logo en todas las piezas construye una identidad reconocible: es el principio de repetición.'),

  P(9, 1,
    'En un reporte visual de campaña, el diseñador separa los gráficos de consumo eléctrico de sus comentarios explicativos poniéndolos en páginas distintas. ¿Qué principio incumple?',
    [
      'Proximidad, que exige agrupar espacialmente elementos relacionados para facilitar la comprensión.',
      'Repetición, que exige usar siempre los mismos colores.',
      'Contraste, que exige botones brillantes sobre fondo oscuro.',
      'Alineación, que exige centrar todos los textos.'
    ], 0,
    'Lo que se relaciona debe estar cerca. Separar el gráfico de su explicación obliga al lector a ir y volver, y dificulta entender el dato.'),

  P(10, 1,
    'Para la etapa Deleitar del Flywheel, el equipo quiere fidelizar a quienes ya compraron un horno inteligente. ¿Qué pieza visual cumple mejor este objetivo?',
    [
      'Un anuncio con descuento para nuevos visitantes, porque cualquier promoción también fideliza a quienes ya compraron el horno y los hace volver a la tienda.',
      'Un recetario digital descargable personalizado con diseño limpio y motion graphics que superen las expectativas del cliente.',
      'Una miniatura con un conflicto abierto dirigida a desconocidos, para que los clientes actuales la compartan y así se refuerce su relación con la marca.',
      'Un formulario extenso sin propuesta de valor.'
    ], 1,
    'Deleitar busca que el cliente aproveche su compra y supere sus expectativas. Un recurso útil y personalizado para quien ya tiene el horno cumple ese objetivo.'),

  P(11, 1,
    '¿Por qué el Storytelling de la etapa Atraer difiere del de la etapa Interactuar?',
    [
      'En Atraer introduce conflictos o preguntas que resuenan con necesidades iniciales; en Interactuar profundiza detalles personales sobre cómo el producto mejora la vida del cliente.',
      'En Atraer solo se usan datos financieros y en Interactuar solo memes.',
      'En Atraer se prohíbe hablar al buyer persona y en Interactuar se ignora el producto.',
      'No existe una diferencia de fondo: se usa el mismo guion en ambas etapas y solo cambia el canal de publicación, porque el relato de la marca debe ser idéntico en todo el Flywheel para no confundir al público.'
    ], 0,
    'Cada etapa tiene su relato: en Atraer se despierta el interés con una pregunta o conflicto que el público reconoce; en Interactuar se profundiza en cómo el producto lo resuelve.'),

  P(12, 1,
    'Según los 6 pasos recomendados para crear un eBook o pieza de contenido Inbound, ¿qué debe hacerse inmediatamente después de definir el público objetivo y el propósito?',
    [
      'Convertir el archivo a PDF y promocionarlo.',
      'Desarrollar la estructura clara del esquema y el contenido fácil de entender.',
      'Medir los mapas de calor en Hotjar.',
      'Cambiar las tipografías en Canva.'
    ], 1,
    'Con el público y el propósito definidos, el paso siguiente es estructurar el esquema y el contenido. Convertir y promocionar vienen al final.'),

  P(13, 1,
    'El equipo diseñó una landing page en Canva/Figma, pero los usuarios no hacen clic en el formulario. ¿Qué herramienta permite visualizar mapas de calor para detectar qué áreas miran y dónde hacen clic?',
    [
      'Google Search Console.',
      'Hotjar.',
      'Adobe Spark.',
      'Yoast SEO.'
    ], 1,
    'Hotjar registra mapas de calor y grabaciones de sesión que muestran dónde miran, hacen clic y abandonan los usuarios.'),

  P(14, 1,
    '¿Qué ventaja específica ofrece Figma frente a otras herramientas de mediana complejidad cuando un equipo de marketing trabaja en prototipos web?',
    [
      'Permite trabajar de forma colaborativa en tiempo real en el diseño de interfaces y prototipos interactivos.',
      'Es la única herramienta de diseño que permite exportar archivos en PDF listos para compartir con el resto del equipo.',
      'Reemplaza por completo al CRM, porque permite enviar los correos automatizados directamente desde el prototipo.',
      'Garantiza el posicionamiento en el primer lugar de Google, porque los prototipos hechos en Figma ya vienen optimizados.'
    ], 0,
    'El punto fuerte de Figma es el diseño colaborativo en tiempo real de interfaces y prototipos interactivos.'),

  P(15, 1,
    'Al diseñar un carrusel educativo sobre "5 ventajas de las lavadoras Smart", ¿por qué este formato es estratégico para el buyer persona?',
    [
      'Porque es un formato efímero que desaparece a las 24 horas.',
      'Porque permite educar al buyer persona paso a paso de forma visual y escaneable.',
      'Porque impide incluir llamados a la acción.',
      'Porque reemplaza la necesidad de tener una landing page.'
    ], 1,
    'El carrusel divide el contenido en láminas que se leen rápido, una idea por vez: ideal para educar de forma visual.'),

  P(16, 1,
    'Al redactar un eBook como Lead Magnet en la etapa 4 de creación ("Edición y revisión"), ¿qué práctica se recomienda antes de convertirlo a PDF?',
    [
      'Publicarlo de inmediato para probar cómo lo recibe el algoritmo, y corregir los errores después según los comentarios de los lectores.',
      'Que otra persona revise el texto para corregir errores gramaticales y validar la coherencia lógica del flujo.',
      'Eliminar todos los elementos visuales para reducir el peso del archivo, así el PDF se descarga más rápido en el celular.',
      'Cambiar el buyer persona objetivo.'
    ], 1,
    'Una revisión externa detecta errores y saltos lógicos que el autor no ve. Se hace antes de convertir y publicar.'),

  P(17, 1,
    'En la psicología del color aplicada al diseño Inbound, ¿qué criterio debe primar al elegir la paleta de una pieza gráfica?',
    [
      'Usar los colores de moda sin importar el rubro.',
      'Alinear los colores con las emociones y perfil del buyer persona, manteniendo coherencia con la identidad de marca.',
      'Usar la mayor cantidad posible de colores saturados, porque los colores intensos captan más atención en el feed y aumentan la interacción.',
      'Utilizar exclusivamente blanco y negro para ahorrar tinta.'
    ], 1,
    'El color comunica emociones: la paleta debe conectar con el buyer persona y respetar la identidad de la marca.'),

  P(18, 1,
    '¿Qué diferencia operativa existe entre el Customer Journey y el Flywheel al planificar contenidos?',
    [
      'El Customer Journey describe el proceso del cliente desde que percibe una necesidad hasta post-compra, mientras el Flywheel organiza las acciones de la marca (Atraer, Interactuar, Deleitar) para convertir clientes en promotores.',
      'El Customer Journey solo aplica a ventas presenciales y el Flywheel a redes sociales.',
      'El Flywheel termina en el momento de la compra y el Customer Journey continúa después de ella, por eso se planifican por separado: primero se diseñan los contenidos de venta del Flywheel y luego los de post-venta del Customer Journey en el calendario.',
      'Son términos idénticos sin diferencia conceptual.'
    ], 0,
    'El Customer Journey mira el recorrido desde el cliente; el Flywheel organiza lo que hace la marca en cada etapa para convertirlo en promotor.'),

  P(19, 1,
    'Si una pieza visual de Smart Home obtiene muchas impresiones en Meta Business Suite pero un CTR cercano a 0%, ¿qué diagnóstico de diseño es más probable?',
    [
      'La herramienta de diseño no permitió exportar la pieza en formato SVG, por eso se ve pixelada y la gente no hace clic.',
      'Falla el contraste o la jerarquía visual en el titular y el CTA, impidiendo guiar la mirada hacia la acción.',
      'El eBook enlazado tenía demasiadas páginas en formato Word, y eso hace que Meta muestre menos el anuncio a los usuarios.',
      'La Pillar Page no tiene enlaces externos, por lo que Meta le asigna menos autoridad al anuncio y casi nadie lo cliquea.'
    ], 1,
    'La pieza se ve (muchas impresiones) pero nadie actúa: lo más probable es que el titular y el CTA no destaquen ni guíen la mirada.'),

  P(20, 1,
    '¿Cuál es el objetivo final del diseño estratégico de contenidos en el modelo Flywheel?',
    [
      'Decorar las redes sociales con piezas atractivas que mantengan la marca presente, sin necesidad de medir métricas, porque el impacto del diseño es intangible.',
      'Convertir el diseño en un factor decisivo para la conversión y fidelización, transformando al cliente en promotor activo de la marca.',
      'Depender de diseñadores gráficos externos para cada publicación, porque solo un profesional garantiza la calidad que necesita el Flywheel para girar.',
      'Reemplazar el uso de CRM y bases de datos.'
    ], 1,
    'En el Flywheel el diseño no es decoración: debe ayudar a convertir y fidelizar, hasta que el cliente recomiende la marca.'),

  // ───────────── EJE 2: SEO On-Page, Off-Page, Pillar Pages y Cluster Pages ─────────────
  P(21, 2,
    'Una empresa de Smart Home publica 15 artículos aislados sobre domótica sin enlazarlos entre sí ni a una página central. ¿Qué ventaja del modelo Pillar + Cluster Pages desperdicia?',
    [
      'Pagar menos por clic en Google Ads.',
      'Agrupar múltiples búsquedas bajo un tema central amplio y transferir autoridad (PageRank) mediante enlaces internos coherentes.',
      'Bloquear a la competencia en resultados pagos.',
      'Evitar la investigación de palabras clave, porque los artículos enlazados a una página central posicionan solos sin necesidad de elegir keywords.'
    ], 1,
    'El modelo pillar-cluster agrupa los subtemas alrededor de una página central y los conecta con enlaces internos, lo que ordena el tema y reparte autoridad.'),

  P(22, 2,
    '¿Cuál asignación de palabras clave refleja correctamente la relación entre Pillar Page y Cluster Page?',
    [
      'Pillar Page: "Cómo programar un horno inteligente desde el celular" (porque es la búsqueda más específica) | Cluster Page: "Cocina" (para cubrir el tema general debajo de ella).',
      'Pillar Page: "Cocina inteligente" (tema amplio) | Cluster Page: "Cómo ahorrar energía con un horno inteligente conectado a Wi-Fi" (long-tail keyword específica).',
      'Pillar Page: "Descuento 20% hoy" (porque es la página que más convierte) | Cluster Page: "Política de cookies" (porque toda página comercial debe enlazar a ella).',
      'Ambas páginas deben atacar exactamente la misma keyword genérica.'
    ], 1,
    'La Pillar Page cubre el tema amplio y cada Cluster Page desarrolla un subtema específico con una keyword long-tail.'),

  P(23, 2,
    'Al auditar una Pillar Page, detectas 10 enlaces externos hacia portales de farándula y cero enlaces internos hacia las Cluster Pages. ¿Cuál es el error?',
    [
      'Ninguno: todo enlace externo transmite autoridad y sube el ranking sin importar la temática del sitio enlazado, y los enlaces internos no son necesarios si la Pillar Page ya tiene mucho texto.',
      'Los enlaces externos deben apuntar solo a fuentes confiables y relevantes del rubro para validar el contenido, y sin enlaces internos Google no entiende la jerarquía del clúster.',
      'Las Pillar Pages tienen prohibido incluir enlaces internos.',
      'Los enlaces internos solo sirven para acelerar la carga de imágenes.'
    ], 1,
    'Los enlaces externos deben aportar fuentes relevantes del rubro, y los internos son los que muestran a Google la estructura del clúster.'),

  P(24, 2,
    '¿Por qué las Long-Tail Keywords son estratégicas para las Cluster Pages frente a las keywords tradicionales?',
    [
      'Tienen mayor volumen global aunque intención ambigua.',
      'Se alinean directamente con la intención de búsqueda específica del usuario, atrayendo tráfico más calificado.',
      'Solo funcionan en anuncios pagados de redes sociales.',
      'No requieren optimización de encabezados HTML.'
    ], 1,
    'Las long-tail tienen menos volumen pero una intención más clara: atraen a quien busca exactamente lo que la página responde.'),

  P(25, 2,
    'Un redactor repite la frase "refrigerador inteligente barato" 35 veces en 300 palabras para intentar engañar a Google. ¿En qué práctica cae y qué ocurre?',
    [
      'Linkbuilding; mejora la autoridad de dominio.',
      'Keyword Stuffing; penaliza la experiencia del usuario y Google lo castiga con caídas en el ranking.',
      'Schema.org; genera rich snippets automáticos.',
      'Mobile-First; mejora la estabilidad visual.'
    ], 1,
    'Repetir una keyword de forma artificial es keyword stuffing: empeora la lectura y Google lo considera spam.'),

  P(26, 2,
    '¿Cuál afirmación sobre la Metadescripción es técnicamente precisa?',
    [
      'Es el factor HTML con mayor peso directo en el algoritmo de posicionamiento, por sobre el title y los encabezados, por eso debe repetir la keyword.',
      'No influye directamente en el ranking, pero una redacción persuasiva (150–160 caracteres con keyword y CTA) mejora la tasa de clics (CTR).',
      'Debe superar los 300 caracteres, porque Google muestra completa la metadescripción y así el usuario puede leer el artículo entero desde la SERP.',
      'Solo es visible dentro del código fuente y nunca aparece en Google; su única función es que el rastreador entienda el tema de la página.'
    ], 1,
    'La metadescripción no posiciona por sí sola, pero es el texto que el usuario lee en Google: si es persuasiva, aumenta los clics.'),

  P(27, 2,
    'Al revisar el código de una Landing Page de lavadoras Smart, encuentras tres etiquetas <h1> distintas y ningún <h2>. ¿Por qué es un error de SEO On-Page?',
    [
      'Porque solo debe existir una etiqueta <h1> por página con la keyword principal; múltiples <h1> confunden al algoritmo y diluyen la señal semántica.',
      'Porque Google prohíbe el uso de <h1> en páginas comerciales.',
      'Porque las etiquetas <h1> solo cumplen una función visual de tamaño de letra, y al haber tres el diseño de la landing se descuadra en los celulares y Google lo penaliza.',
      'Porque las Landing Pages deben usar únicamente etiquetas <h3>.'
    ], 0,
    'La buena práctica es un único H1 con el tema principal y luego H2 y H3 para los subtemas, para que la jerarquía del contenido quede clara.'),

  P(28, 2,
    '¿Qué característica define a un Title Tag (etiqueta de título) correctamente optimizado?',
    [
      'Ubicar la palabra clave al final del título, después de los 120 caracteres, para que Google no lo considere sobreoptimizado ni lo penalice.',
      'Incluir la keyword principal lo más a la izquierda posible, mantenerse entre 50 y 60 caracteres (~580 px) y ser único en todo el sitio.',
      'Repetir el mismo título en todas las Cluster Pages para reforzar la marca y que Google entienda que todas pertenecen al mismo clúster temático.',
      'Incluir únicamente el nombre legal de la empresa sin keywords.'
    ], 1,
    'Un buen title es único, lleva la keyword al inicio y cabe completo en el resultado de búsqueda.'),

  P(29, 2,
    '¿Cuál de las siguientes URLs cumple con las mejores prácticas de SEO On-Page?',
    [
      'empresa.cl/index.php?id=994&cat=2',
      'empresa.cl/cocina-inteligente/hornos-conectados (corta, descriptiva, minúsculas y separada por guiones).',
      'empresa.cl/Cocina_Inteligente_Oferta_2026_Final',
      'empresa.cl/p1/p2/p3/a123'
    ], 1,
    'Una URL amigable es corta, descriptiva, en minúsculas y con guiones. Los parámetros y códigos no dicen nada al usuario ni al buscador.'),

  P(30, 2,
    'Un usuario busca "comprar refrigerador inverter puerta francesa precio". ¿A qué Search Intent (intención de búsqueda) corresponde y qué página debe responderle?',
    [
      'Informativa; una infografía sobre la historia de la refrigeración, porque antes de comprar el usuario necesita entender cómo funciona el producto.',
      'Transaccional/Comercial; una Landing Page o ficha de producto optimizada con beneficios, especificaciones y CTA de compra.',
      'Navegacional; la página de inicio de sesión de empleados, porque la búsqueda incluye un modelo específico que solo maneja el equipo interno.',
      'De deleite; un manual de reparación post-garantía, porque quien busca un modelo puntual suele ser un cliente que ya tiene el producto en casa.'
    ], 1,
    '"Comprar" y "precio" indican intención transaccional: la persona quiere decidir, así que debe llegar a una página de producto con CTA.'),

  P(31, 2,
    '¿Qué impacto directo tienen los Core Web Vitals (LCP, INP, CLS) en el SEO moderno?',
    [
      'Miden únicamente el número de backlinks externos.',
      'Evalúan rendimiento de carga visible (LCP), respuesta a la interacción (INP) y estabilidad visual (CLS), afectando la experiencia de usuario y visibilidad.',
      'Sirven exclusivamente para diseñar publicaciones en Canva.',
      'Reemplazan la necesidad de tener certificado SSL o textos alternativos, porque desde su llegada Google solo evalúa la velocidad de la página para decidir el ranking.'
    ], 1,
    'Los Core Web Vitals miden qué tan rápido carga, responde y se mantiene estable la página: son parte de la experiencia que Google considera.'),

  P(32, 2,
    '¿Para qué sirve implementar marcado de datos estructurados Schema.org (JSON-LD) en las páginas de productos Smart Home?',
    [
      'Para bloquear el rastreo de Google en dispositivos móviles, de modo que el buscador indexe solo la versión de escritorio de la ficha de producto.',
      'Para definir el tipo de contenido (producto, FAQ, reseña) y facilitar la aparición de resultados enriquecidos (rich snippets) en Google.',
      'Para duplicar automáticamente el tráfico pagado en Meta Ads, porque el catálogo de productos se sincroniza con las campañas a partir del JSON-LD.',
      'Para comprimir imágenes en formato PNG.'
    ], 1,
    'Los datos estructurados le explican a Google qué es cada contenido (producto, precio, reseña, FAQ) y permiten mostrar resultados enriquecidos.'),

  P(33, 2,
    'En SEO Off-Page, ¿qué estrategia de Backlinks y Anchor Text es segura y efectiva?',
    [
      'Comprar 500 enlaces en directorios sin relación temática usando siempre la misma keyword exacta, porque lo que más pesa para Google es la cantidad de enlaces que apuntan al sitio.',
      'Conseguir enlaces desde sitios con alta autoridad temática en el mismo nicho, manteniendo diversidad natural en el Anchor Text (marca, genéricos, keywords, URL).',
      'Enlazar únicamente hacia la página de inicio desde redes sociales privadas.',
      'Eliminar todos los enlaces salientes hacia fuentes científicas o reconocidas.'
    ], 1,
    'Los buenos backlinks vienen de sitios relevantes del rubro y con anclas variadas y naturales. Comprar enlaces masivos es una práctica penalizable.'),

  P(34, 2,
    '¿Cuál es la regla del Mobile-First Indexing que todo equipo de marketing debe considerar al diseñar su Landing Page?',
    [
      'Google indexa primero la versión de escritorio y luego la móvil si le sobra tiempo de rastreo, por lo que basta con optimizar bien la versión de escritorio de la landing.',
      'Google rastrea e indexa de forma predeterminada la versión móvil, por lo que debe tener paridad completa de contenido y navegación respecto al escritorio.',
      'La versión móvil debe ocultar los textos largos y las etiquetas <h2> para cargar más rápido, ya que Google premia las páginas móviles más livianas por sobre su contenido.',
      'Solo aplica a aplicaciones descargables y no a sitios web.'
    ], 1,
    'Google evalúa principalmente la versión móvil, así que esta debe tener el mismo contenido y navegación que la de escritorio.'),

  P(35, 2,
    '¿Qué tres elementos técnicos de optimización de imágenes mejoran el SEO On-Page y la velocidad?',
    [
      'Subir archivos BMP en alta resolución, sin texto alternativo y con carga inmediata total, para que Google vea la imagen con la mejor calidad posible.',
      'Atributo alt descriptivo, compresión en formatos modernos (WebP o AVIF), dimensiones explícitas y carga diferida (lazy loading).',
      'Renombrar todas las fotos como imagen1.jpg, imagen2.jpg, etc., y ocultarlas en móvil para que la versión para celulares cargue más rápido.',
      'Insertar todo el texto del artículo dentro de la imagen en lugar de usar HTML, porque así el diseño se ve igual en todos los navegadores.'
    ], 1,
    'El texto alternativo describe la imagen para buscadores y lectores de pantalla, y los formatos livianos con carga diferida aceleran la página.'),

  P(36, 2,
    'Según la metodología de 4 pasos para elegir el tema de una Pillar Page, ¿qué se hace en el Paso 3 con herramientas como SEMrush o Ahrefs?',
    [
      'Diseñar el logotipo de la marca en vectores.',
      'Identificar palabras clave de alto volumen y relevancia temática que validen el potencial de tráfico orgánico.',
      'Configurar el flujo de correos en HubSpot.',
      'Redactar la encuesta NPS para clientes antiguos.'
    ], 1,
    'Las herramientas SEO sirven para validar con datos que el tema tiene búsquedas suficientes y relevantes antes de construir la Pillar Page.'),

  P(37, 2,
    '¿Cuáles son los 3 beneficios directos de construir una red sólida de enlaces internos entre la Pillar Page y sus Cluster Pages?',
    [
      'Aumenta el costo por clic, reduce el tiempo en página y oculta el menú.',
      'Mejora el SEO (jerarquía y PageRank), aumenta la permanencia reduciendo la tasa de rebote y mejora la navegación del usuario.',
      'Elimina la necesidad de tener Title Tags y metadescripciones, porque Google toma el texto de los enlaces internos como título de cada página.',
      'Genera backlinks externos automáticos desde otros dominios, ya que los sitios que enlazan a la Pillar Page heredan los enlaces hacia los clusters.'
    ], 1,
    'Los enlaces internos ordenan la jerarquía para Google, invitan a seguir leyendo y facilitan la navegación del usuario.'),

  P(38, 2,
    'En una Pillar Page de "Hogar Inteligente", ¿qué 4 elementos clave de estructura NO pueden faltar según las consideraciones vistas en clase?',
    [
      'Solo un formulario largo, 3 pop-ups, texto plano y enlaces rotos.',
      'Introducción exhaustiva, desarrollo de subtemas relevantes, multimedia/recursos complementarios y un Call to Action (CTA) claro.',
      'Únicamente código JSON-LD sin texto visible para el usuario, porque la Pillar Page está pensada para el rastreador de Google más que para las personas.',
      'Un catálogo de precios sin explicación educativa ni enlaces internos.'
    ], 1,
    'Una Pillar Page completa introduce el tema, desarrolla los subtemas, se apoya en recursos multimedia y termina con un CTA claro.'),

  P(39, 2,
    '¿Por qué las Unlinked Brand Mentions (menciones de marca sin enlace) en medios digitales aportan al SEO Off-Page?',
    [
      'Porque Google las asocia a la entidad de la marca fortaleciendo su reputación y autoridad externa.',
      'Porque modifican automáticamente las etiquetas <h1> del sitio propio.',
      'Porque reducen el peso de las imágenes WebP.',
      'No tienen ningún valor; solo cuentan los anuncios pagados.'
    ], 0,
    'Que medios del rubro hablen de la marca, aunque no la enlacen, fortalece su reputación y la asociación de la marca con el tema.'),

  P(40, 2,
    '¿Qué extensión o herramienta práctica vista en clase permite auditar rápidamente si una página web cumple con la jerarquía lógica H1 → H2 → H3?',
    [
      'Canva Pro.',
      'HeadingMap o Web Developer.',
      'Google Rich Results Test exclusivamente para precios.',
      'Mailchimp.'
    ], 1,
    'HeadingMap y Web Developer muestran el árbol de encabezados de la página y permiten detectar saltos o encabezados repetidos.'),

  // ───────────── EJE 3: Segmentación Dinámica, Contenido Personalizado y Automatización ─────────────
  P(41, 3,
    'En HubSpot, un alumno edita los filtros de una Lista Inteligente que ya está conectada como disparador de un flujo de correos activo. ¿Qué buena práctica está violando?',
    [
      'Ninguna: las listas inteligentes están diseñadas para editarse en vivo, y los contactos que ya estaban inscritos en el flujo siguen igual, porque HubSpot solo aplica los nuevos filtros a los contactos que lleguen desde ese momento.',
      'Si una lista está conectada a una campaña en curso, no se recomienda modificarla directamente porque altera dinámicamente los contactos; debe crearse una nueva versión y monitorear resultados.',
      'Las listas inteligentes no permiten filtrar por comportamiento.',
      'Debió convertirla primero en un archivo PDF estático.'
    ], 1,
    'Cambiar los filtros de una lista activa en uso mete o saca contactos del flujo sin control. Lo seguro es crear otra versión y monitorear.'),

  P(42, 3,
    'Un lead descarga la guía "Ahorro energético Smart Home", abre el primer correo automatizado pero NO hace clic en el botón de cotización. ¿Cuál es la regla condicional más efectiva?',
    [
      'Eliminarlo de la base de datos por desinterés, para mantener la lista limpia y mejorar las tasas de apertura.',
      'Reenviar exactamente el mismo correo cada 2 horas, hasta que el lead haga clic en el botón de cotización.',
      'Derivarlo a una rama que reenvíe el mensaje con otro enfoque o un Call to Action (CTA) alternativo.',
      'Clasificarlo automáticamente como cliente promotor, porque abrir el correo ya demuestra que confía en la marca.'
    ], 2,
    'El lead mostró interés (abrió) pero no avanzó: una rama condicional le ofrece otro enfoque o un CTA más fácil, en vez de insistir o descartarlo.'),

  P(43, 3,
    '¿Qué diferencia fundamental distingue a la segmentación de contactos de las listas inteligentes en un CRM?',
    [
      'La segmentación es el proceso estratégico que define criterios (estáticos o dinámicos), mientras que la lista inteligente es la herramienta táctica que ejecuta reglas dinámicas automáticamente en tiempo real.',
      'La segmentación es exclusiva de redes sociales y las listas inteligentes de diseño gráfico.',
      'Las listas inteligentes se actualizan manualmente cada viernes.',
      'Son sinónimos sin diferencia operativa: en HubSpot, segmentar significa crear una lista inteligente, y por eso ambos términos se usan indistintamente tanto en la planificación estratégica como en la configuración de las campañas.'
    ], 0,
    'La segmentación es la decisión estratégica de cómo dividir la base; la lista inteligente es la herramienta que aplica esos criterios de forma automática.'),

  P(44, 3,
    'Un visitante llega buscando una "lavadora inteligente para departamento pequeño". Si aplicamos contenido dinámico en la fase de atracción, ¿qué debe suceder?',
    [
      'Mostrarle las ofertas generales de la marca, incluidos refrigeradores industriales, porque el contenido dinámico busca exponer el catálogo completo.',
      'Adaptar en tiempo real los mensajes, ejemplos o recursos visibles según sus datos o comportamiento previo, mejorando su experiencia.',
      'Ocultar el formulario para evitar registros.',
      'Enviarle una encuesta de satisfacción post-compra antes de que cotice, para conocer su opinión y personalizar después el resto de la página.'
    ], 1,
    'El contenido dinámico adapta lo que ve cada visitante según sus datos o comportamiento, para responder a su necesidad concreta.'),

  P(45, 3,
    '¿Cuál es el riesgo de crear en el formulario de la Landing Page la propiedad "Producto de Interés" como campo de texto libre en lugar de lista desplegable cerrada?',
    [
      'Ninguno: los workflows de HubSpot interpretan faltas de ortografía y sinónimos automáticamente, así que el campo libre da los mismos resultados.',
      'Los usuarios escribirán variaciones o errores tipográficos que rompen las reglas de las listas inteligentes y disparan mal las automatizaciones.',
      'Los campos desplegables impiden usar tokens de personalización en los correos, por lo que el texto libre es la única forma de personalizar el mensaje.',
      'El texto libre aumenta la velocidad de carga del servidor, porque las listas desplegables requieren consultar la base de datos cada vez que se abren.'
    ], 1,
    'Con texto libre cada persona escribe distinto ("refri", "refrigerador"…), y las reglas de las listas no los reconocen. Las opciones cerradas estandarizan el dato.'),

  P(46, 3,
    '¿Qué regla de oro debe respetarse en la personalización de correos automatizados para no generar rechazo en el buyer persona?',
    [
      'Usar todos los datos posibles, incluidos los sensibles que no entregó voluntariamente, porque mientras más detalle tenga el correo más personalizado se siente.',
      'Priorizar la relevancia sobre la cantidad de datos, usando preferencias declaradas y evitando menciones excesivamente personales o invasivas.',
      'Enviar el mismo correo genérico sin nombre ni contexto a toda la base.',
      'Pedir el número de tarjeta de crédito en el primer correo educativo.'
    ], 1,
    'Personalizar es ser relevante, no invasivo: se usan los datos que la persona entregó y que aportan valor al mensaje.'),

  P(47, 3,
    'Un contacto dejó de interactuar con los correos de la marca hace 60 días. Según los casos de uso de listas inteligentes, ¿qué automatización corresponde activar?',
    [
      'Una campaña de re-engagement (reactivación) específica para ese segmento inactivo.',
      'Una alerta urgente de venta telefónica inmediata como lead caliente.',
      'Un correo de bienvenida de primer ingreso.',
      'Un descuento por compra realizada ayer.'
    ], 0,
    'Para contactos inactivos corresponde una campaña de reactivación pensada para recuperar su interés.'),

  P(48, 3,
    '¿Cuál es la diferencia operativa entre una Lista Estática y una Lista Activa (Inteligente) en HubSpot?',
    [
      'La lista estática se actualiza sola cada minuto según los criterios definidos, mientras que la lista activa debe actualizarse manualmente cada vez que el equipo importa contactos nuevos.',
      'La lista estática es una fotografía fija de contactos en un momento dado; la lista activa evalúa criterios continuamente y agrega o saca contactos en tiempo real.',
      'La lista estática solo puede guardar correos de Gmail y otras cuentas personales, mientras que la lista activa está reservada para contactos con correos corporativos de empresas.',
      'La lista activa no puede conectarse a workflows.'
    ], 1,
    'La lista estática no cambia sola; la activa se actualiza automáticamente cuando un contacto cumple o deja de cumplir los criterios.'),

  P(49, 3,
    '¿En qué consiste el Paso 4 del proceso de segmentación con herramientas digitales (HubSpot, Mailchimp, ActiveCampaign)?',
    [
      'Diseñar el logotipo de la empresa en Illustrator.',
      'Conectar el CRM con la herramienta de automatización, clasificar con etiquetas/propiedades y aplicar filtros dinámicos.',
      'Redactar las metadescripciones de la Pillar Page.',
      'Grabar el video de 5 minutos para YouTube.'
    ], 1,
    'En este paso se lleva la segmentación a la herramienta: conectar el CRM, etiquetar a los contactos y aplicar filtros dinámicos.'),

  P(50, 3,
    'Si un equipo diseña una prueba A/B para optimizar la tasa de apertura de su flujo automatizado de Smart Home, ¿qué elemento específico debe variar entre la Versión A y la Versión B?',
    [
      'El logotipo del pie de página.',
      'La línea de asunto del correo electrónico.',
      'La velocidad del servidor VPS.',
      'El formato de compresión de las imágenes del blog.'
    ], 1,
    'La apertura depende sobre todo del asunto, que es lo que se ve antes de abrir. Por eso es lo que se prueba para mejorar esa tasa.'),

  P(51, 3,
    '¿Qué 4 métricas clave permiten evaluar si una campaña de segmentación y automatización de email está funcionando?',
    [
      'Seguidores en TikTok, PageRank, Core Web Vitals y peso del PDF.',
      'Tasa de apertura, tasa de clics (CTR), tasa de conversión y tasa de desuscripción.',
      'Número de etiquetas <h2>, Anchor Text, kerning y saturación de color.',
      'Tiempo de grabación del video y cantidad de páginas del informe.'
    ], 1,
    'Apertura, clics, conversión y desuscripción muestran si el correo se abre, interesa, logra el objetivo y si molesta.'),

  P(52, 3,
    'En una Landing Page de captación para electrodomésticos Smart Home, ¿qué elementos son indispensables para generar confianza y conversión?',
    [
      'Solo un botón llamativo sin formulario ni texto explicativo, porque cada campo y cada párrafo adicional agrega fricción y baja la conversión.',
      'Formulario de captación, imagen/video del recurso ofrecido (Lead Magnet), botón llamativo, aviso legal y política de privacidad.',
      'Al menos 15 enlaces externos hacia la competencia, para que el visitante compare y confíe en que la marca no tiene nada que ocultar.',
      'Un Whitepaper completo pegado en la portada sin solicitud de datos, para entregar valor de inmediato y generar confianza desde el primer clic.'
    ], 1,
    'Una landing que convierte muestra qué se ofrece, pide los datos con un formulario, tiene un CTA claro y da confianza con aviso legal y privacidad.'),

  P(53, 3,
    'Un prospecto se registró en un Webinar sobre "Domótica y Eficiencia Energética". ¿Qué secuencia automatizada básica corresponde disparar desde la lista inteligente?',
    [
      'Enviar un recordatorio previo al evento y un seguimiento posterior personalizado.',
      'Esperar 60 días sin enviar nada y luego cerrarlo como perdido.',
      'Enviarle únicamente una encuesta de cancelación de servicio.',
      'Eliminarlo del CRM apenas termine el registro.'
    ], 0,
    'Un recordatorio antes asegura que asista, y un seguimiento después mantiene la relación y lo acerca al siguiente paso.'),

  P(54, 3,
    '¿Por qué el enunciado "Usar herramientas de automatización sin entender al cliente es como hablar sin escuchar" resume el enfoque de la Unidad 3?',
    [
      'Porque la tecnología es secundaria frente a definir primero objetivos claros, datos relevantes y criterios de segmentación alineados al buyer persona.',
      'Porque las herramientas CRM no sirven para enviar correos.',
      'Porque es mejor enviar el mismo mensaje masivo sin segmentar: escuchar a cada cliente por separado es imposible y la automatización existe para hablarles a todos por igual.',
      'Porque el cliente debe configurar su propio workflow.'
    ], 0,
    'Primero se entiende al cliente (objetivos, datos y criterios de segmentación) y después se automatiza. La herramienta por sí sola no basta.'),

  P(55, 3,
    'Si un flujo automatizado envía correos educativos con un Lead Magnet tras el registro, ¿qué criterio de salida (Goal Criteria) evita fricción cuando el lead ya compró el producto?',
    [
      'Que el usuario siga recibiendo los correos de venta durante 6 meses más, para aprovechar el buen momento de la relación y venderle productos complementarios.',
      'Desinscribir automáticamente al contacto del flujo de nutrición apenas cambia su estado a cliente/comprador, derivándolo a contenidos de Deleite.',
      'Bloquear su correo en la lista de supresión global para siempre, porque un cliente que ya compró no debe volver a recibir correos de la marca de ningún tipo.',
      'Cambiar su propiedad de nombre por un código numérico.'
    ], 1,
    'Cuando el lead compra ya logró el objetivo: debe salir del flujo de venta y pasar a contenidos para clientes.'),

  P(56, 3,
    'Al analizar la tasa de desuscripción tras un flujo automatizado, notas un alza brusca en el correo 2. ¿Qué ajuste basado en datos es el más coherente?',
    [
      'Aumentar el envío a 3 correos diarios para compensar a los contactos perdidos y mantener el volumen de clics totales del flujo completo.',
      'Revisar la relevancia del contenido para ese segmento, ajustar la frecuencia/retardo y hacer pruebas A/B en asunto, CTA o estructura.',
      'Borrar la métrica del reporte para que no afecte el promedio, ya que una sola alza puntual no representa el comportamiento real del segmento.',
      'Eliminar todas las listas inteligentes y volver a envíos masivos sin filtro, porque la segmentación es la que está provocando las desuscripciones.'
    ], 1,
    'Un alza de desuscripciones en un correo puntual indica que ese mensaje no es relevante o llega en mal momento: se revisa, se ajusta y se prueba.'),

  P(57, 3,
    '¿Cómo trabajan juntas la segmentación estratégica y las listas inteligentes para optimizar un embudo de ventas?',
    [
      'La segmentación define los criterios de valor (demográficos, comportamentales, etapa del journey) y la lista inteligente automatiza la actualización y activa las campañas en tiempo real.',
      'La segmentación crea las imágenes en Canva y las listas inteligentes miden el SEO.',
      'Trabajan por separado y nunca deben conectarse al mismo CRM.',
      'La segmentación elimina a los contactos que no cumplen los criterios y las listas inteligentes los recuperan sin filtro cuando vuelven a interactuar, de modo que la base siempre mantiene el mismo tamaño durante el embudo.'
    ], 0,
    'La segmentación decide quién recibe qué; la lista inteligente mantiene ese grupo actualizado solo y activa las campañas.'),

  P(58, 3,
    'En un flujo con regla condicional basado en datos del formulario de Landing Page, ¿qué combinación de filtros de lista activa identifica al lead más calificado para el equipo comercial?',
    [
      'País = Cualquiera O No abrió correos en 60 días.',
      'Presupuesto declarado >= Alto Y Visitó página de precios Y Hizo clic en CTA de cotización.',
      'Se desuscribió Y Rebotó el correo.',
      'Solo dejó su nombre SIN correo electrónico válido.'
    ], 1,
    'Combinar con "Y" exige todas las señales de intención a la vez: presupuesto, interés en precios y clic en cotizar.'),

  P(59, 3,
    '¿Por qué la tasa de clics (CTR) en un correo automatizado es un indicador más fuerte de intención comercial que la tasa de apertura?',
    [
      'Porque la apertura puede ocurrir por curiosidad o vista previa pasiva, mientras que el clic demuestra una acción deliberada hacia la oferta o recurso.',
      'Porque la tasa de apertura mide ventas cerradas en efectivo.',
      'Porque el CTR no depende del contenido del correo ni del CTA, sino solo de la reputación del remitente, por lo que mide mejor la confianza del cliente en la marca.',
      'Porque los clics solo los generan clientes que ya compraron antes, y por eso el CTR es el único indicador que refleja la intención real de volver a comprar.'
    ], 0,
    'Abrir puede ser casual; hacer clic es una decisión de ir hacia la oferta. Por eso el clic indica más intención.'),

  P(60, 3,
    'Al presentar la solución integral de la EFT (Contenidos + SEO + Automatización) para la empresa de electrodomésticos Smart Home, ¿qué argumento conecta los 3 ejes?',
    [
      'El diseño visual atrae y educa en el Flywheel, el SEO con Pillar/Cluster Pages captura demanda orgánica cualificada hacia la Landing Page, y la segmentación dinámica automatiza la nutrición personalizada hasta la conversión.',
      'Cada eje funciona de manera aislada sin compartir datos ni objetivos de conversión.',
      'El SEO reemplaza al diseño visual y la automatización elimina la necesidad de contenidos: con buenas Pillar Pages y workflows bien configurados, la marca puede prescindir de las piezas gráficas y de la estrategia de contenidos del Flywheel.',
      'Lo único que genera ventas es publicar en redes sociales sin Landing Page ni CRM.'
    ], 0,
    'Los tres ejes forman un sistema: el contenido atrae y educa, el SEO lleva demanda calificada a la landing y la automatización nutre a cada lead hasta la venta.')
];

export default {
  id: 'eft-final',
  titulo: 'Desafío Técnico MKA1213 · Caso Smart Home',
  minutos: 75,
  // Décimas extra según el porcentaje de logro (se aplica el primer tramo que se cumpla)
  decimas: [
    { min: 100, decimas: 3 },
    { min: 90, decimas: 2 },
    { min: 80, decimas: 1 }
  ],
  ejes: EJES,
  preguntas: PREGUNTAS
};
