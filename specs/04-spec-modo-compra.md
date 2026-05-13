# Spec 04 — Pantalla Modo Compra

## Descripción
Vista optimizada para usar en el supermercado. Muestra únicamente los productos marcados como "me falta" y permite tacharlos conforme se van cogiendo del estante. Al terminar, un botón confirma la compra y actualiza el estado de todos los productos tachados.

## Ruta
`/compra`

---

## Layout General

```
┌─────────────────────────────────┐
│  🛒 Modo Compra     [0/5]       │  ← Header fijo con contador
├─────────────────────────────────┤
│                                 │
│  🥦 Frutas y Verduras           │  ← Grupo categoría (sin colapsar)
│  ┌───────────────────────────┐  │
│  │ 🍎 Manzanas               │  │  ← Item normal
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ ~~🥕 Zanahorias~~    ✓   │  │  ← Item tachado
│  └───────────────────────────┘  │
│                                 │
│  🧀 Lácteos y Huevos            │
│  ┌───────────────────────────┐  │
│  │ 🥛 Leche entera           │  │
│  └───────────────────────────┘  │
│                                 │
│        ···                      │
│                                 │
├─────────────────────────────────┤
│  [  🏁 Ya he comprado (2)  ]    │  ← Botón flotante (visible si hay tachados)
├─────────────────────────────────┤
│  🛍️ Lista  🛒 Compra  🍳 Recetas│
└─────────────────────────────────┘
```

---

## Componentes

### 1. Header
- **Título**: "Modo Compra" con icono 🛒
- **Contador** (derecha): `X/Y` donde X = tachados, Y = total a comprar
- El contador se actualiza en tiempo real al tachar items

### 2. Lista de items a comprar (`ItemCompra.jsx`)
- Solo muestra items con `enLista: true`
- Agrupados por categoría (mismo orden que en Lista principal)
- Los grupos de categoría **no son colapsables** en este modo (más sencillo para comprar)
- Cada item ocupa una fila grande y táctil (mínimo 56px de altura)

#### Estado Normal (sin tachar):
```
┌─────────────────────────────────────┐
│  🍎  Manzanas                       │
└─────────────────────────────────────┘
```
- Fondo blanco, texto normal
- Toda la fila es pulsable (no solo un botón)

#### Estado Tachado:
```
┌─────────────────────────────────────┐
│  🍎  ~~Manzanas~~              ✓   │
└─────────────────────────────────────┘
```
- Fondo verde muy suave (`#F0FDF4`)
- Texto tachado con `line-through`, color gris
- Icono ✓ verde a la derecha
- Animación: suave transición de color + aparición del tachado

#### Interacción:
- **Tap en item normal** → se tacha (añade a `shoppingSession.itemsTachados`)
- **Tap en item tachado** → se destaca (quita de `itemsTachados`)
- No hay swipe, no hay modal, todo es un simple tap

### 3. Barra de progreso (opcional, visual)
- Barra delgada debajo del header
- Progreso: `tachados / total` como porcentaje
- Color `primary` (verde oliva)

### 4. Botón "Ya he comprado" (`ConfirmarCompraButton.jsx`)
- **Visible solo** cuando hay al menos 1 item tachado
- Posición: fijo en la parte inferior, encima del BottomNav
- Texto: `🏁 Ya he comprado (N)` donde N es el número de tachados
- Color: fondo `primary` (verde oscuro), texto blanco
- Sombra pronunciada para que resalte sobre el contenido
- Al pulsar:
  1. Llama a `confirmarCompra()` en el store
  2. Los items tachados pasan a `enLista: false, tengo: true`
  3. `shoppingSession.itemsTachados` se vacía
  4. Animación de éxito (breve toast: "✅ ¡Compra completada!")
  5. Si ya no quedan items en la lista → mostrar pantalla vacía

### 5. Pantalla vacía (estado "sin nada que comprar")
- Se muestra cuando no hay items con `enLista: true`
- Ilustración/emoji grande centrado: 🎉
- Texto principal: "¡Todo en orden!"
- Subtexto: "No tienes nada pendiente de comprar. Ve a tu lista para marcar lo que te falta."
- Botón: "Ir a mi lista →" (navega a `/`)

---

## Comportamientos y Flujos

### Flujo principal: Ir al supermercado
1. Usuario va a tab "Compra"
2. Ve sus productos pendientes agrupados por categoría
3. Coge las Manzanas del estante → tap → se tachan
4. Coge la Leche → tap → se tacha
5. No encuentra Zanahorias → las deja sin tachar
6. Pulsa "Ya he comprado (2)"
7. Las Manzanas y la Leche pasan a "tengo: true, enLista: false"
8. Las Zanahorias siguen en la lista para la próxima vez
9. Toast de confirmación: "✅ ¡Compra completada!"

### Flujo: Deshacer un tachado accidental
1. Usuario toca Zanahorias por error → se tachan
2. Vuelve a tocar Zanahorias → se destachan
3. Continúa su compra normal

---

## Estados de la Pantalla

| Situación | Lo que se muestra |
|---|---|
| Hay items `enLista: true` | Lista normal de productos a comprar |
| Todos tachados | Lista con todos tachados + botón "Ya he comprado" prominente |
| Sin items `enLista: true` | Pantalla vacía con mensaje + botón ir a Lista |

---

## Notas de implementación
- `shoppingSession.itemsTachados` es estado **en memoria** (no persistido en localStorage)
- Si el usuario abandona la pantalla y vuelve, los tachados se pierden (comportamiento esperado)
- El botón "Ya he comprado" debe tener feedback haptic si el navegador lo soporta (`navigator.vibrate(50)`)