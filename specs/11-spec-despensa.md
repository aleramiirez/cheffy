# Spec 11 — Despensa como sección independiente

## Motivación
La despensa debe reflejar únicamente lo que el usuario **tiene físicamente en casa**, no lo que tiene en la lista. Actualmente el filtro "Tengo" en Lista es confuso e insuficiente. Se reemplaza por una sección completa.

---

## Cambio 1: Lógica de `tengo` corregida

### Antes (incorrecto)
- Tener un item en la lista sin marcar para comprar no significa tenerlo en casa.
- El campo `tengo` podía estar a `true` sin haber pasado por el proceso de compra.

### Después (correcto)
- `tengo: true` **solo** se activa cuando el usuario confirma la compra (botón "Ya he comprado").
- Al crear un item nuevo, siempre empieza con `tengo: false` y `enLista: false`.
- Los items iniciales (`initialItems.js`) también empiezan con `tengo: false`.
- La despensa parte vacía y se llena orgánicamente con cada compra confirmada.

---

## Cambio 2: Nueva página "Despensa" (4ª tab)

### Navegación actualizada
| Tab | Icono | Ruta | Label |
|---|---|---|---|
| Lista | 🛍️ | `/` | Lista |
| Compra | 🛒 | `/compra` | Compra |
| Despensa | 🏠 | `/despensa` | Despensa |
| Recetas | 🍳 | `/recetas` | Recetas |

### Layout de la página Despensa (`/despensa`)

```
┌─────────────────────────────────┐
│  🔍 Buscar en despensa...       │  ← Buscador
├─────────────────────────────────┤
│  🥦 Frutas y Verduras (2)  ▶   │  ← Grupos colapsables (cerrados por defecto)
│  🥩 Carnes y Aves (1)      ▶   │
│  🧀 Lácteos (3)            ▶   │
│                                 │
│  (estado vacío si no hay nada)  │
└─────────────────────────────────┘
```

### Item en Despensa (`ItemDespensa`)
```
┌──────────────────────────────────────┐
│  🥛  Leche entera                    │  ← Solo emoji + nombre
└──────────────────────────────────────┘
```
- **Swipe izquierda**: revela botón rojo 🗑️ "Quitar"
- Al quitar: `tengo: false` (el item sigue en la lista pero ya no está en despensa)
- NO se elimina el item de la app, solo se marca como "no tengo"

### Estado vacío
```
┌─────────────────────────────────┐
│         🏠                      │
│   Tu despensa está vacía        │
│   Los productos que compres     │
│   aparecerán aquí               │
└─────────────────────────────────┘
```

---

## Cambio 3: Quitar filtro "Tengo" de Lista

- En la pantalla Lista, el chip `[Tengo]` se elimina
- Solo quedan: `[Todos]` y `[Me falta]`
- La información de "lo que tengo" ahora vive en la página Despensa

---

## Archivos afectados
- `src/App.jsx` — nueva ruta `/despensa`
- `src/components/layout/BottomNav.jsx` — añadir tab Despensa
- `src/pages/Despensa.jsx` — nueva página (crear)
- `src/pages/Lista.jsx` — quitar chip "Tengo"