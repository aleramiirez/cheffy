# Índice de Specs — Mi Cocina App

Este directorio contiene las especificaciones técnicas completas del proyecto, siguiendo la metodología **Spec Driven Development (SDD)**.

## Archivos de Specs

| # | Archivo | Descripción | Estado |
|---|---|---|---|
| 01 | [01-overview.md](./01-overview.md) | Visión general, stack tecnológico, diseño, arquitectura | ✅ Completo |
| 02 | [02-data-models.md](./02-data-models.md) | Modelos de datos, store de Zustand, categorías | ✅ Completo |
| 03 | [03-spec-lista.md](./03-spec-lista.md) | Pantalla Lista: buscador, añadir items, toggles | ✅ Completo |
| 04 | [04-spec-modo-compra.md](./04-spec-modo-compra.md) | Modo Compra: tachar items, confirmar compra | ✅ Completo |
| 05 | [05-spec-recetas.md](./05-spec-recetas.md) | Recetas: TheMealDB + recetas propias con foto | ✅ Completo |
| 06 | [06-spec-pwa.md](./06-spec-pwa.md) | PWA: manifest, service worker, instalación móvil | ✅ Completo |

---

## Resumen del Proyecto

**App**: Mi Cocina 🍽️  
**Tipo**: Progressive Web App (PWA) — instalable en móvil, sin coste  
**Stack**: React 18 + Vite 5 + Tailwind CSS 3 + Zustand 4 + vite-plugin-pwa  
**Datos**: 100% localStorage (sin backend, sin cuenta de usuario)

### Las 3 pantallas

| Pantalla | Ruta | Función |
|---|---|---|
| Lista | `/` | Gestionar todos los productos, buscar, marcar "me falta" |
| Modo Compra | `/compra` | Ver solo lo que falta, tachar al coger, confirmar compra |
| Recetas | `/recetas` | Descubrir recetas (TheMealDB) y crear las propias |

### Decisiones clave de diseño
- Diseño **elegante y cálido**: verde oliva + dorado + fondo crema
- **Mobile-first**: toda la UI pensada para pantalla de 390px
- **Sin cuenta**: todos los datos persisten en localStorage del dispositivo
- **Offline-first**: Lista y Compra funcionan sin conexión; Recetas de internet requieren red
