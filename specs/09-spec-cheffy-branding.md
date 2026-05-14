# Spec 09 — Branding Cheffy + Mejoras UX Lista

## Cambios incluidos

---

## Cambio 1: Logo y nombre de la app → "Cheffy"

### Archivos afectados
- `public/index.html` — `<title>` y meta tags
- `vite.config.js` — manifest de PWA (name, short_name)
- El logo `public/icons/logo-cheffy.png` se usa como icono PWA

### Comportamiento esperado
- Nombre de la app: **Cheffy** (en título, manifest, apple-meta-tags)
- Icono PWA: `logo-cheffy.png` (tanto 192 como 512 — mismo archivo, el navegador lo escala)
- Favicon: también `logo-cheffy.png`

---

## Cambio 2: Filtros (chips) se ocultan al hacer scroll hacia abajo

### Pantalla afectada
`src/pages/Lista.jsx`

### Comportamiento esperado
- Los chips [Todos] [Me falta] [Tengo] son visibles al inicio
- Cuando el usuario hace **scroll hacia abajo** en la lista → los chips se ocultan con animación suave (translate hacia arriba + fade out)
- Cuando el usuario hace **scroll hacia arriba** (aunque sea un poco) → los chips vuelven a aparecer con animación suave
- La barra de búsqueda permanece siempre visible (sticky)
- Implementación: hook `useScrollDirection` que detecta la dirección del scroll en el contenedor de la lista

---

## Cambio 3: Categorías cerradas por defecto

### Pantalla afectada
`src/pages/Lista.jsx` — componente `CategoriaGroup`

### Comportamiento esperado
- **Antes**: `const [expanded, setExpanded] = useState(true)` → todas abiertas
- **Después**: `const [expanded, setExpanded] = useState(false)` → todas cerradas al cargar
- El usuario puede expandir/colapsar cada categoría manualmente como antes
- Excepción: si hay búsqueda activa, las categorías con resultados se abren automáticamente

---

## Archivos afectados
- `index.html`
- `vite.config.js`
- `src/pages/Lista.jsx`