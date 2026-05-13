# Spec 01 — Visión General del Proyecto

## Nombre de la App
**Mi Cocina** 🍽️

## Descripción
Aplicación web progresiva (PWA) mobile-first que permite al usuario:
1. Gestionar su lista de la compra de forma intuitiva
2. Llevar el control de lo que tiene y lo que le falta
3. Descubrir y guardar recetas según los ingredientes disponibles

## Objetivos Principales
- Ser **gratuita** al 100% (sin backend propio, sin servicios de pago)
- Funcionar **instalada en el móvil** como si fuera una app nativa (PWA)
- Ser **extremadamente usable con una sola mano** en móvil
- **Persistir datos localmente** (localStorage) sin necesidad de cuenta ni login
- Funcionar con **conexión limitada o sin ella** (offline para datos propios)

## Restricciones
| Restricción | Decisión |
|---|---|
| Sin backend propio | Todo en localStorage vía Zustand |
| Sin coste | Solo APIs gratuitas (TheMealDB) |
| Sin cuenta de usuario | Datos en el dispositivo |
| Mobile-first | UI diseñada para 390px mínimo |

---

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| React | 18.x | UI declarativa |
| Vite | 5.x | Bundler + dev server |
| Tailwind CSS | 3.x | Estilos utility-first mobile-first |
| Zustand | 4.x | Estado global simple con persistencia |
| react-router-dom | 6.x | Navegación entre pantallas |
| vite-plugin-pwa | latest | Service worker + manifest PWA |
| TheMealDB API | v1 (free) | Recetas externas sin registro |

### Dependencias de desarrollo
- `autoprefixer` — compatibilidad CSS cross-browser
- `postcss` — procesado de CSS

---

## Arquitectura de la Aplicación

```
PWA Shell (index.html + service worker)
    └── React App (App.jsx)
          ├── Router (react-router-dom)
          │     ├── / → Pantalla Lista (Despensa)
          │     ├── /compra → Modo Compra
          │     └── /recetas → Recetas
          │
          └── Zustand Store (useStore.js)
                └── localStorage (persistencia automática)
```

### Flujo de datos
- **Un único store global** (Zustand) con persistencia automática en `localStorage`
- Todos los componentes leen y escriben en el store
- No hay llamadas a API excepto en la pantalla de Recetas (TheMealDB)
- Las fotos de recetas propias se guardan como **base64** en localStorage

---

## Concepto de Diseño

### Filosofía
Diseño **elegante y cálido**, inspirado en cookbooks modernos y apps de cocina premium. Limpio, con espacio en blanco, sin recargarse.

### Paleta de Colores
| Token | Color | Hex | Uso |
|---|---|---|---|
| `primary` | Verde oliva oscuro | `#2D5016` | Headers, botones principales, acentos |
| `primary-light` | Verde oliva suave | `#4A7C28` | Hover states |
| `accent` | Dorado cálido | `#C9A84C` | Badges, highlights, CTA secundarios |
| `bg-main` | Crema blanco | `#FAFAF7` | Fondo principal |
| `bg-card` | Blanco puro | `#FFFFFF` | Tarjetas, modales |
| `text-main` | Gris oscuro | `#1C1C1E` | Texto principal |
| `text-muted` | Gris medio | `#6B7280` | Texto secundario, placeholders |
| `border` | Gris claro | `#E5E7EB` | Bordes sutiles |
| `danger` | Rojo suave | `#EF4444` | Eliminar, alertas |
| `success` | Verde éxito | `#22C55E` | Confirmaciones |

### Tipografía
- **Font**: `Inter` (Google Fonts, gratuita)
- **Tamaños base**: 14px (móvil) → 16px (tablet+)
- **Pesos**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Componentes Base
- **Bordes redondeados**: `rounded-xl` (12px) para tarjetas, `rounded-full` para pills/badges
- **Sombras**: `shadow-sm` para cards flotantes, `shadow-md` para modales
- **Animaciones**: transiciones suaves de 150-200ms (`transition-all duration-200`)
- **Touch targets**: mínimo 44px de altura para todos los elementos interactivos

---

## Navegación

### Barra de navegación inferior (BottomNav)
Siempre visible en la parte inferior de la pantalla.

| Tab | Icono | Ruta | Label |
|---|---|---|---|
| Lista | 🛍️ | `/` | Lista |
| Compra | 🛒 | `/compra` | Compra |
| Recetas | 🍳 | `/recetas` | Recetas |

- Tab activo: color `primary`, fondo con pill redondeado
- Tab inactivo: color `text-muted`
- Badge numérico en "Compra" mostrando cuántos items faltan

### Header por pantalla
Cada pantalla tiene su propio header con:
- Título de la pantalla
- Acciones contextuales (si aplica) en la parte derecha

---

## Estructura de Archivos

```
mi-cocina/
├── specs/                          # 📋 Especificaciones SDD (este directorio)
│   ├── 01-overview.md
│   ├── 02-data-models.md
│   ├── 03-spec-despensa.md
│   ├── 04-spec-modo-compra.md
│   ├── 05-spec-recetas.md
│   └── 06-spec-pwa.md
│
├── public/
│   ├── manifest.json               # PWA config
│   └── icons/                      # Iconos PWA (192x192, 512x512)
│
├── src/
│   ├── main.jsx                    # Punto de entrada
│   ├── App.jsx                     # Router principal
│   │
│   ├── store/
│   │   └── useStore.js             # Zustand store global
│   │
│   ├── pages/
│   │   ├── Lista.jsx               # Pantalla principal
│   │   ├── ModoCompra.jsx          # Pantalla de compra
│   │   └── Recetas.jsx             # Pantalla de recetas
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BottomNav.jsx
│   │   │   └── Header.jsx
│   │   ├── lista/
│   │   │   ├── Buscador.jsx
│   │   │