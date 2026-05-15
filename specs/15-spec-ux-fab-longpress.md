# Spec 15 — Mejoras UX: FAB con SVG + Long Press → Bottom Sheet

## Cambio 1: FAB con icono SVG
- Reemplazar emoji `➕` por icono SVG `+` limpio en todos los FABs
- Aplica a: Lista, Recetas, MisPlatos

## Cambio 2: Long Press en items de Lista (reemplaza swipe)
- Eliminar la lógica de swipe (TouchStart/Move/End)
- Mantener pulsado 500ms → se abre un bottom sheet con:
  - Nombre del item en la cabecera
  - Botón "✏️ Editar"
  - Botón "🗑️ Eliminar"
  - Botón "✕ Cancelar"
- Tocar fuera del bottom sheet lo cierra
- El scroll normal no activa el long press

## Archivos afectados
- `src/pages/Lista.jsx` — ItemRow + FAB
- `src/pages/Recetas.jsx` — FAB Nueva Receta
- `src/pages/MisPlatos.jsx` — FAB Nuevo Plato