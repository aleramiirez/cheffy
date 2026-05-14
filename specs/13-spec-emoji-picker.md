# Spec 13 — Emoji Picker mejorado

## Problema
El campo de emoji actual es un `<input>` de texto libre. Es limitado e intuitivo.

## Solución
Librería `emoji-picker-react` (MIT, offline, ~150KB):
- Picker visual táctil con buscador en múltiples idiomas
- Funciona sin internet (PWA-safe)

## Componente reutilizable: `EmojiPickerField`
- Muestra el emoji actual en un botón grande táctil
- Al tocar → se abre el picker debajo (bottom sheet en móvil)
- Al seleccionar → se cierra y actualiza el emoji
- Props: `value`, `onChange`

## Dónde se usa
- `Lista.jsx` → modal de añadir/editar producto
- `FormPlato.jsx` → formulario de plato

## Archivos
- `src/components/common/EmojiPickerField.jsx` (nuevo)
- `src/pages/Lista.jsx` (reemplazar input emoji)
- `src/pages/FormPlato.jsx` (reemplazar input emoji)