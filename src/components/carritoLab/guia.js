// Glosario y bibliografía del laboratorio. Lenguaje simple: está pensado para
// alumnos de marketing que nunca han visto una base de datos.

export const BIBLIOGRAFIA = [
  {
    id: 'baymard',
    cita: 'Baymard Institute. (2026). Cart Abandonment Rate Statistics.',
    url: 'https://baymard.com/lists/cart-abandonment-rate',
    nota: 'Promedio de 70,22 % de carros abandonados, calculado sobre 50 estudios. En inglés.'
  },
  {
    id: 'vtex',
    cita: 'VTEX. (s. f.). Setting up abandoned carts. VTEX Help Center.',
    url: 'https://help.vtex.com/en/docs/tutorials/setting-up-abandoned-carts',
    nota:
      'Cómo funciona el carro abandonado en VTEX: el cliente debe haber dejado su email en el checkout o tener sesión iniciada, la sesión expira a los 30 minutos y sólo reciben el correo quienes aceptaron el newsletter. En inglés.'
  },
  {
    id: 'rd-recuperacion',
    cita: 'RD Station. (s. f.). Recuperação de carrinho abandonado: como criar um fluxo automatizado para vender mais. Blog RD Station.',
    url: 'https://www.rdstation.com/blog/ecommerce/recuperacao-carrinho-abandonado/',
    nota: 'El flujo se activa cuando la persona agrega un producto, deja algún dato de contacto y se va sin terminar la compra. En portugués.'
  },
  {
    id: 'rd-vtex',
    cita: 'RD Station. (s. f.). VTEX by RD Station (integración).',
    url: 'https://www.rdstation.com/integracoes/vtex-by-rd-station/',
    nota: 'La integración que conecta la tienda VTEX con el CRM RD Station Marketing. En portugués.'
  },
  {
    id: 'json',
    cita: 'JSON.org. (s. f.). Introducción a JSON.',
    url: 'https://www.json.org/json-es.html',
    nota: 'La definición oficial del formato JSON, en español.'
  },
  {
    id: 'mdn-trim',
    cita: 'MDN Web Docs. (s. f.). String.prototype.trim(). Mozilla.',
    url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/trim',
    nota: 'Qué hace TRIM en programación, con ejemplos. En español.'
  },
  {
    id: 'sheets-trim',
    cita: 'Google. (s. f.). ESPACIOS (TRIM). Ayuda de Editores de Documentos de Google.',
    url: 'https://support.google.com/docs/answer/3094140?hl=es',
    nota: 'La misma función en Google Sheets: sirve para practicarla con una planilla de emails.'
  },
  {
    id: 'wiki-sku',
    cita: 'Wikipedia. (s. f.). Stock-keeping unit.',
    url: 'https://es.wikipedia.org/wiki/Stock-keeping_unit',
    nota: 'Qué es un SKU y para qué se usa en inventario.'
  },
  {
    id: 'wiki-pk',
    cita: 'Wikipedia. (s. f.). Clave primaria.',
    url: 'https://es.wikipedia.org/wiki/Clave_primaria',
    nota: 'Qué es una llave (clave) que identifica cada registro.'
  },
  {
    id: 'wiki-cookie',
    cita: 'Wikipedia. (s. f.). Cookie (informática).',
    url: 'https://es.wikipedia.org/wiki/Cookie_(inform%C3%A1tica)',
    nota: 'Qué es una cookie y cómo permite reconocer a un visitante.'
  },
  {
    id: 'meta-pixel',
    cita: 'Meta. (s. f.). Obtener información sobre el píxel de Meta. Servicio de ayuda de Meta para empresas.',
    url: 'https://www.facebook.com/business/help/742478679120153',
    nota: 'Cómo el píxel registra lo que hace un visitante para mostrarle anuncios después.'
  },
  {
    id: 'ley-21719',
    cita: 'Ley N.º 21.719. Regula la protección y el tratamiento de los datos personales y crea la Agencia de Protección de Datos Personales. Biblioteca del Congreso Nacional de Chile.',
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=1209272',
    nota: 'La ley chilena que regula el uso de datos personales y el consentimiento.'
  },
  {
    id: 'merchant-group',
    cita: 'Google. (s. f.). ID de grupo de artículos [item_group_id]. Ayuda de Google Merchant Center.',
    url: 'https://support.google.com/merchants/answer/6324507?hl=es',
    nota: 'Cómo Google Shopping agrupa las variantes (talla, color) de un mismo producto.'
  },
  {
    id: 'google-variantes',
    cita: 'Google. (s. f.). Datos estructurados de variantes de producto (ProductGroup, Product). Centro de la Búsqueda de Google.',
    url: 'https://developers.google.com/search/docs/appearance/structured-data/product-variants?hl=es',
    nota: 'Cómo declarar tallas y colores para que Google los entienda.'
  },
  {
    id: 'google-facetas',
    cita: 'Google. (s. f.). Gestionar el rastreo de URLs de navegación por facetas. Centro de la Búsqueda de Google.',
    url: 'https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation?hl=es',
    nota: 'Qué pasa con el SEO cuando los filtros de la tienda generan muchas URLs.'
  },
  {
    id: 'schema-product',
    cita: 'Schema.org. (s. f.). Product y ProductGroup.',
    url: 'https://schema.org/ProductGroup',
    nota: 'El vocabulario estándar para describir productos a los buscadores. En inglés.'
  }
];

