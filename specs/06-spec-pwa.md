# Spec 06 — Progressive Web App (PWA)

## Descripción
La app debe funcionar como una PWA instalable en Android e iOS, con soporte básico offline para los datos locales del usuario.

---

## Objetivos
1. Instalable desde el navegador en Android (Chrome) e iOS (Safari)
2. Funcionar offline para las funcionalidades que no requieren red (Lista y Modo Compra)
3. Apariencia de app nativa al instalarse (sin barra de navegador del browser)

---

## Configuración del Manifest (`public/manifest.json`)

```json
{
  "name": "Mi Cocina",
  "short_name": "Mi Cocina",
  "description": "Tu lista de la compra y recetas en un solo lugar",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAFAF7",
  "theme_color": "#2D5016",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

---

## Service Worker (via `vite-plugin-pwa`)

### Estrategia de caché
| Recurso | Estrategia | Descripción |
|---|---|---|
| Assets estáticos (JS, CSS, HTML) | `CacheFirst` | Se sirven desde caché, se actualizan en background |
| Imágenes de TheMealDB | `CacheFirst` con expiración 7 días | Reduce llamadas de red |
| Llamadas a TheMealDB API | `NetworkFirst` | Intenta red primero, caché si falla |

### Comportamiento offline
- ✅ Pantalla Lista: 100% funcional offline (datos en localStorage)
- ✅ Modo Compra: 100% funcional offline
- ✅ Mis Recetas: funcional offline (recetas guardadas en localStorage)
- ❌ Descubrir recetas: requiere conexión (muestra mensaje informativo)

### Configuración en `vite.config.js`
```javascript
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['icons/*.png'],
  manifest: { ... }, // inline o desde public/manifest.json
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/www\.themealdb\.com\/images\/.*/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'mealdb-images',
          expiration: { maxAgeSeconds: 60 * 60 * 24 * 7 }
        }
      },
      {
        urlPattern: /^https:\/\/www\.themealdb\.com\/api\/.*/,
        handler: 'NetworkFirst',
        options: { cacheName: 'mealdb-api' }
      }
    ]
  }
})
```

---

## Iconos de la App

Los iconos se generarán a partir de un icono base. Deben estar en `public/icons/`:

| Archivo | Tamaño | Uso |
|---|---|---|
| `icon-192x192.png` | 192×192px | Android home screen |
| `icon-512x512.png` | 512×512px | Splash screen, Play Store |

### Concepto del icono
- Fondo: verde oliva oscuro `#2D5016`
- Icono: sartén o tenedor+cuchillo en blanco/crema
- Estilo: limpio, minimalista, reconocible a pequeño tamaño

---

## Instalación en dispositivos

### Android (Chrome)
1. Usuario abre la app en Chrome
2. Chrome muestra banner automático "Añadir a pantalla de inicio"
3. O desde menú ⋮ → "Instalar app"
4. La app se instala sin barra de navegador

### iOS (Safari)
1. Usuario abre la app en Safari
2. Pulsa el botón "Compartir" (cajita con flecha)
3. Selecciona "Añadir a pantalla de inicio"
4. La app se instala con el icono definido en el manifest

### Banner de instalación (opcional, in-app)
- Mostrar un banner sutil la primera vez que el usuario visita la app
- "📱 Instala Mi Cocina para usarla sin internet"
- Botón "Instalar" (usa el evento `beforeinstallprompt`)
- Botón "Ahora no" (no vuelve a mostrarse en la sesión)

---

## Actualizaciones

- El service worker usa `registerType: 'autoUpdate'`
- Cuando hay una nueva versión disponible: mostrar un toast discreto
- Toast: "🔄 Hay una nueva versión disponible" + botón "Actualizar"
- Al pulsar "Actualizar": recarga la página (`window.location.reload()`)

---

## Meta tags en `index.html`

```html
<!-- PWA iOS -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Mi Cocina">
<link rel="apple-touch-icon" href="/icons/icon-192x192.png">

<!-- PWA Android / General -->
<meta name="theme-color" content="#2D5016">
<meta name="mobile-web-app-capable" content="yes">
<link rel="manifest" href="/manifest.json">

<!-- Viewport móvil -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

---

## Notas de implementación
- `vite-plugin-pwa` genera el service worker automáticamente en el build
- En desarrollo, el SW está desactivado por defecto (para no interferir con HMR)
- Para probar la PWA localmente: `npm run build && npm run preview`
- El localStorage tiene un límite de ~5-10MB según el navegador; monitorizar uso si se guardan muchas fotos
