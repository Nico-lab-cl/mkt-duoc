/**
 * Evaluación final de práctica MKA1213 · Caso Smart Home (marca ficticia Hogara).
 * 60 preguntas situacionales de dificultad media-alta, 20 por eje de la EFT.
 *
 * Este archivo vive SOLO en el servidor: el navegador del estudiante nunca
 * recibe `ok` ni `exp` mientras rinde. `ok` es el índice de la alternativa
 * correcta dentro de `ops` (el orden se baraja para cada estudiante).
 */

const EJES = {
  1: 'Eje 1 · Flywheel, storytelling y diseño',
  2: 'Eje 2 · SEO, Pillar y Cluster Pages',
  3: 'Eje 3 · Segmentación y automatización'
};

const P = (id, eje, q, ops, ok, exp) => ({ id, eje, q, ops, ok, exp });

const PREGUNTAS = [
  // ───────────────────────── EJE 1 ─────────────────────────
  P('e1-01', 1,
    'Los reels de Hogara suman 40.000 reproducciones al mes, pero el formulario de la guía «Casa inteligente con menos de $300.000» convierte solo 0,3 % y ventas tarda 4 días en responder las cotizaciones. Según el Flywheel, ¿dónde conviene invertir primero?',
    [
      'Reducir la fricción de Interactuar: simplificar el formulario y acortar el tiempo de respuesta comercial, porque ahí se pierde la energía que ya trajo Atraer.',
      'Aumentar la frecuencia de reels y sumar colaboraciones con influencers, porque una fuerza mayor en Atraer termina compensando las pérdidas de las etapas siguientes del volante.',
      'Lanzar un programa de referidos, porque Deleitar es la etapa que más impulso le da al volante y conviene activarla desde el lanzamiento.',
      'Mover presupuesto a anuncios pagados segmentados por intereses tecnológicos, para que lleguen al formulario visitas más calificadas que las que hoy traen los reels orgánicos.'
    ], 0,
    'El Flywheel crece sumando fuerza y quitando fricción. El tráfico ya existe; la energía se pierde en la conversión y en la respuesta lenta. Más tráfico hacia una etapa con fugas solo aumenta la pérdida, y los referidos requieren primero clientes satisfechos.'),

  P('e1-02', 1,
    '¿Qué diferencia conceptual entre el embudo de ventas y el Flywheel es la más relevante para planificar contenidos?',
    [
      'El embudo organiza el contenido por canal (redes, email, web) y el Flywheel lo organiza por formato (texto, video, imagen), lo que permite reutilizar las piezas en cada etapa del volante.',
      'En el embudo el cliente es el punto final; en el Flywheel el cliente satisfecho genera impulso (recomendaciones, reseñas) que atrae a nuevos clientes.',
      'El Flywheel elimina la etapa de venta, porque el contenido educativo convence por sí solo y el equipo comercial deja de ser necesario en todo el proceso.',
      'El embudo se mide con métricas de ventas y el Flywheel solo con métricas de comunidad, como seguidores e interacciones en redes.'
    ], 1,
    'La clave del Flywheel es que el cliente deja de ser el «fondo» del embudo: si se le deleita, se convierte en fuerza que mueve el volante. Sigue habiendo venta y métricas comerciales.'),

  P('e1-03', 1,
    'Don Jorge (62) cree que la domótica es «cara y complicada». ¿Qué pieza de la etapa Atraer responde mejor a esa objeción sin pedirle nada a cambio?',
    [
      'Un ebook de 30 páginas sobre los protocolos Zigbee y Matter, descargable dejando el correo, para que entienda bien la tecnología.',
      'Un webinar en vivo de 90 minutos con el gerente de producto, con inscripción previa, para resolver todas sus dudas de una vez.',
      'Un video corto donde una persona de su edad enciende las luces por voz y se muestra cuánto baja la cuenta mensual en pesos.',
      'Un correo de bienvenida con el manual de instalación del enchufe inteligente, para que vea lo fácil que es configurarlo.'
    ], 2,
    'Atraer usa contenido gratuito, breve y sin barreras que responda la objeción con prueba concreta (facilidad + ahorro). El ebook y el webinar piden datos (Interactuar) y exigen mucho esfuerzo; el correo de bienvenida es para quien ya compró.'),

  P('e1-04', 1,
    'El webinar «Domótica sin miedo» se abre a cualquier interesado con inscripción por correo. Seis meses después se repite, solo para clientes, con recetas para el horno inteligente. ¿Cómo se clasifican ambos usos?',
    [
      'Ambos son Atraer, porque un webinar siempre educa sobre la categoría y el formato define la etapa del Flywheel.',
      'Ambos son Interactuar, porque en los dos casos se pide inscripción y eso convierte al asistente en lead.',
      'El primero es Deleitar porque entrega valor gratis, y el segundo es Interactuar porque busca que el cliente vuelva a comprar.',
      'El primero es Interactuar (convierte visitas en leads) y el segundo, Deleitar (suma valor a quien ya compró).'
    ], 3,
    'La etapa no la define el formato sino el público y el objetivo. Un mismo webinar captura leads cuando es abierto con inscripción, y deleita cuando está dirigido a clientes para que aprovechen su compra.'),

  P('e1-05', 1,
    'En el guion de un reel de Atraer sobre el refrigerador inteligente, ¿quién debe ocupar el rol de «héroe» del relato?',
    [
      'El refrigerador Hogara, porque es el producto que se quiere posicionar y debe ser el centro de la historia.',
      'La persona que vive el problema (por ejemplo, Carolina que no sabe qué falta en el refri al salir del trabajo), con la marca como guía.',
      'La marca Hogara, porque el storytelling de lanzamiento debe construir autoridad y mostrar su trayectoria.',
      'El vendedor de la tienda, porque humaniza a la empresa y genera confianza con quien todavía no conoce la marca.'
    ], 1,
    'En storytelling de marketing el cliente es el héroe que enfrenta un problema; la marca es el guía que le entrega el plan o la herramienta. Así el público se identifica con la historia.'),

  P('e1-06', 1,
    'Un video para Interactuar sigue la estructura: problema cotidiano → intento fallido → solución con Hogara → resultado. El equipo lo cierra con «¡Síguenos en Instagram!». ¿Qué falla?',
    [
      'Nada: sumar seguidores es la conversión principal de la etapa Interactuar y mantiene la relación con la marca.',
      'La estructura, porque mostrar un intento fallido debilita la imagen de la marca y genera desconfianza.',
      'El llamado a la acción: en Interactuar el cierre debe invitar a convertir (descargar la guía, usar la calculadora, cotizar).',
      'Falta un dato técnico del producto al cierre, sin el cual la historia no es creíble para el público.'
    ], 2,
    'La historia está bien construida, pero el CTA no corresponde a la etapa. En Interactuar se busca que la persona deje sus datos o avance hacia la compra; «síguenos» es un objetivo de alcance.'),

  P('e1-07', 1,
    'Un post tiene el titular en gris #9CA3AF sobre fondo blanco. En el monitor del diseñador se ve «elegante», pero en el celular al sol no se lee. ¿Qué principio falla y cómo se verifica de forma objetiva?',
    [
      'Jerarquía; se verifica duplicando el tamaño del titular hasta que destaque claramente sobre el resto de los elementos de la pieza.',
      'Repetición; se verifica revisando si ese gris aparece en las demás piezas de la marca para que sea reconocible.',
      'Alineación; se verifica centrando el titular, porque los textos centrados se leen mejor en pantallas pequeñas.',
      'Contraste; se verifica con un comprobador de contraste (las pautas WCAG piden al menos 4,5:1 para texto normal).'
    ], 3,
    'Gris claro sobre blanco tiene una relación de contraste cercana a 2,5:1, bajo el mínimo recomendado. El contraste se mide, no se juzga «a ojo» en un buen monitor.'),

  P('e1-08', 1,
    'Un banner tiene el logo arriba a la izquierda, el titular centrado, el texto de apoyo alineado a la derecha y el botón centrado abajo. Todo es legible y con buen contraste, pero «se ve desordenado». ¿Qué principio corriges primero?',
    [
      'Alineación: definir un eje común para que los elementos se relacionen visualmente entre sí.',
      'Contraste: oscurecer el fondo para que el desorden se note menos y destaque el botón.',
      'Proximidad: separar más todos los elementos entre sí para que cada uno tenga su propio espacio y el banner respire.',
      'Repetición: usar el mismo color en todos los textos para unificar la pieza.'
    ], 0,
    'Cuatro ejes distintos (izquierda, centro, derecha, centro) rompen la relación entre elementos. Alinear a un eje común ordena la lectura sin cambiar colores ni tamaños.'),

  P('e1-09', 1,
    'En un post del horno, el precio «$249.990» está junto al logo, en la esquina opuesta a la foto del producto y al beneficio «ahorra 20 % de energía». Los usuarios preguntan por mensaje «¿cuánto cuesta?». ¿Qué principio explica mejor el problema?',
    [
      'Repetición, porque el precio no usa la misma tipografía que el resto de las piezas de la marca.',
      'Proximidad: la información relacionada (producto, beneficio y precio) está separada y el ojo no la asocia.',
      'Espacio en blanco, porque falta aire alrededor del logo y por eso el precio pasa desapercibido.',
      'Contraste, porque los precios siempre deben ir en rojo para que el usuario los encuentre.'
    ], 1,
    'Proximidad: lo que está cerca se percibe como un grupo. Al dejar el precio junto al logo, se lee como dato de la marca y no del producto.'),

  P('e1-10', 1,
    'En un carrusel, el titular, el beneficio y el CTA tienen el mismo tamaño y peso. La tasa de deslizamiento es baja. ¿Qué cambio aplica correctamente el principio de jerarquía?',
    [
      'Poner los tres elementos en mayúsculas y negrita para que todos llamen la atención por igual.',
      'Agregar un sticker de oferta llamativo como cuarto elemento para captar la mirada en la primera lámina.',
      'Hacer el titular dominante, el beneficio secundario y el CTA destacado por color, para guiar el orden de lectura.',
      'Mantener los tamaños y cambiar el color de fondo de cada lámina para que el carrusel se vea dinámico.'
    ], 2,
    'Jerarquía es decidir qué se ve primero, segundo y tercero. Si todo grita igual, nada destaca; agregar elementos aumenta la competencia visual.'),

  P('e1-11', 1,
    'Hogara usa una paleta y tipografías distintas en cada campaña «para no aburrir». A los tres meses, la encuesta muestra baja recordación de marca. ¿Qué recomiendas?',
    [
      'Mantener la variedad visual, porque la novedad en cada campaña aumenta el alcance orgánico y evita que el algoritmo muestre menos las publicaciones.',
      'Usar siempre la misma imagen de producto en todas las piezas para que el público la memorice.',
      'Quitar el logo de las piezas para que el contenido parezca menos publicitario y genere más confianza.',
      'Definir y repetir un sistema visual (paleta, tipografías, logo, estilo de fotos) y variar solo el contenido.'
    ], 3,
    'Repetición/consistencia construye reconocimiento. Lo que cambia entre campañas es el mensaje; el sistema visual se mantiene.'),

  P('e1-12', 1,
    'Tu grupo debe producir en dos horas 12 piezas (post, historia y banner web) con la misma identidad visual. ¿Qué elección de herramientas justificarías mejor en el video?',
    [
      'Una herramienta de plantillas con kit de marca y redimensionado (por ejemplo Canva o Adobe Express), apoyada por IA para generar imágenes base.',
      'Figma para todas las piezas, porque ofrece el mayor control vectorial, permite componentes reutilizables y el resultado final se verá más profesional que con plantillas.',
      'Un generador de imágenes por chat para todas las piezas, incluido el texto final, porque es lo más rápido.',
      'Recraft para todo, porque exporta en SVG y ese formato garantiza consistencia en todas las redes sociales.'
    ], 0,
    'El criterio es el objetivo: volumen, rapidez y consistencia. Las herramientas de plantillas con kit de marca y redimensionado resuelven eso; Figma es lento para este caso, y las IA de chat fallan en texto y consistencia.'),

  P('e1-13', 1,
    'En su video, un estudiante dice: «Usamos IA porque es mejor que Canva». Según el indicador IE1.2.1, ¿qué le falta a ese argumento?',
    [
      'Indicar cuántos usuarios tiene cada herramienta a nivel mundial, para demostrar cuál es la más usada.',
      'Mencionar el precio exacto de los planes pagos de cada herramienta, porque el costo es el único criterio objetivo.',
      'Comparar funciones, ventajas y limitaciones de al menos dos herramientas y justificar la elección.',
      'Mostrar en pantalla el historial completo de prompts que usaron, para probar que la IA hizo el trabajo.'
    ], 2,
    'IE1.2.1 pide comparar funciones, ventajas y limitaciones. «Es mejor» sin criterios ni relación con el objetivo de la pieza corresponde a un desempeño incipiente.'),

  P('e1-14', 1,
    'El equipo generó con IA la foto principal de la campaña y en el informe la presenta como «fotografía real de un cliente de Hogara». ¿Cuál es el problema según la pauta?',
    [
      'Ninguno, siempre que la imagen tenga buena resolución y respete los colores de la marca.',
      'La IA está prohibida en la EFT, por lo que la pieza completa queda invalidada.',
      'Solo sería un problema si la imagen incluyera texto generado automáticamente.',
      'Debe declararse el uso de IA con transparencia; presentarla como foto real de un cliente es engañoso.'
    ], 3,
    'La pauta permite IA con uso ético, transparente, crítico y citado. Hacer pasar una imagen generada por un testimonio real es engañoso para el público y para la evaluación.'),

  P('e1-15', 1,
    'Matías (27) compara especificaciones antes de comprar y duda de que Hogara sea compatible con Alexa o Google Home. Ya está evaluando opciones. ¿Qué contenido acelera mejor su decisión?',
    [
      'Un reel humorístico sobre olvidar apagar las luces, porque mantener la marca presente en su mente es lo que más pesa cuando está comparando opciones.',
      'Una tabla comparativa de compatibilidad por modelo, con casos de uso reales, como recurso descargable o interactivo.',
      'Una encuesta de satisfacción sobre su experiencia de compra en tiendas de electrodomésticos, para conocer mejor sus expectativas.',
      'Un post de efeméride por el Día del Hogar, con un descuento general para todos los productos.'
    ], 1,
    'Está en consideración y su objeción es técnica: necesita información específica y verificable. El reel es de Atraer y la encuesta es post-compra.'),

  P('e1-16', 1,
    'Muchos clientes de la lavadora llaman a soporte con la misma duda de conexión Wi-Fi y las reseñas empiezan a bajar. ¿Qué acción de Deleitar reduce la fricción y además alimenta Atraer?',
    [
      'Ofrecer un cupón de descuento para la próxima compra a quienes dejen una reseña negativa, para compensar la mala experiencia y recuperar la valoración promedio del producto.',
      'Cerrar los comentarios en redes sociales mientras soporte resuelve los casos, para proteger la reputación.',
      'Enviar una encuesta NPS diaria a los clientes afectados hasta que la nota vuelva a subir.',
      'Publicar un tutorial paso a paso, enviarlo en el onboarding y dejarlo público y optimizado para búsquedas como «conectar lavadora Hogara wifi».'
    ], 3,
    'El tutorial resuelve el problema (menos fricción en Deleitar) y, al ser público y optimizado, atrae a quienes buscan cómo usar el producto. El cupón y cerrar comentarios no resuelven la causa.'),

  P('e1-17', 1,
    '¿Qué conjunto de métricas corresponde a evaluar la etapa Deleitar?',
    [
      'Alcance, impresiones y visitas orgánicas al blog.',
      'Tasa de conversión de la landing y costo por lead.',
      'NPS, tasa de recompra, referidos y reseñas.',
      'CTR de los anuncios y frecuencia de impresión.'
    ], 2,
    'Deleitar mide satisfacción y lealtad: NPS, recompra, referidos y reseñas. Alcance es Atraer; conversión y costo por lead son Interactuar.'),

  P('e1-18', 1,
    'Una IA generó un afiche con el titular deformado: «Ahora 30% en tu cunta de luz». ¿Cuál es el flujo de trabajo más profesional?',
    [
      'Generar la imagen sin texto y componer el titular y el CTA en una herramienta de diseño, controlando tipografía y jerarquía.',
      'Regenerar la imagen tantas veces como sea necesario, ajustando el prompt, hasta que la IA escriba el titular correctamente y sin errores de ortografía.',
      'Publicarla igual, porque el error humaniza a la marca y suele generar más comentarios.',
      'Reemplazar el titular por emojis, para que la pieza no dependa de texto que la IA pueda deformar.'
    ], 0,
    'Los generadores de imagen suelen fallar con el texto. Separar imagen y tipografía da control y consistencia de marca, y es fácil de justificar en el video.'),

  P('e1-19', 1,
    'El gerente pide «llenar los espacios vacíos» de un post con más beneficios del producto. ¿Cuál es el mejor argumento de diseño para responder?',
    [
      'Aceptar, porque más información en la pieza siempre aumenta la probabilidad de que el usuario encuentre un motivo para comprar.',
      'El espacio en blanco aísla el mensaje y mejora la lectura en pantallas pequeñas; los beneficios extra van en la landing.',
      'Aceptar, pero con letra más pequeña para que todo quepa sin cambiar el diseño original.',
      'Rechazar el cambio, porque Instagram reduce el alcance de las imágenes que tienen más de 20 % de su superficie cubierta con texto, y la pieza perdería visibilidad.'
    ], 1,
    'El espacio en blanco es parte del diseño, no un vacío. La regla del 20 % de texto de Meta se eliminó hace años, así que no es un argumento válido.'),

  P('e1-20', 1,
    'Una pieza de Atraer, dirigida a un público que no conoce la domótica, termina con «Compra ahora con 10 % de descuento». ¿Cuál es el diagnóstico?',
    [
      'Es correcta: un descuento siempre acelera la decisión, sin importar la etapa del Flywheel.',
      'Es correcta solo si el descuento supera el 20 %, porque con un incentivo menor no se alcanza a compensar la desconfianza que el público tiene hacia la domótica.',
      'Está desalineada: el CTA de Atraer debe invitar a aprender o explorar, porque todavía no hay confianza ni comprensión.',
      'Está desalineada porque en la etapa Atraer las piezas no deben llevar ningún llamado a la acción.'
    ], 2,
    'Cada etapa tiene su CTA. En Atraer se invita a conocer (leer, ver, explorar). Pedir la compra a quien aún no entiende el producto genera fricción. Atraer sí lleva CTA, pero de bajo compromiso.'),

  // ───────────────────────── EJE 2 ─────────────────────────
  P('e2-01', 2,
    'Hogara publicó la Pillar Page «Guía del hogar inteligente» y 8 Cluster Pages. Los clusters enlazan a la pillar, pero la pillar no enlaza a ningún cluster. ¿Qué consecuencia tiene?',
    [
      'Ninguna: basta con que los clusters apunten a la pillar para que Google entienda toda la estructura.',
      'Se debilita el clúster: la pillar debe enlazar a cada cluster y viceversa, para que buscadores y usuarios entiendan la relación y se reparta la autoridad.',
      'Es lo recomendado, porque la pillar debe concentrar toda la autoridad del clúster y, para no repartirla, enlazar únicamente hacia sitios externos de prestigio del rubro.',
      'Hay que eliminar la pillar y dejar los clusters como páginas independientes, porque compiten entre sí.'
    ], 1,
    'El modelo pillar-cluster funciona con enlaces internos en ambos sentidos: la pillar distribuye hacia los subtemas y los clusters devuelven autoridad al tema central.'),

  P('e2-02', 2,
    'Dos Cluster Pages, «cómo ahorrar luz con electrodomésticos inteligentes» y «ahorro de energía con electrodomésticos smart», compiten por las mismas búsquedas y se alternan en Google. ¿Cuál es la mejor solución?',
    [
      'Publicar un tercer artículo optimizado para la misma keyword, para reforzar el tema y ocupar más resultados de la primera página al mismo tiempo.',
      'Actualizar a diario la fecha de publicación de una de ellas para que Google la prefiera.',
      'Fusionarlas en una sola página más completa y redirigir la otra con un 301, o diferenciar claramente la intención de cada una.',
      'Marcar ambas con noindex hasta que una de las dos gane autoridad por sí sola.'
    ], 2,
    'Es canibalización: dos páginas con la misma intención se dividen la relevancia. Se consolida (301) o se diferencia la intención. Noindex las saca de Google, y cambiar fechas no aporta valor.'),

  P('e2-03', 2,
    'Alguien busca «mejor robot aspirador para mascotas 2026». ¿Qué tipo de página responde mejor a esa intención?',
    [
      'Una ficha de producto con solo el botón de compra, porque la búsqueda incluye la palabra «mejor».',
      'La página de inicio de la marca, porque concentra la mayor autoridad del sitio.',
      'Un artículo sobre la historia de las aspiradoras, para educar antes de vender.',
      'Un contenido comparativo que evalúe opciones con criterios claros y enlace a las fichas de producto.'
    ], 3,
    'Es una intención de investigación comercial: la persona compara antes de decidir. Una comparativa responde mejor que una ficha de producto (transaccional) o un artículo histórico (informativo).'),

  P('e2-04', 2,
    '¿Cuál de estos temas funciona mejor como Pillar Page para la estrategia de Hogara?',
    [
      '«Hogar inteligente»: tema amplio con subtemas que pueden desarrollarse como clusters (ahorro, seguridad, compatibilidad, instalación).',
      '«Refrigerador Hogara RX-500 precio»: es específico y transaccional, así que atrae visitas con mayor intención de compra que cualquier tema general.',
      '«Cómo resetear el Wi-Fi del enchufe Hogara E2»: long tail muy precisa con poca competencia.',
      '«Ofertas Cyber Hogara»: concentra muchas búsquedas en pocos días del año.'
    ], 0,
    'La pillar cubre un tema amplio y se ramifica en subtemas. Una ficha de producto, una long tail técnica o una búsqueda estacional funcionan como clusters o landings, no como pilar.'),

  P('e2-05', 2,
    '¿Qué Cluster Page llevará visitas más afines a la landing «Guía para tener una casa inteligente con menos de $300.000»?',
    [
      '«domótica», porque es el término con más volumen de búsqueda del tema.',
      '«qué es el internet de las cosas», porque educa sobre la tecnología de base.',
      '«cómo hacer mi casa inteligente con poco presupuesto», porque coincide con la intención de la guía.',
      '«historia de la domótica», porque genera interés en el tema y aumenta el tiempo en página.'
    ], 2,
    'La long tail que coincide con la oferta del lead magnet atrae a quien ya tiene esa necesidad. Más volumen no significa más conversiones si la intención no calza.'),

  P('e2-06', 2,
    '¿Qué Title Tag es el mejor para la Cluster Page sobre ahorro con enchufes inteligentes?',
    [
      '«Inicio | Hogara»',
      '«Enchufes inteligentes enchufes inteligentes baratos enchufes inteligentes Chile»',
      '«Artículo 14 del blog de tecnología y hogar de nuestra empresa Hogara Chile»',
      '«Ahorra luz con enchufes inteligentes: 7 usos reales | Hogara»'
    ], 3,
    'Un buen título es único, incluye la keyword al inicio, promete un beneficio concreto y cabe en el resultado (unos 50–60 caracteres). Repetir la keyword es relleno y un título genérico no describe la página.'),

  P('e2-07', 2,
    'Una Cluster Page está en la posición 4 para su keyword, pero su CTR es mucho menor que el de páginas similares. ¿Qué conviene hacer primero?',
    [
      'Repetir la keyword varias veces en la meta descripción, porque Google la muestra en negrita y así el resultado destaca más que los de la competencia.',
      'Reescribir title y meta descripción con la intención y un beneficio concreto: influyen en el clic aunque la meta no posicione.',
      'No hacer nada, porque el CTR depende únicamente de la posición y solo subirá cuando suba el ranking.',
      'Eliminar la meta descripción para que Google genere automáticamente el fragmento que mejor calce con cada búsqueda del usuario.'
    ], 1,
    'Con buena posición y CTR bajo, el problema está en cómo se ve el resultado. Title y meta descripción son el «anuncio» orgánico; la meta no posiciona directamente, pero sí mueve el clic.'),

  P('e2-08', 2,
    'Desde la Pillar Page se enlaza al cluster sobre consumo de enchufes inteligentes. ¿Qué texto ancla es el más adecuado?',
    [
      '«cuánto ahorran los enchufes inteligentes»',
      '«haz clic aquí»',
      'La URL completa pegada en el texto',
      'La misma keyword exacta en todos los enlaces del sitio, aunque apunten a páginas distintas'
    ], 0,
    'El ancla descriptiva le dice al usuario y al buscador de qué trata la página destino. «Haz clic aquí» no aporta contexto, y repetir la misma ancla hacia páginas distintas confunde la relación temática.'),

  P('e2-09', 2,
    'Publicaste una Cluster Page, pero ninguna página del sitio la enlaza y no está en el menú. ¿Qué ocurre?',
    [
      'Google la indexa con mayor prioridad por ser contenido nuevo y sin competencia interna.',
      'Mejora el SEO de la página, porque concentra su autoridad en lugar de repartirla.',
      'Solo es un problema si la página tiene imágenes sin texto alternativo.',
      'Es una página huérfana: los buscadores pueden tardar en descubrirla o darle poca relevancia, y los usuarios no llegan a ella navegando.'
    ], 3,
    'Los enlaces internos son el camino por el que rastreadores y usuarios descubren las páginas y entienden su importancia. Una página huérfana queda aislada del clúster.'),

  P('e2-10', 2,
    'La infografía «Consumo por electrodoméstico» lleva todos los datos dentro de la imagen y la página casi no tiene texto. ¿Cuál es el problema y cómo se corrige?',
    [
      'No hay problema, porque los buscadores leen el texto de las imágenes con la misma precisión que el HTML y además la imagen hace que la página cargue más rápido.',
      'Hay que convertir la imagen a BMP, porque es el formato que mejor reconocen los buscadores.',
      'Buscadores y lectores de pantalla no captan bien ese contenido: conviene incluir los datos clave también como texto y usar un atributo alt descriptivo.',
      'Basta con nombrar el archivo «infografia.jpg» para que Google entienda el contenido.'
    ], 2,
    'El texto dentro de una imagen es difícil de interpretar y no es accesible. Los datos clave en HTML más un alt descriptivo mejoran SEO y accesibilidad. BMP es un formato pesado y obsoleto para la web.'),

  P('e2-11', 2,
    '¿Cuál de estas URLs sigue mejor las buenas prácticas para una Cluster Page?',
    [
      'hogara.cl/blog/?p=4821',
      'hogara.cl/Blog/Ahorro_Energia_ENCHUFES_Inteligentes_Final_v2',
      'hogara.cl/hogar-inteligente/ahorro-energia-enchufes-inteligentes-baratos-chile-2026-oferta-mejor',
      'hogara.cl/hogar-inteligente/ahorro-energia-enchufes'
    ], 3,
    'Una buena URL es corta, descriptiva, en minúsculas, con guiones y refleja la jerarquía (pillar/cluster). Las otras usan parámetros opacos, mayúsculas y guiones bajos, o rellenan keywords.'),

  P('e2-12', 2,
    'Quieres aparecer como respuesta destacada para «¿cuánto consume un refrigerador inteligente?». ¿Cómo estructuras el contenido?',
    [
      'Responder directamente al inicio, en pocas líneas, bajo un subtítulo con la pregunta, y después desarrollar el detalle.',
      'Dejar la respuesta al final del artículo, para que el usuario lea todo el contenido y aumente el tiempo de permanencia, que es lo que Google premia.',
      'Responder solo en un video incrustado, porque Google prioriza el contenido audiovisual.',
      'Repetir la pregunta muchas veces en el texto para que el buscador la asocie con la página.'
    ], 0,
    'Los fragmentos destacados suelen tomar respuestas breves y directas ubicadas bajo un encabezado que formula la pregunta. Esconder la respuesta o repetir la pregunta empeora la experiencia.'),

  P('e2-13', 2,
    'Para el artículo «¿Es seguro encender el horno inteligente a distancia?», ¿qué aumenta más la confianza (E-E-A-T) del contenido?',
    [
      'Publicarlo sin autor y sin enlaces a fuentes externas, para que el contenido parezca neutral y no publicitario, y el lector no salga de la página.',
      'Firmarlo con un autor con experiencia demostrable, citar normas o fuentes confiables y mostrar pruebas reales del producto.',
      'Publicar el mismo artículo en varios dominios y medios, para que tenga más presencia en Google y llegue a más lectores interesados.',
      'Incluir el mayor número posible de keywords relacionadas con seguridad y hornos.'
    ], 1,
    'En temas de seguridad, Google valora experiencia, conocimiento, autoridad y confianza. Autoría, fuentes y evidencia la construyen; duplicar contenido o rellenar keywords la dañan.'),

  P('e2-14', 2,
    'La landing tiene una imagen principal de 4 MB y en el celular el LCP es de 6 segundos. ¿Qué mejora es la más directa?',
    [
      'Agregar más enlaces internos hacia la landing desde las Cluster Pages.',
      'Activar carga diferida (lazy loading) en la imagen principal de la primera pantalla, para que el navegador no la descargue hasta que sea realmente necesaria.',
      'Reescribir la meta descripción de la landing con la keyword principal.',
      'Comprimir la imagen principal, servirla en un formato moderno (WebP o AVIF) al tamaño adecuado y priorizar su carga.'
    ], 3,
    'El LCP suele ser la imagen grande de la primera pantalla. Optimizarla y priorizarla lo mejora directamente. Aplicar lazy loading a esa imagen la retrasa y empeora el LCP.'),

  P('e2-15', 2,
    'Mientras la landing carga, el botón «Descargar guía» salta hacia abajo porque aparece una imagen sin dimensiones definidas. ¿Qué métrica se afecta y cómo se corrige?',
    [
      'LCP; se corrige contratando un servidor más rápido para la landing.',
      'INP; se corrige quitando JavaScript del formulario de descarga.',
      'CLS; se corrige reservando el espacio de imágenes y banners (con dimensiones definidas) para que el contenido no se desplace.',
      'TTFB; se corrige cambiando el proveedor de hosting por uno local.'
    ], 2,
    'El CLS mide la estabilidad visual: elementos que se mueven mientras carga la página. Definir ancho y alto, o reservar el espacio, evita el salto.'),

  P('e2-16', 2,
    'Para que cargue más rápido, la versión móvil de una Cluster Page elimina la tabla comparativa y las preguntas frecuentes, que sí aparecen en escritorio. ¿Qué riesgo hay?',
    [
      'Ninguno, porque Google sigue indexando principalmente la versión de escritorio y la móvil solo se usa para medir la velocidad de carga.',
      'Con la indexación mobile-first, Google evalúa sobre todo la versión móvil: el contenido que falta ahí puede no considerarse.',
      'Mejora el posicionamiento, porque una versión móvil más liviana siempre rankea mejor y Google toma el contenido completo desde la versión de escritorio.',
      'Solo afecta a las búsquedas por voz, que usan el contenido de escritorio.'
    ], 1,
    'Google rastrea e indexa principalmente la versión móvil. Si el contenido no está en móvil, se pierde para el posicionamiento. Se optimiza la carga sin eliminar contenido.'),

  P('e2-17', 2,
    'Una agencia le ofrece a Hogara 300 enlaces en directorios de cualquier temática por un pago único. ¿Cuál es la respuesta correcta?',
    [
      'Comprarlos, porque más enlaces siempre aumentan la autoridad del dominio.',
      'Comprarlos y marcarlos como rel="sponsored", porque así cumplen las políticas de Google y además siguen sumando autoridad al dominio sin ningún riesgo.',
      'Comprar solo 100, para que el crecimiento de enlaces parezca natural.',
      'Rechazarlos: los enlaces comprados o irrelevantes infringen las políticas de spam de Google; es mejor ganar enlaces con contenido citable del rubro.'
    ], 3,
    'Comprar enlaces para manipular el ranking infringe las políticas de Google. Marcarlos como sponsored es lo correcto si se pagan, pero así no transmiten autoridad. La vía sostenible es contenido que otros quieran citar.'),

  P('e2-18', 2,
    'En Google Search Console, ¿qué combinación de datos indica que una Cluster Page tiene buena posición pero un título poco atractivo?',
    [
      'Pocas impresiones y un CTR muy alto en comparación con el resto de las páginas del sitio.',
      'Muchas impresiones, posición media entre 3 y 5 y un CTR bajo frente a páginas similares.',
      'Muchos clics y posición media 1.',
      'Un tiempo de carga alto en el informe de experiencia, junto con muchas impresiones en búsquedas que no tienen relación con la página.'
    ], 1,
    'Si la página aparece mucho y en buena posición pero casi nadie hace clic, el problema está en el resultado que se muestra (title y meta), no en el ranking.'),

  P('e2-19', 2,
    'La misma ficha del horno se puede abrir con tres URLs: /horno-h3, /horno-h3?color=negro y /horno-h3?utm_source=instagram. ¿Qué solución es la correcta?',
    [
      'Indicar una URL canónica (rel="canonical") hacia la versión principal de la ficha.',
      'Poner noindex en la versión principal para que Google elija la mejor de las otras dos.',
      'Escribir un texto distinto para cada parámetro UTM, así no hay contenido duplicado.',
      'Bloquear todo el sitio en robots.txt hasta resolver los parámetros.'
    ], 0,
    'La etiqueta canonical le indica al buscador cuál es la versión principal cuando hay URLs duplicadas por parámetros. Las otras opciones sacan de Google la página que importa o no tienen sentido.'),

  P('e2-20', 2,
    '¿Cuál es el orden de trabajo correcto para construir la estrategia de Pillar y Cluster Pages?',
    [
      'Redactar 20 artículos del tema, buscar después las keywords que calcen con cada uno y enlazarlos entre sí al azar para que Google los rastree todos.',
      'Diseñar la pillar en Canva, publicarla sin texto y agregar las keywords a medida que lleguen visitas.',
      'Comprar backlinks, crear la pillar y definir al final a qué buyer persona va dirigida.',
      'Investigar el tema y las keywords, definir la pillar y los clusters según la intención, redactar y enlazar, y luego medir y actualizar.'
    ], 3,
    'Primero se investiga (tema, keywords, intención), luego se arquitectura el clúster, se produce con enlazado interno y se mide para iterar.'),

  // ───────────────────────── EJE 3 ─────────────────────────
  P('e3-01', 3,
    'El formulario pide «Producto de interés» como texto libre. Llegan respuestas como «refri», «Refrigerador», «nevera» y «frigo», y el workflow por producto falla. ¿Cuál es la solución de fondo?',
    [
      'Crear una regla distinta en el workflow para cada variante que escriban los usuarios.',
      'Pedirle al equipo que corrija los datos a mano cada semana antes de enviar los correos.',
      'Cambiar el campo a opciones cerradas (desplegable o selección) asociado a una propiedad del contacto.',
      'Eliminar la pregunta del formulario para que los leads no tengan que escribir.'
    ], 2,
    'La automatización depende de datos estandarizados. Las opciones cerradas garantizan valores que las listas y ramas pueden leer. Las reglas por variante y la limpieza manual no escalan.'),

  P('e3-02', 3,
    'Necesitas (1) un correo único a quienes asistieron al webinar del 10 de noviembre y (2) un workflow que sume automáticamente a cada nuevo lead de Viña del Mar. ¿Qué tipo de lista usas en cada caso?',
    [
      'Activa para ambos, porque las listas activas sirven para cualquier caso.',
      'Estática para los asistentes del webinar y activa para los leads de Viña del Mar.',
      'Estática para ambos, porque son más fáciles de controlar.',
      'Activa para el webinar y estática para Viña del Mar.'
    ], 1,
    'La lista estática es una fotografía de un momento (los asistentes de esa fecha). La lista activa se actualiza sola cuando un contacto cumple o deja de cumplir los criterios.'),

  P('e3-03', 3,
    'La landing usa contenido inteligente: quienes están en la lista «Interés: lavadoras» ven un bloque sobre lavadoras. ¿Qué ve un visitante anónimo, que no es contacto en el CRM?',
    [
      'El contenido predeterminado del módulo.',
      'La versión de lavadoras, porque es la regla con más contactos.',
      'Un bloque vacío hasta que complete el formulario.',
      'Un error, porque el contenido inteligente requiere identificar a todos los visitantes.'
    ], 0,
    'El contenido inteligente muestra variantes según reglas; si el visitante no cumple ninguna, por ejemplo porque es anónimo, ve la versión predeterminada. Por eso siempre debe existir una versión por defecto bien hecha.'),

  P('e3-04', 3,
    'Un correo empieza con «Hola {{contact.firstname}}», pero muchos contactos no tienen nombre registrado. ¿Qué configuración evita el error?',
    [
      'Excluir de todos los envíos a los contactos que no tengan nombre, hasta que lo completen en un formulario posterior de la marca.',
      'Usar el correo electrónico del contacto en lugar del nombre.',
      'Escribir el nombre a mano en cada correo antes de enviarlo.',
      'Definir un valor por defecto para el token (por ejemplo «Hola»), para que no quede vacío ni se vea el código.'
    ], 3,
    'Los tokens de personalización permiten un valor por defecto. Excluir contactos pierde alcance, y usar el correo como nombre se ve poco profesional.'),

  P('e3-05', 3,
    'Un lead descargó la guía de ahorro, abrió el primer correo pero no hizo clic en «Cotiza tu cocina Smart». ¿Qué regla condicional es la más inteligente?',
    [
      'Reenviar el mismo correo cada día hasta que haga clic, porque la repetición aumenta la recordación y demuestra que la marca hace seguimiento.',
      'Si no hace clic en 3 días, enviarle algo más fácil (calculadora o caso de éxito) con otro CTA; si hace clic, avisar a ventas.',
      'Cambiar su etapa a cliente para que entre al flujo de Deleitar.',
      'Sacarlo de la base de datos por falta de interés comercial, para mantener la lista limpia y mejorar las tasas de apertura.'
    ], 1,
    'Las ramas condicionales responden al comportamiento: si no avanza, se ofrece un paso más fácil; si avanza, se deriva a ventas. Repetir el mismo correo cansa, y eliminarlo desperdicia un lead que sí mostró interés.'),

  P('e3-06', 3,
    'Un workflow envía los correos 1, 2 y 3 en los primeros 10 minutos después de la descarga, y las desuscripciones suben. ¿Qué ajuste corresponde?',
    [
      'Espaciar los correos con retrasos (por ejemplo, 2 a 3 días) y condicionar el siguiente envío al comportamiento ante el anterior.',
      'Juntar los tres correos en uno solo más largo, para no saturar la bandeja de entrada y que el lead reciba toda la información de una vez.',
      'Quitar el enlace de desuscripción de los correos de nutrición.',
      'Subir a 5 correos para compensar a los contactos que se pierden.'
    ], 0,
    'La nutrición necesita ritmo: retrasos y condiciones según la interacción. Quitar el enlace de desuscripción es ilegal y daña la entregabilidad.'),

  P('e3-07', 3,
    'Un lead compra en medio del flujo de nutrición y sigue recibiendo «¿Aún lo estás pensando?». ¿Qué configuración faltó?',
    [
      'Un retraso más largo entre cada correo del flujo.',
      'Una lista estática de compradores que el equipo actualice a mano cada mes y que se excluya de todos los envíos del flujo de nutrición.',
      'Un token de personalización con el nombre del producto comprado.',
      'Un criterio de meta o salida: cuando su etapa pase a «cliente», sacarlo del flujo (y, si corresponde, inscribirlo en el onboarding).'
    ], 3,
    'Los criterios de meta sacan automáticamente del flujo a quien ya logró el objetivo. Sin ellos se generan mensajes incoherentes justo con el cliente más valioso.'),

  P('e3-08', 3,
    '¿Cuál es el orden correcto de las etapas del ciclo de vida de un contacto en HubSpot?',
    [
      'Lead → Suscriptor → SQL → MQL → Oportunidad → Cliente → Evangelizador',
      'Suscriptor → Lead → SQL → MQL → Cliente → Oportunidad → Evangelizador',
      'Suscriptor → Lead → MQL → SQL → Oportunidad → Cliente → Evangelizador',
      'Suscriptor → MQL → Lead → SQL → Oportunidad → Evangelizador → Cliente'
    ], 2,
    'El contacto avanza de suscriptor a lead, marketing lo califica (MQL), ventas lo acepta (SQL), se abre una oportunidad, compra (cliente) y, si queda satisfecho, recomienda (evangelizador).'),

  P('e3-09', 3,
    'Un lead visitó la página de precios tres veces y usó la calculadora. Marketing lo califica y, tras una llamada, ventas confirma presupuesto e intención de compra este mes. ¿Cómo se clasifica?',
    [
      'Primero MQL, calificado por marketing según su comportamiento, y después SQL, al ser validado por ventas.',
      'Primero SQL, porque mostró interés en precios, y después MQL, cuando ventas lo llama.',
      'Cliente, desde el momento en que usó la calculadora de ahorro.',
      'Suscriptor, hasta que concrete la compra y pague.'
    ], 0,
    'El MQL lo define marketing con señales de interés; el SQL lo confirma ventas tras validar necesidad, presupuesto y plazo.'),

  P('e3-10', 3,
    '¿Qué modelo de lead scoring está mejor diseñado para Hogara?',
    [
      '+30 por seguir a la marca en Instagram, +30 por abrir cualquier correo y +20 por ver cualquier página del blog, sin restar puntos por ninguna acción.',
      '+10 por cada página vista, sin importar cuál, y sin restar puntos por inactividad.',
      'El mismo puntaje para todos los contactos, para no favorecer a ningún segmento.',
      '+20 por visitar precios, +15 por usar la calculadora, +10 por hacer clic en un CTA comercial, −20 por desuscribirse y −10 por 60 días sin actividad.'
    ], 3,
    'Un buen scoring premia las señales de intención de compra (precios, calculadora, clic comercial) y resta por desinterés. Las métricas superficiales sin puntos negativos inflan leads que no están listos.'),

  P('e3-11', 3,
    'Un segmento de 800 contactos no abre ni hace clic en ningún correo hace 90 días. ¿Qué es lo más adecuado?',
    [
      'Enviarles el doble de correos para recuperar su atención.',
      'Pasarlos a SQL para que ventas los llame por teléfono, ya que si no responden correos quizás prefieran un contacto comercial más directo.',
      'Una secuencia breve de reactivación con contenido de valor y, si no responden, dejar de enviarles para cuidar la entregabilidad.',
      'Reemplazarlos comprando una base de datos nueva del mismo tamaño.'
    ], 2,
    'Los contactos inactivos dañan las tasas y la reputación del remitente. Se intenta reactivarlos y, si no responden, se dejan de lado. Comprar bases es mala práctica y puede infringir la ley.'),

  P('e3-12', 3,
    'El correo 2 del flujo tiene 45 % de apertura y 0,8 % de clics. ¿Cuál es el diagnóstico más razonable?',
    [
      'El asunto es el problema y hay que cambiarlo, porque el asunto es lo que más influye tanto en la apertura como en los clics de todo el correo.',
      'El asunto atrae, pero el cuerpo o el CTA no convencen: probar otro CTA, ubicarlo antes y cumplir lo que prometió el asunto.',
      'Está todo bien, porque una apertura alta es la métrica más importante del email marketing y demuestra interés real.',
      'La base de datos está mala y hay que eliminarla para empezar de nuevo.'
    ], 1,
    'Si abren pero no hacen clic, el asunto cumple y lo que falla es el contenido o la oferta. Hay que mejorar el cuerpo y el CTA, y revisar que cumpla lo que prometió el asunto.'),

  P('e3-13', 3,
    'Para mejorar el flujo, el equipo arma una prueba A/B que cambia a la vez el asunto, el CTA y el horario de envío. ¿Cuál es el problema?',
    [
      'Ninguno: probar varias cosas al mismo tiempo ahorra tiempo y da resultados más completos.',
      'Las pruebas A/B solo funcionan en landing pages, no en correos electrónicos.',
      'Hay que enviar la versión A a toda la base y guardar la versión B como respaldo.',
      'Al cambiar varias variables no sabrás cuál causó la diferencia: hay que probar una variable a la vez con muestras comparables.'
    ], 3,
    'Una prueba A/B aísla una variable para atribuirle el resultado. Si cambian tres cosas, la diferencia no se puede explicar.'),

  P('e3-14', 3,
    '¿Por qué el clic es una señal de intención más fiable que la apertura de un correo?',
    [
      'Porque la apertura puede inflarse (vistas previas o protecciones de privacidad de algunos clientes de correo) y el clic es una acción deliberada.',
      'Porque la tasa de apertura mide las ventas cerradas del flujo, mientras que el clic solo muestra el interés inicial del contacto en la oferta del correo.',
      'Porque los clics los registra Google y las aperturas solo el CRM.',
      'Porque ambas son equivalentes, pero el clic es más fácil de explicar en un informe.'
    ], 0,
    'Algunos clientes de correo cargan las imágenes automáticamente y registran aperturas aunque nadie lea el correo. El clic requiere una decisión del usuario.'),

  P('e3-15', 3,
    'Un lead aceptó recibir la guía, pero no marcó la casilla para recibir comunicaciones comerciales. El workflow le enviaría ofertas. ¿Qué corresponde?',
    [
      'Enviarle las ofertas igual, porque al dejar su correo en el formulario ya aceptó recibir cualquier tipo de comunicación de la marca.',
      'Enviarle solo lo que consintió y pedir permiso explícito para lo comercial, respetando la desuscripción.',
      'Compartir su correo con una marca aliada, para que sea ella quien le envíe las ofertas y así Hogara no infrinja nada.',
      'Esconder las ofertas dentro de la guía para no infringir el consentimiento.'
    ], 1,
    'El consentimiento es por finalidad. Respetarlo es una obligación legal y una buena práctica Inbound: sin permiso no hay relación de confianza.'),

  P('e3-16', 3,
    'El formulario del ebook pide 12 campos (RUT, ingresos, dirección, etc.) y convierte 0,5 %. ¿Qué ajuste es el más adecuado?',
    [
      'Hacer obligatorios todos los campos para obtener leads más calificados.',
      'Quitar el formulario y entregar la guía sin pedir ningún dato.',
      'Pedir solo lo necesario para el siguiente paso (nombre, correo y producto de interés) y completar el perfil después (perfilado progresivo).',
      'Agregar más campos y hacerlos obligatorios, para calificar mejor a los leads y que ventas solo reciba contactos con el perfil completo y verificado.'
    ], 2,
    'Cada campo agrega fricción. El perfilado progresivo pide pocos datos al inicio y completa el perfil en conversiones posteriores. Eliminar el formulario impide capturar el lead.'),

  P('e3-17', 3,
    'Un correo mostrará bloques distintos según el producto de interés: recetas si es el horno y ahorro de agua si es la lavadora. ¿Qué necesitas en los datos?',
    [
      'Que cada contacto haya comprado antes algún producto de la marca.',
      'Un correo distinto, redactado a mano por el equipo, para cada uno de los contactos de la base, de modo que cada mensaje sea realmente personal.',
      'La dirección IP de cada contacto para deducir qué producto le interesa.',
      'Una propiedad de contacto confiable y estandarizada (por ejemplo, «producto de interés» con opciones cerradas) que el correo use como regla.'
    ], 3,
    'El contenido dinámico necesita una propiedad limpia que determine qué variante mostrar. Sin datos estandarizados, la personalización falla.'),

  P('e3-18', 3,
    '¿Qué combinación de filtros de una lista activa identifica mejor a un lead listo para ventas?',
    [
      'Presupuesto declarado alto Y visitó la página de precios en los últimos 14 días Y hizo clic en «Cotiza».',
      'Presupuesto declarado alto O se desuscribió de los correos comerciales.',
      'Abrió al menos un correo en cualquier momento desde que se registró.',
      'País = Chile O no tiene un correo válido registrado.'
    ], 0,
    'La combinación con «Y» exige que se cumplan todas las señales a la vez, y el rango de 14 días asegura que el interés es reciente. Usar «O» mezcla perfiles opuestos.'),

  P('e3-19', 3,
    'Un contacto descarga dos guías distintas. El workflow «Nutrición guía» se activa por envío de formulario y no tiene la reinscripción activada. ¿Qué ocurre con la segunda descarga?',
    [
      'El contacto entra dos veces al flujo, en paralelo, y recibe ambas secuencias de correos al mismo tiempo durante las semanas siguientes.',
      'El workflow se detiene para todos los contactos hasta revisar el duplicado.',
      'No vuelve a entrar al flujo, porque ya estuvo inscrito, salvo que se active la reinscripción para ese disparador.',
      'El CRM elimina el contacto duplicado y conserva solo la primera descarga.'
    ], 2,
    'Sin reinscripción, un contacto entra una sola vez a cada workflow. Para casos así se activa la reinscripción o se crean flujos por guía.'),

  P('e3-20', 3,
    'En la defensa final te piden conectar los tres ejes de la EFT en una sola idea. ¿Cuál es el argumento más completo?',
    [
      'El SEO genera las ventas directamente porque lleva a la gente a la ficha de producto, así que la automatización y el CRM se usan recién después de la compra, para fidelizar y pedir reseñas a los clientes que quedaron conformes.',
      'Las redes sociales atraen y venden; el SEO y el CRM son opcionales para una marca que recién se lanza.',
      'El Flywheel atrae y educa; las Pillar y Cluster Pages llevan demanda orgánica a la landing; el formulario alimenta la segmentación y la nutrición automatizada hasta la venta, y los clientes deleitados impulsan el volante.',
      'La automatización reemplaza al contenido: si los workflows y las listas inteligentes están bien configurados, no hace falta invertir en Atraer ni en SEO, porque los correos de nutrición convierten por sí solos a toda la base de datos.'
    ], 2,
    'Los tres ejes forman un sistema: contenido y diseño atraen y convencen, el SEO trae demanda calificada a la landing, y los datos del formulario permiten segmentar y automatizar hasta convertir y deleitar.')
];

export default {
  id: 'eft-final',
  titulo: 'Desafío MKA1213 · Caso Smart Home',
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
