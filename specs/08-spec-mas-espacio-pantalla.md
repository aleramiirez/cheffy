# Spec 08 — Más espacio útil en pantalla

## Objetivo
Maximizar el espacio de contenido eliminando elementos de UI redundantes y reduciendo el tamaño de los controles de búsqueda.

---

## Cambio 1: Eliminar el Header de las 3 pantallas principales

### Motivación
El Header (título + emoji) ocupa ~56px de altura en la parte superior de cada pantalla.
Como ya existe el BottomNav que indica claramente en qué sección se está,
el header es información redundante que consume espacio valioso en móvil.

### Comportamiento esperado
- Eliminar el componente `<Header>` de: `Lista.jsx`, `ModoCompra.jsx` y `Recetas.jsx`
- Las acciones contextuales que estaban en el header (ej: contador "X pendientes", botón "+ Nueva" en Recetas, contador "X/Y" en Compra) se reubican:
  - En Lista: el contador "X pendientes" desaparece (ya está en el badge del BottomNav)
  - En ModoCompra: el contador "X/Y" se mueve a la barra de progreso (texto inline)
  - En Recetas: el botón "+ Nueva" se convierte en FAB (botón flotante) igual que en Lista
- `FormReceta.jsx` mantiene su header propio (es necesario para navegar atrás)

---

## Cambio 2: Barra de búsqueda más compacta (solo en Lista)

### Motivación
El input de búsqueda actual tiene padding generoso (`py-3`), adecuado para formularios
pero excesivo para una barra de búsqueda de uso rápido.

### Comportamiento esperado
- Reducir el padding vertical del input de búsqueda: `py-3` → `py-2`
- Reducir el tamaño de fuente: `text-base` → `text-sm`
- El icono de lupa se mantiene pero ligeramente más pequeño
- El espacio entre la barra de búsqueda y los chips de filtro se reduce un poco
- La barra sigue siendo sticky (pegada arriba al hacer scroll)

---

## Archivos afectados
- `src/pages/Lista.jsx` — eliminar Header, barra más compacta
- `src/pages/ModoCompra.jsx` — eliminar Header, mover contador a barra de progreso
- `src/pages/Recetas.jsx` — eliminar Header, botón Nueva como FAB