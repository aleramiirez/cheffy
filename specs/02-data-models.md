# Spec 02 — Modelos de Datos

## Descripción General
Todos los datos se persisten en `localStorage` a través del store de Zustand. No existe base de datos externa ni backend. Esta spec define las estructuras de datos que maneja la aplicación.

---

## Modelo: `Item`

Representa un producto que el usuario ha añadido a su lista (alimento, producto de limpieza, higiene, etc.).

```typescript
interface Item {
  id: string;           // UUID generado al crear (crypto.randomUUID())
  nombre: string;       // Nombre del producto (ej: "Leche entera")
  categoriaId: string;  // ID de la categoría a la que pertenece
  emoji: string;        // Emoji representativo (ej: "🥛"), por defecto "📦"
  enLista: boolean;     // true = "me falta" / está en la lista de compra
  tengo: boolean;       // true = tengo en casa (en stock)
  creadoEn: number;     // timestamp Date.now() de creación
}
```

### Reglas de negocio del Item
- `enLista: true` → aparece en Modo Compra
- `enLista: false` → solo aparece en la Lista principal
- `tengo` es informativo (podría usarse en recetas para saber qué hay en casa)
- Un item puede tener `enLista: true` y `tengo: false` simultáneamente
- Al "confirmar compra", los items tachados pasan a `enLista: false, tengo: true`
- El usuario puede eliminar cualquier item de la lista

### Estados posibles de un Item
| enLista | Descripción | Vista donde aparece |
|---------|-------------|---------------------|
| `false` | No lo necesito comprar | Solo en Lista principal |
| `true` | Me falta, hay que comprarlo | Lista principal + Modo Compra |

---

## Modelo: `Category`

Representa una categoría de producto, organizada como en un supermercado real.

```typescript
interface Category {
  id: string;     // Identificador único (slug, ej: "frutas-verduras")
  nombre: string; // Nombre mostrado (ej: "Frutas y Verduras")
  emoji: string;  // Emoji del grupo (ej: "🥦")
  orden: number;  // Orden de aparición en la lista
}
```

### Categorías predefinidas (no editables por el usuario)

| orden | id | nombre | emoji |
|---|---|---|---|
| 1 | `frutas-verduras` | Frutas y Verduras | 🥦 |
| 2 | `carnes` | Carnes y Aves | 🥩 |
| 3 | `pescados` | Pescados y Mariscos | 🐟 |
| 4 | `lacteos` | Lácteos y Huevos | 🧀 |
| 5 | `panaderia` | Panadería y Cereales | 🍞 |
| 6 | `despensa` | Despensa y Conservas | 🫙 |
| 7 | `congelados` | Congelados | ❄️ |
| 8 | `bebidas` | Bebidas | 🥤 |
| 9 | `limpieza` | Limpieza del Hogar | 🧹 |
| 10 | `higiene` | Higiene y Cuidado Personal | 🧴 |
| 11 | `otros` | Otros | 📦 |

---

## Modelo: `Recipe`

Representa una receta, ya sea creada manualmente por el usuario o importada de TheMealDB.

```typescript
interface Recipe {
  id: string;                    // UUID propio o prefijado "mealdb-{idExterno}"
  nombre: string;                // Nombre de la receta
  fuente: 'propia' | 'mealdb';  // Origen de la receta
  ingredientes: Ingredient[];    // Lista de ingredientes
  pasos: string[];               // Pasos numerados como array de strings
  foto?: string;                 // URL (mealdb) o base64 (propia)
  categoriaReceta?: string;      // Ej: "Pasta", "Pollo", "Postres"
  tiempoMinutos?: number;        // Tiempo estimado en minutos (opcional)
  creadoEn: number;              // timestamp Date.now()
  guardada: boolean;             // Si el usuario la ha guardado/favoriteado
}

interface Ingredient {
  nombre: string;    // Nombre del ingrediente
  cantidad?: string; // Cantidad libre (ej: "200g", "2 cucharadas", "al gusto")
}
```

### Reglas de negocio de Recipe
- Las recetas con `fuente: 'propia'` siempre están disponibles (offline)
- Las recetas con `fuente: 'mealdb'` se obtienen de la API y se pueden **guardar** localmente
- Una vez guardada una receta de TheMealDB (`guardada: true`), está disponible offline
- Las fotos propias se convierten a base64 y se almacenan en localStorage
- ⚠️ Límite recomendado: advertir al usuario si el localStorage supera 4MB (por las fotos)

---

## Modelo: `ShoppingSession`

Representa una sesión de compra temporal (los items tachados durante el modo compra).

```typescript
interface ShoppingSession {
  itemsTachados: string[]; // Array de item IDs que el usuario ha tachado en la sesión actual
}
```

### Reglas de negocio de ShoppingSession
- Se resetea cada vez que el usuario pulsa "Ya he comprado"
- Se resetea si el usuario abandona el Modo Compra (opcional: preguntar)
- Es temporal, no se persiste entre sesiones

---

## Estado Global del Store (Zustand)

```typescript
interface AppState {
  // --- DATOS ---
  items: Item[];
  categories: Category[];      // Inmutable: categorías predefinidas
  recipes: Recipe[];           // Recetas guardadas (propias + favoritas de mealdb)
  shoppingSession: ShoppingSession;

  // --- ACCIONES: Items ---
  addItem: (nombre: string, categoriaId: string, emoji?: string) => void;
  removeItem: (id: string) => void;
  toggleEnLista: (id: string) => void;   // Marca/desmarca "me falta"
  updateItem: (id: string, changes: Partial<Item>) => void;

  // --- ACCIONES: Compra ---
  tacharItemCompra: (id: string) => void;     // Añade a itemsTachados
  destacharItemCompra: (id: string) => void;  // Quita de itemsTachados
  confirmarCompra: () => void;               // Tachados → tengo:true, enLista:false

  // --- ACCIONES: Recetas ---
  addReceta: (receta: Omit<Recipe, 'id' | 'creadoEn'>) => void;
  removeReceta: (id: string) => void;
  updateReceta: (id: string, changes: Partial<Recipe>) => void;
  guardarRecetaMealDB: (recetaMealDB: Recipe) => void;
}
```

---

## Persistencia en localStorage

### Clave de alm