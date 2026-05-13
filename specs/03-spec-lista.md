# Spec 03 — Pantalla Lista (Principal)

## Descripción
La pantalla principal de la app. Aquí el usuario gestiona todos sus productos: los crea, los busca y los marca como "me falta" para añadirlos a la lista de compra.

## Ruta
`/` (ruta raíz, tab activo por defecto)

---

## Layout General

```
┌─────────────────────────────────┐
│  Header: "Mi Lista"   [filtros] │  ← Header fijo
├─────────────────────────────────┤
│  🔍 Buscar productos...         │  ← Buscador sticky
├─────────────────────────────────┤
│  📊 Chips de filtro:            │  ← Filtros rápidos
│  [Todos] [Me falta] [Tengo]     │
├─────────────────────────────────┤
│  🥦 Frutas y Verduras (3)  ▼   │  ← Categoría colapsable
│    🍎 Manzanas        [toggle]  │
│    🥕 Zanahorias      [toggle]  │
│    🍋 Limones         [toggle]  │
│                                 │
│  🥩 Carnes y Aves (1)     ▼   │
│    🍗 Pollo           [toggle]  │
│                                 │
│  [+ Añadir "leche entera"]      │  ← Si búsqueda sin resultados
├─────────────────────────────────┤
│  🛍️ Lista  🛒 Compra  🍳 Recetas│  ← BottomNav fijo
└─────────────────────────────────┘
```

---

## Componentes

### 1. Header (`Header.jsx`)
- **Título**: "Mi Lista" con icono 🛍️
- **Acción derecha**: icono de papelera o ajustes (vaciar lista completa, con confirmación)

### 2. Buscador (`Buscador.jsx`)
- Input de texto con icono de lupa 🔍
- Placeholder: "Buscar o añadir producto..."
- Sticky: se mantiene visible al hacer scroll
- Comportamiento al escribir:
  - Filtra en tiempo real los items existentes (por nombre, insensible a mayúsculas/acentos)
  - Si no hay coincidencias exactas → mostrar botón **"+ Añadir '[término]'"**
  - Si hay coincidencias parciales → mostrar los items filtrados + opción de añadir
- Botón de limpiar (✕) visible cuando hay texto escrito
- Al pulsar ✕ o vaciar: vuelve a mostrar todos los items

### 3. Chips de filtro
- **[Todos]**: muestra todos los items del usuario
- **[Me falta]**: filtra solo `enLista: true`  
- **[Tengo]**: filtra solo `tengo: true` (y `enLista: false`)
- Solo un chip activo a la vez
- Chip activo: fondo `primary`, texto blanco
- Chip inactivo: fondo gris claro, texto `text-muted`

### 4. Lista agrupada por categorías (`CategoriaGroup.jsx`)
- Agrupa los items visibles por `categoriaId`
- Ordena las categorías según `orden` definido en el modelo
- Solo muestra categorías que tengan al menos un item visible
- Cada grupo es **colapsable** (estado local de la pantalla, no persistido):
  - Por defecto: expandido
  - Header del grupo: emoji + nombre + conteo entre paréntesis + chevron ▼/▶
  - Animación suave de expansión/colapso

### 5. Item de la lista (`ItemRow.jsx`)
```
┌──────────────────────────────────────┐
│ [emoji] Nombre del producto    [🔴]  │
│         Categoría             [toggle]│
└──────────────────────────────────────┘
```
- **Emoji**: grande (24px), a la izquierda
- **Nombre**: texto principal, negrita suave
- **Categoría**: subtexto pequeño en gris (nombre de la categoría)
- **Toggle "me falta"** (derecha): 
  - OFF (gris): tengo / no necesito comprar
  - ON (color `primary`): me falta, está en lista de compra
  - Animación de cambio de estado (escala + color)
- **Swipe left** (en móvil) o botón de eliminar (🗑️): eliminar item
  - Confirmación visual: el item se desliza y desaparece

### 6. Botón "Añadir producto" (`AddItemModal.jsx`)
Se activa cuando el buscador no encuentra coincidencias exactas o el usuario pulsa el botón "+".

**Modal / Bottom Sheet** (en móvil: sube desde abajo):
```
┌─────────────────────────────────┐
│  ✕              Añadir producto │
├─────────────────────────────────┤
│  Nombre:                        │
│  [leche entera            ]     │
│                                 │
│  Emoji (opcional):              │
│  [🥛] [Elegir emoji...]        │
│                                 │
│  Categoría:                     │
│  ○ 🥦 Frutas y Verduras        │
│  ○ 🥩 Carnes y Aves            │
│  ● 🧀 Lácteos y Huevos         │  ← seleccionado
│  ...                            │
│                                 │
│  ☑️ Añadir a lista de compra   │  ← checkbox
│                                 │
│  [  Cancelar  ] [ ✅ Guardar  ]│
└─────────────────────────────────┘
```

- El nombre viene pre-rellenado con el texto del buscador
- Categoría: lista de radio buttons con emoji + nombre
- Emoji: campo de texto libre donde el usuario escribe/pega un emoji
- Checkbox "Añadir a lista de compra": si marcado, `enLista: true` desde el principio
- Validación: nombre no vacío (mínimo 2 caracteres)
- Al guardar: se cierra el modal, el item aparece en la lista, el buscador se limpia

---

## Comportamientos y Flujos

### Flujo: Añadir un nuevo producto
1. Usuario escribe "leche entera" en el buscador
2. No hay coincidencias → aparece botón `+ Añadir "leche entera"`
3. Usuario pulsa el botón
4. Se abre el modal con nombre pre-rellenado
5. Usuario elige categoría "Lácteos y Huevos", pone emoji "🥛"
6. Marca "Añadir a lista de compra"
7. Pulsa "Guardar"
8. El item aparece en la lista bajo "Lácteos y Huevos"
9. El buscador se limpia

### Flujo: Marcar producto como "me falta"
1. Usuario ve "Leche entera" en la lista
2. Pulsa el toggle → se act