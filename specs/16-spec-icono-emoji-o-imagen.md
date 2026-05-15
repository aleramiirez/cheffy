# Spec 16 — Icono: emoji manual O imagen subida

## Motivación
El emoji picker (emoji-picker-react) ocupa 300KB y solo tiene los emojis del sistema operativo.
El usuario quiere poder usar emojis de internet (PNG sin fondo) como iconos personalizados.

## Solución
Reemplazar EmojiPickerField por un nuevo componente IconField con 2 tabs:

### Tab "Emoji"
- Input de texto simple donde el usuario pega/escribe un emoji
- El usuario puede buscar "emoji fuet png" en Google, copiar el emoji y pegarlo aquí

### Tab "Imagen"
- Input file que abre galería/cámara
- La imagen se comprime (max 200x200px, quality 80%)
- Si hay Supabase configurado: se sube a Storage → se guarda URL
- Si no hay Supabase: se guarda como base64 comprimido

## Visualización en la lista
- Si tiene emoji → muestra el emoji (texto)
- Si tiene iconUrl → muestra la imagen como cuadrado redondeado 32x32px

## Cambios
- Reemplazar `src/components/common/EmojiPickerField.jsx` → `IconField.jsx`
- Actualizar `src/pages/Lista.jsx` y `src/pages/FormPlato.jsx`
- Desinstalar `emoji-picker-react`