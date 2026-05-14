# Spec 10 — Tema Visual: Warm Cream & Terracota

## Decisión
Tras preview de 4 temas, se selecciona **Warm Cream & Terracota**.

## Paleta de colores definitiva

| Token | Color | Hex |
|---|---|---|
| bg-main | Crema cálido | `#FAF7F2` |
| bg-card | Blanco | `#FFFFFF` |
| primary | Terracota | `#C45C26` |
| primary-light | Terracota claro | `#D97842` |
| accent | Melocotón | `#E8A87C` |
| text-main | Marrón oscuro | `#2C2416` |
| text-muted | Marrón medio | `#8B7355` |
| border | Crema borde | `#E8DFD0` |
| nav-bg | Blanco | `#FFFFFF` |

## Cambios a implementar

1. Actualizar `tailwind.config.js` con los nuevos colores
2. Actualizar `src/index.css` con las nuevas variables CSS por defecto
3. Eliminar `ThemePicker` (componente temporal de preview)
4. Corregir todos los componentes que usen colores hardcodeados de Tailwind
   que no respetan las variables CSS (ej: tabs en Recetas.jsx)

## Archivos afectados
- `tailwind.config.js`
- `src/index.css`
- `src/App.jsx` (quitar ThemePicker)
- `src/pages/Recetas.jsx` (tabs Descubrir/Mis Recetas hardcodeados)
- Revisar otros componentes con colores hardcodeados