export const GLOSARIO = [
  {
    id: 'carrito-abandonado',
    termino: 'Carrito abandonado',
    simple:
      'Cuando alguien agrega productos al carro y se va sin pagar. Pasa muchísimo: en promedio, 7 de cada 10 carros se abandonan.',
    ejemplo: 'Ana mete unas zapatillas al carro, le llega un mensaje, cierra el celular y nunca vuelve.',
    fuentes: ['baymard', 'vtex', 'rd-recuperacion']
  },
  {
    id: 'evento',
    termino: 'Evento',
    simple:
      'Un aviso automático que un sistema le manda a otro cuando pasa algo: «se abandonó un carro», «se pagó un pedido». El aviso lleva los datos de lo que pasó.',
    ejemplo: 'Como la notificación del banco cuando usas la tarjeta: trae el monto, el comercio y la hora.',
    fuentes: ['rd-vtex']
  },
  {
    id: 'json',
    termino: 'JSON',
    simple:
      'El formato en que viajan los datos entre sistemas. Es una ficha con etiquetas y valores. Las llaves { } encierran una ficha y los corchetes [ ] encierran una lista de fichas.',
    ejemplo: '{ "nombre": "Ana", "talla": "38" } se lee: la etiqueta nombre vale Ana y la etiqueta talla vale 38.',
    fuentes: ['json']
  },
  {
    id: 'crm',
    termino: 'CRM',
    simple:
      'Viene de Customer Relationship Management. Es la base de datos de clientes de la empresa: quién es cada uno, qué compró, qué dejó en el carro y qué permisos dio. Desde ahí salen los correos y WhatsApp automáticos. Ejemplos: RD Station, HubSpot.',
    ejemplo: 'La ficha de Ana en el CRM dice: 2 compras, 1 carro abandonado, acepta email, no acepta WhatsApp.',
    fuentes: ['rd-vtex']
  },
  {
    id: 'plataforma',
    termino: 'Plataforma de e-commerce (VTEX)',
    simple:
      'El sistema donde vive la tienda online: catálogo, carro y pagos. Es la que «avisa» al CRM cuando alguien abandona un carro o compra.',
    ejemplo: 'VTEX, Shopify y WooCommerce son plataformas de e-commerce.',
    fuentes: ['vtex']
  },
  {
    id: 'automatizacion',
    termino: 'Automatización (flujo)',
    simple: 'Una regla del tipo «si pasa X, haz Y» que corre sola, sin que nadie apriete un botón.',
    ejemplo: 'Si un carro lleva 1 hora abandonado y la persona aceptó email → mandarle el correo de recuperación.',
    fuentes: ['rd-recuperacion']
  },
  {
    id: 'sesion',
    termino: 'Sesión',
    simple:
      'El rato en que estás activo en la tienda. Si pasas un tiempo sin hacer nada, la sesión se cierra. En VTEX se cierra a los 30 minutos, y recién ahí se puede considerar abandonado el carro.',
    ejemplo: 'Cerrar la pestaña no le avisa nada a la tienda: simplemente dejas de hacer cosas y la sesión vence.',
    fuentes: ['vtex']
  },
  {
    id: 'sku',
    termino: 'SKU (variante)',
    simple:
      'Viene de Stock Keeping Unit. Es el código de UNA versión exacta de un producto, la que se puede vender y contar en bodega. El producto es la familia; el SKU es el par concreto.',
    ejemplo:
      'Producto: «Zapatilla Runner». SKUs: «Runner negra talla 38», «Runner negra talla 39», «Runner blanca talla 38»… Igual que «Coca-Cola» es el producto y «lata 350 ml» es un SKU.',
    fuentes: ['wiki-sku', 'merchant-group']
  },
  {
    id: 'llave',
    termino: 'Llave o ID',
    simple:
      'El dato que identifica algo sin confusión, como el RUT identifica a una persona. productId identifica al producto, skuId a la variante y el email al cliente en el CRM. Si la llave llega escrita distinto, el sistema cree que son dos cosas diferentes.',
    ejemplo: 'Para el CRM, «ana@gmail.com» y « Ana@Gmail.com » son dos llaves distintas → dos Anas.',
    fuentes: ['wiki-pk']
  },
  {
    id: 'fk',
    termino: 'Llave foránea (FK)',
    simple:
      'Cuando una tabla «apunta» a otra usando la llave de esa otra tabla. Así se conectan las tablas entre sí.',
    ejemplo: 'Cada SKU guarda el productId del producto al que pertenece: así sabes que «Runner negra 38» es hija de «Zapatilla Runner».',
    fuentes: ['wiki-pk']
  },
  {
    id: 'tipo-campo',
    termino: 'Tipo de campo',
    simple:
      'Define qué se puede escribir en un campo: texto libre, número, una opción de una lista, sí/no, una imagen o un ID. Elegir bien el tipo evita errores antes de que pasen.',
    ejemplo: 'Si «precio» es de tipo Número, nadie puede escribir «$39.990» ni «consultar».',
    fuentes: ['wiki-pk']
  },
  {
    id: 'interno-etiqueta',
    termino: 'Nombre interno y etiqueta',
    simple:
      'Cada campo tiene dos nombres. El nombre interno lo usan las máquinas: minúsculas, sin espacios ni tildes. La etiqueta es la que ve la gente en la tienda o en el CRM.',
    ejemplo: 'Nombre interno: material_capellada. Etiqueta: «Material de la capellada».',
    fuentes: ['json']
  },
  {
    id: 'valor-interno',
    termino: 'Valor interno',
    simple:
      'En una lista cerrada, cada opción también tiene dos caras: la etiqueta que ve el cliente y el valor interno que viaja entre sistemas. Si cambias la etiqueta (por ejemplo, la traduces), el valor interno sigue igual y nada se rompe.',
    ejemplo: 'Etiqueta «Café» → valor interno cafe. En el JSON viaja "color": "cafe"; en el correo se lee «Café».',
    fuentes: ['merchant-group']
  },
  {
    id: 'trim',
    termino: 'TRIM',
    simple:
      'En inglés trim significa «recortar». Es una función que borra los espacios que sobran al inicio y al final de un texto. Existe en Excel y Google Sheets (en español se llama ESPACIOS) y en todos los lenguajes de programación.',
    ejemplo: '=ESPACIOS("  Ana@Gmail.com ") devuelve "Ana@Gmail.com". Después se pasa a minúsculas: "ana@gmail.com".',
    fuentes: ['sheets-trim', 'mdn-trim']
  },
  {
    id: 'normalizar',
    termino: 'Normalizar',
    simple:
      'Dejar los datos escritos siempre de la misma forma antes de guardarlos o compararlos. Para un email: TRIM + minúsculas. Para un color: elegirlo de una lista.',
    ejemplo: '«NEGRO», «negro » y «Negro» quedan todos como «Negro».',
    fuentes: ['mdn-trim']
  },
  {
    id: 'lista-cerrada',
    termino: 'Lista cerrada',
    simple:
      'Un campo donde se elige entre opciones fijas (un menú) en vez de escribir a mano. Es lo que permite filtrar, contar y comparar.',
    ejemplo: 'Material: [Cuero | Sintético | Textil | Goma]. Ya no puede aparecer «cuero vacuno» ni «CUERO».',
    fuentes: ['google-facetas']
  },
  {
    id: 'sistema-talla',
    termino: 'Sistema de talla',
    simple:
      'Las tallas se escriben distinto según el país o la marca: chilena (38), estadounidense (US 7) o letras (M, L). Hay que guardar en qué sistema está cada talla y tener una tabla de equivalencias.',
    ejemplo: 'En el botín del simulador, la talla L equivale a la 38 chilena.',
    fuentes: ['google-variantes']
  },
  {
    id: 'consentimiento',
    termino: 'Consentimiento (opt-in / opt-out)',
    simple:
      'El permiso que da la persona para recibir mensajes. Opt-in = aceptó; opt-out = rechazó o se dio de baja. Se guarda por canal (email, WhatsApp), porque alguien puede aceptar uno y rechazar el otro. En Chile lo regula la Ley 21.719 de datos personales.',
    ejemplo: 'Diego marcó «acepto email» pero no «acepto WhatsApp»: escribirle por WhatsApp es usar sus datos sin permiso.',
    fuentes: ['ley-21719', 'vtex']
  },
  {
    id: 'cookie',
    termino: 'Cookie',
    simple:
      'Un archivo pequeño que el sitio guarda en tu navegador para reconocerte cuando vuelves. Si alguna vez dejaste tu email (por ejemplo, en el newsletter), la cookie permite unir tus visitas siguientes con ese email.',
    ejemplo: 'Te suscribiste al newsletter en marzo. En junio vuelves desde el mismo navegador y la tienda sabe que eres tú, aunque no hayas iniciado sesión.',
    fuentes: ['wiki-cookie']
  },
  {
    id: 'remarketing',
    termino: 'Píxel y remarketing',
    simple:
      'El píxel es un código de Meta o Google instalado en la tienda que registra qué mira cada visitante. Con eso se le muestran anuncios del producto que dejó (remarketing), aunque nunca haya dado su email.',
    ejemplo: 'Miraste un botín, te fuiste y al rato te aparece ese mismo botín en Instagram.',
    fuentes: ['meta-pixel']
  },
  {
    id: 'cabecera-detalle',
    termino: 'Cabecera y detalle de un pedido',
    simple:
      'Un pedido es como una boleta: arriba va la cabecera (quién compró, cuándo, el total) y abajo el detalle, con una línea por cada producto. El estado «devuelto» tiene que ir en la línea, no arriba.',
    ejemplo: 'Si devuelves la leche en el supermercado, se anula esa línea, no la boleta completa.',
    fuentes: ['wiki-pk']
  },
  {
    id: 'faceta',
    termino: 'Faceta (filtro)',
    simple:
      'Los filtros de la tienda: material, color, talla. Cada filtro genera una dirección web, por ejemplo /zapatos/cuero. Si los datos están sucios, salen páginas repetidas o casi vacías, y Google las entiende mal.',
    ejemplo: '«NEGRO» y «Negro» generan dos filtros distintos, cada uno con la mitad de los zapatos negros.',
    fuentes: ['google-facetas']
  },
  {
    id: 'schema',
    termino: 'Datos estructurados (schema.org)',
    simple:
      'Un JSON escondido en la página del producto que le explica a Google qué es: nombre, precio, tallas, colores, stock. Con eso Google puede mostrar el precio y la disponibilidad directo en los resultados.',
    ejemplo: 'Cuando buscas un producto y Google te muestra «$39.990 · En stock» debajo del link.',
    fuentes: ['schema-product', 'google-variantes']
  }
];

export const terminoById = (id) => GLOSARIO.find((g) => g.id === id);
export const fuenteById = (id) => BIBLIOGRAFIA.find((b) => b.id === id);
