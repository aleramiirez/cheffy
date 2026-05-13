# Spec 07 — Mejoras UX en la Pantalla Lista

## Cambios incluidos
Cuatro mejoras de experiencia de usuario en la pantalla principal (Lista).

---

## Cambio 1: Ocultar texto de subcategoría en cada item
- **Antes**: cada fila mostraba emoji + nombre + categoría en gris debajo
- **Después**: cada fila muestra solo emoji + nombre + toggle (más limpio)
- La categoría sigue visible en el header del grupo colapsable

## Cambio 2: Editar un producto existente
- Al hacer **swipe izquierda** en un item aparecen dos acciones: ✏️ Editar y 🗑️ Eliminar
- Al pulsar ✏️ Editar → se abre el modal con los datos actuales del producto
- Se puede modificar: nombre, emoji y categoría
- Al guardar → el producto se actualiza en la lista

## Cambio 3: Eliminar con swipe (sustituye la papelera con hover)
- Swipe izquierda revela fondo rojo con 🗑️ Eliminar (y ✏️ Editar en verde)
- Si el usuario suelta antes del 50% del ancho → rebota y vuelve
- Si el usuario pulsa el botón 🗑️ → elimina con Toast "Producto eliminado"
- Eliminar la lógica anterior de papelera con hover (no funciona en móvil)

## Cambio 4: Fix BottomNav siempre visible
- La navbar inferior debe estar fija en todo momento, independientemente del scroll
- El área de productos debe tener scroll contenido entre header y navbar
- Fix en App.jsx: asegurar que `h-screen` y `overflow-hidden` se aplican correctamente
- Compatibilidad con iOS Safari (safe area insets)

---

## Archivos afectados
- `src/pages/Lista.jsx` — cambios 1, 2 y 3
- `src/App.jsx` — cambio 4 (fix layout)