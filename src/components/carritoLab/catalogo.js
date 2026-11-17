// Catálogo de una zapatería FICTICIA ("Pasos"). Los errores de cada ficha
// imitan los que aparecen en la auditoría de un catálogo real de calzado
// (material contradictorio, tallas en letras o US, colores escritos distinto,
// fichas sin foto), sin usar la marca ni los datos de ningún cliente.

export const COLOR_HEX = {
  Negro: '#1f2937',
  Blanco: '#e5e7eb',
  Café: '#7c4a2d',
  Azul: '#2563eb',
  Rojo: '#dc2626',
  Rosado: '#f472b6',
  Beige: '#d6c4a1'
};

// Listas cerradas del modelo propuesto
export const MATERIALES = ['Cuero', 'Sintético', 'Textil', 'Goma'];
export const COLORES = Object.keys(COLOR_HEX).filter((c) => c !== 'Beige');

export function shoeSvg(color) {
  const fill = COLOR_HEX[color] || '#94a3b8';
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'>` +
    `<rect width='120' height='80' fill='#f1f5f9'/>` +
    `<path d='M14 52 C14 40 22 31 34 31 L52 31 C60 31 64 22 72 22 L79 22 C81 34 92 40 106 44 C113 46 113 56 106 58 L18 58 C15 58 14 56 14 52Z' fill='${fill}' stroke='#0f172a' stroke-width='1.5'/>` +
    `<path d='M60 31 L66 40 M66 28 L72 38 M72 25 L78 35' stroke='#f8fafc' stroke-width='1.6' opacity='0.8'/>` +
    `<rect x='12' y='57' width='99' height='7' rx='3' fill='#334155'/></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Largo de plantilla aproximado según talla chilena
const plantilla = (talla) => Math.round((Number(talla) * (2 / 3) - 1) * 10) / 10;

const RAW = [
  {
    productId: 'P-1001',
    nombre: 'Zapatilla Urbana Runner',
    marca: 'Andes',
    genero: 'Mujer',
    tipo: 'Zapatilla',
    horma: 'Normal',
    precio: 39990,
    descripcion: 'Zapatilla urbana con exterior de cuero liso, plantilla acolchada y suela de goma.',
    capellada: 'Cuero',
    suela: 'Goma',
    colores: ['Negro', 'Blanco'],
    tallas: ['37', '38', '39', '40'],
    dirty: { material: 'SINTÉTICO', color: 'Negro/Blanco', tallas: '37,38,39,40', foto: 'Negro' },
    trampa: 'El campo material dice SINTÉTICO, pero la descripción dice «exterior de cuero liso».'
  },
  {
    productId: 'P-1002',
    nombre: 'Botín Chelsea',
    marca: 'Austral',
    genero: 'Mujer',
    tipo: 'Botín',
    horma: 'Ancha',
    precio: 54990,
    descripcion: 'Botín con elásticos laterales, capellada de cuero y suela de goma antideslizante.',
    capellada: 'Cuero',
    suela: 'Goma',
    colores: ['Café', 'Negro'],
    tallas: ['36', '37', '38', '39'],
    tallasRaw: { 36: 'S', 37: 'M', 38: 'L', 39: 'XL' },
    dirty: {
      material: 'Cuero',
      color: 'café ',
      colorAlias: { Café: 'café ', Negro: 'negro' },
      tallas: 'S, M, L, XL',
      foto: 'Café'
    },
    trampa: 'Se vende en tallas de letra (S, M, L, XL) mientras el resto usa talla chilena.'
  },
  {
    productId: 'P-1003',
    nombre: 'Sandalia Playa Brisa',
    marca: 'Litoral',
    genero: 'Unisex',
    tipo: 'Sandalia',
    horma: 'Normal',
    precio: 19990,
    descripcion: 'Sandalia liviana de tiras textiles con suela de goma EVA.',
    capellada: 'Textil',
    suela: 'Goma',
    colores: ['Azul', 'Rojo'],
    tallas: ['35', '36', '37', '38'],
    dirty: { material: '', color: 'Azul, Rojo', tallas: '35-38', foto: null },
    trampa: 'No declara material y no tiene foto cargada.'
  },
  {
    productId: 'P-1004',
    nombre: 'Mocasín Clásico',
    marca: 'Andes',
    genero: 'Hombre',
    tipo: 'Mocasín',
    horma: 'Normal',
    precio: 49990,
    descripcion: 'Mocasín de cuero vacuno con costura a mano y suela de cuero.',
    capellada: 'Cuero',
    suela: 'Cuero',
    colores: ['Negro'],
    tallas: ['40', '41', '42', '43'],
    dirty: {
      material: 'cuero vacuno',
      color: 'NEGRO',
      colorAlias: { Negro: 'NEGRO' },
      tallas: '40 41 42 43',
      foto: 'Negro'
    },
    trampa: '«NEGRO» y «Negro» son dos valores distintos para una máquina.'
  },
  {
    productId: 'P-1005',
    nombre: 'Oxford Bicolor',
    marca: 'Austral',
    genero: 'Hombre',
    tipo: 'Zapato',
    horma: 'Angosta',
    precio: 59990,
    descripcion: 'Oxford con capellada de cuero café, punta beige y suela sintética.',
    capellada: 'Cuero',
    suela: 'Sintético',
    colores: ['Café'],
    tallas: ['39', '40', '41', '42'],
    dirty: { material: 'Cuero / sintético', color: 'Café-Beige', tallas: '39,40,41,42', foto: 'Café' },
    trampa: 'Es bimaterial: un solo campo «material» no alcanza para describirlo.'
  },
  {
    productId: 'P-1006',
    nombre: 'Zapatilla Kids Saltarina',
    marca: 'Litoral',
    genero: 'Niña',
    tipo: 'Zapatilla',
    horma: 'Normal',
    precio: 24990,
    descripcion: 'Zapatilla infantil de tela con velcro y suela de goma.',
    capellada: 'Textil',
    suela: 'Goma',
    colores: ['Rosado', 'Blanco'],
    tallas: ['27', '28', '29'],
    tallasRaw: { 27: 'US 10', 28: 'US 11', 29: 'US 12' },
    dirty: {
      material: 'Textil',
      color: 'rosado',
      colorAlias: { Rosado: 'rosado', Blanco: 'blanco' },
      tallas: 'US 10, US 11, US 12',
      foto: 'Rosado'
    },
    trampa: 'Tallas en sistema US mezcladas con talla chilena.'
  }
];

const code = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .slice(0, 3)
    .toUpperCase();

export const PRODUCTS = RAW.map((p) => ({
  ...p,
  skus: p.colores.flatMap((color) =>
    p.tallas.map((t) => ({
      skuId: `${p.productId.slice(2)}-${code(color)}-${t}`,
      productId: p.productId,
      color,
      talla: t,
      tallaRaw: p.tallasRaw?.[t] ?? t,
      plantilla_cm: plantilla(t),
      stock: (Number(t) * 7 + color.length) % 6
    }))
  )
}));

export const productById = (id) => PRODUCTS.find((p) => p.productId === id);

export const skuOf = (p, color, talla) =>
  p.skus.find((s) => s.color === color && s.talla === talla);

export const clp = (n) => '$' + Number(n).toLocaleString('es-CL');
