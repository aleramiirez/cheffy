// Datos iniciales de productos — se cargan solo la primera vez (localStorage vacío)
export const INITIAL_ITEMS = [
  // ─── FRUTAS Y VERDURAS ────────────────────────────────────────
  { nombre: 'Lechuga',        categoriaId: 'frutas-verduras', emoji: '🥬' },
  { nombre: 'Tomate',         categoriaId: 'frutas-verduras', emoji: '🍅' },
  { nombre: 'Pimiento',       categoriaId: 'frutas-verduras', emoji: '🫑' },
  { nombre: 'Ajo',            categoriaId: 'frutas-verduras', emoji: '🧄' },
  { nombre: 'Zanahoria',      categoriaId: 'frutas-verduras', emoji: '🥕' },
  { nombre: 'Patatas',        categoriaId: 'frutas-verduras', emoji: '🥔' },
  { nombre: 'Champiñones',    categoriaId: 'frutas-verduras', emoji: '🍄' },
  { nombre: 'Aguacate',       categoriaId: 'frutas-verduras', emoji: '🥑' },
  { nombre: 'Remolacha',      categoriaId: 'frutas-verduras', emoji: '🫀' },
  { nombre: 'Ensalada',       categoriaId: 'frutas-verduras', emoji: '🥗' },
  { nombre: 'Sandía',         categoriaId: 'frutas-verduras', emoji: '🍉' },
  { nombre: 'Melón',          categoriaId: 'frutas-verduras', emoji: '🍈' },
  { nombre: 'Melocotón',      categoriaId: 'frutas-verduras', emoji: '🍑' },
  { nombre: 'Manzana',        categoriaId: 'frutas-verduras', emoji: '🍎' },
  { nombre: 'Plátano',        categoriaId: 'frutas-verduras', emoji: '🍌' },
  { nombre: 'Pera',           categoriaId: 'frutas-verduras', emoji: '🍐' },
  { nombre: 'Fresas',         categoriaId: 'frutas-verduras', emoji: '🍓' },
  { nombre: 'Mandarina',      categoriaId: 'frutas-verduras', emoji: '🍊' },
  { nombre: 'Naranja',        categoriaId: 'frutas-verduras', emoji: '🍊' },
  { nombre: 'Limón',          categoriaId: 'frutas-verduras', emoji: '🍋' },

  // ─── CARNES Y AVES ────────────────────────────────────────────
  { nombre: 'Pechuga de Pollo',           categoriaId: 'carnes', emoji: '🍗' },
  { nombre: 'Carne Picada',               categoriaId: 'carnes', emoji: '🥩' },
  { nombre: 'Hamburguesa',                categoriaId: 'carnes', emoji: '🍔' },
  { nombre: 'Carne',                      categoriaId: 'carnes', emoji: '🥩' },
  { nombre: 'Salchichas',                 categoriaId: 'carnes', emoji: '🌭' },
  { nombre: 'Pollo con Verdura para Fajitas', categoriaId: 'carnes', emoji: '🌯' },

  // ─── CHARCUTERÍA Y EMBUTIDOS ──────────────────────────────────
  { nombre: 'Lonchas Pechuga de Pavo',    categoriaId: 'charcuteria', emoji: '🦃' },
  { nombre: 'Taquitos de Beicon',         categoriaId: 'charcuteria', emoji: '🥓' },
  { nombre: 'Taquitos de Jamón',          categoriaId: 'charcuteria', emoji: '🍖' },
  { nombre: 'Jamon Serrano',              categoriaId: 'charcuteria', emoji: '🍖' },
  { nombre: 'Jamon Cocido',               categoriaId: 'charcuteria', emoji: '🍖' },
  { nombre: 'Fuet',                       categoriaId: 'charcuteria', emoji: '🥩' },

  // ─── PESCADOS Y MARISCOS ──────────────────────────────────────
  { nombre: 'Merluza',        categoriaId: 'pescados', emoji: '🐟' },
  { nombre: 'Salmón Ahumado', categoriaId: 'pescados', emoji: '🐠' },
  { nombre: 'Atún en Lata',   categoriaId: 'pescados', emoji: '🐡' },
  { nombre: 'Mejillones',     categoriaId: 'pescados', emoji: '🦪' },
  { nombre: 'Berberechos',    categoriaId: 'pescados', emoji: '🦪' },

  // ─── LÁCTEOS Y HUEVOS ─────────────────────────────────────────
  { nombre: 'Huevos',           categoriaId: 'lacteos', emoji: '🥚' },
  { nombre: 'Leche',            categoriaId: 'lacteos', emoji: '🥛' },
  { nombre: 'Leche de Avena',   categoriaId: 'lacteos', emoji: '🌾' },
  { nombre: 'Yogurt',           categoriaId: 'lacteos', emoji: '🫙' },
  { nombre: 'Flan de Huevo',    categoriaId: 'lacteos', emoji: '🍮' },
  { nombre: 'Queso',            categoriaId: 'lacteos', emoji: '🧀' },
  { nombre: 'Queso Rallado',    categoriaId: 'lacteos', emoji: '🧀' },
  { nombre: 'Queso en Loncha',  categoriaId: 'lacteos', emoji: '🧀' },

  // ─── PANADERÍA Y CEREALES ─────────────────────────────────────
  { nombre: 'Pan',              categoriaId: 'panaderia', emoji: '🍞' },
  { nombre: 'Pan Bimbo',        categoriaId: 'panaderia', emoji: '🍞' },
  { nombre: 'Tostas Wasa',      categoriaId: 'panaderia', emoji: '🫓' },
  { nombre: 'Cereales',         categoriaId: 'panaderia', emoji: '🌾' },

  // ─── DESPENSA Y CONSERVAS ─────────────────────────────────────
  { nombre: 'Arroz',            categoriaId: 'despensa', emoji: '🍚' },
  { nombre: 'Pasta Pajarita',   categoriaId: 'despensa', emoji: '🍝' },
  { nombre: 'Espaguettis',      categoriaId: 'despensa', emoji: '🍝' },
  { nombre: 'Maíz',             categoriaId: 'despensa', emoji: '🌽' },
  { nombre: 'Tomate Frito',     categoriaId: 'despensa', emoji: '🍅' },
  { nombre: 'Ketchup',          categoriaId: 'despensa', emoji: '🍅' },
  { nombre: 'Salsa Gaucha',     categoriaId: 'despensa', emoji: '🫙' },
  { nombre: 'Fajitas',          categoriaId: 'despensa', emoji: '🌮' },
  { nombre: 'Arroz Tres Delicias', categoriaId: 'despensa', emoji: '🍱' },

  // ─── DULCES Y SNACKS ──────────────────────────────────────────
  { nombre: 'Almendras',        categoriaId: 'dulces', emoji: '🥜' },
  { nombre: 'Patatas de Bolsa', categoriaId: 'dulces', emoji: '🥔' },

  // ─── ESPECIAS Y CONDIMENTOS ───────────────────────────────────
  { nombre: 'Jengibre en Polvo', categoriaId: 'especias', emoji: '🫚' },

  // ─── CONGELADOS ───────────────────────────────────────────────
  { nombre: 'Patatas Fritas',    categoriaId: 'congelados', emoji: '🍟' },

  // ─── BEBIDAS ──────────────────────────────────────────────────
  { nombre: 'Agua',    categoriaId: 'bebidas', emoji: '💧' },
  { nombre: 'Café',    categoriaId: 'bebidas', emoji: '☕' },
  { nombre: 'Cerveza', categoriaId: 'bebidas', emoji: '🍺' },

  // ─── LIMPIEZA ─────────────────────────────────────────────────
  { nombre: 'Detergente',       categoriaId: 'limpieza', emoji: '🧺' },
  { nombre: 'Friegasuelo',      categoriaId: 'limpieza', emoji: '🫧' },
  { nombre: 'Multiusos',        categoriaId: 'limpieza', emoji: '🧹' },
  { nombre: 'Fairy',            categoriaId: 'limpieza', emoji: '🍽️' },
  { nombre: 'Estropajo',        categoriaId: 'limpieza', emoji: '🧽' },
  { nombre: 'Trapos',           categoriaId: 'limpieza', emoji: '🧻' },
  { nombre: 'Papel Higiénico',  categoriaId: 'limpieza', emoji: '🧻' },
  { nombre: 'Papel de Cocina',  categoriaId: 'limpieza', emoji: '🧻' },
  { nombre: 'Servilletas',      categoriaId: 'limpieza', emoji: '🤧' },

  // ─── HIGIENE ──────────────────────────────────────────────────
  { nombre: 'Pasta de dientes', categoriaId: 'higiene', emoji: '🦷' },
  { nombre: 'Gel',              categoriaId: 'higiene', emoji: '🚿' },
  { nombre: 'Champú',           categoriaId: 'higiene', emoji: '💆' },
  { nombre: 'Jabon',            categoriaId: 'higiene', emoji: '🧼' },
  { nombre: 'Tampones',         categoriaId: 'higiene', emoji: '🩸' },
]
