# Spec 05 — Pantalla Recetas

## Descripción
Pantalla donde el usuario puede descubrir recetas de internet (TheMealDB) y gestionar sus propias recetas creadas manualmente.

## Ruta
`/recetas`

---

## Layout General

```
┌─────────────────────────────────┐
│  🍳 Recetas          [+ Nueva]  │  ← Header
├─────────────────────────────────┤
│  [Descubrir]  [Mis Recetas]     │  ← Tabs internos
├─────────────────────────────────┤
│  (contenido del tab activo)     │
├─────────────────────────────────┤
│  🛍️ Lista  🛒 Compra  🍳 Recetas│
└─────────────────────────────────┘
```

---

## Tab 1: Descubrir (TheMealDB)

### Descripción
Busca recetas en la API gratuita de TheMealDB. El usuario puede buscar por nombre o por ingrediente.

### Componentes

#### Buscador de recetas
- Input: "Buscar receta o ingrediente..."
- Al escribir (con debounce 500ms): llama a TheMealDB API
- Endpoints a usar:
  - Buscar por nombre: `https://www.themealdb.com/api/json/v1/1/search.php?s={nombre}`
  - Buscar por ingrediente: `https://www.themealdb.com/api/json/v1/1/filter.php?i={ingrediente}`
- Si el campo está vacío: muestra recetas aleatorias (`/random.php` x5 llamadas) o las últimas guardadas

#### Tarjeta de receta (`RecetaCard.jsx`)
```
┌─────────────────────────────────┐
│  [  Foto de la receta       ]   │
│  Chicken Tikka Masala           │
│  🏷️ Chicken  ⏱️ --min           │
│              [💾 Guardar]       │
└─────────────────────────────────┘
```
- Foto: imagen de TheMealDB (strMealThumb)
- Nombre de la receta
- Categoría de TheMealDB
- Botón "Guardar": guarda la receta localmente (llama a `guardarRecetaMealDB()`)
- Si ya está guardada: botón cambia a "✓ Guardada" (verde)
- Tap en la tarjeta: abre vista detalle

#### Vista detalle de receta TheMealDB (`RecetaDetalle.jsx`)
- Foto grande en la cabecera
- Nombre + categoría
- Lista de ingredientes con cantidades
- Pasos (instrucciones del campo `strInstructions`, divididas por párrafos)
- Botón "Guardar receta" o "✓ Guardada"
- Botón "Ver en YouTube" si existe `strYoutube`
- Botón atrás ←

#### Estados de carga y error
- Cargando: skeleton cards (efecto shimmer)
- Sin conexión: "Sin conexión. Solo puedes ver tus recetas guardadas."
- Sin resultados: "No encontramos recetas con ese nombre. Prueba otro término."
- Error API: "Error al cargar. Inténtalo de nuevo." + botón reintentar

---

## Tab 2: Mis Recetas

### Descripción
Muestra las recetas propias del usuario + las recetas de TheMealDB que haya guardado.

### Componentes

#### Lista de recetas guardadas
- Grid de 2 columnas en móvil
- Tarjetas con foto (o placeholder si no hay) + nombre + badge "Propia" / "MealDB"
- Tap en tarjeta: abre vista detalle
- Long press o swipe: opción de eliminar (con confirmación)

#### Estado vacío
- Emoji grande: 👨‍🍳
- Texto: "Aún no tienes recetas guardadas"
- Subtexto: "Crea tu primera receta o guarda alguna de 'Descubrir'"
- Botón: "➕ Crear receta"

---

## Formulario: Crear / Editar Receta (`FormReceta.jsx`)

Se abre como pantalla completa (no modal) al pulsar "+ Nueva" en el header o "Crear receta" en estado vacío.

### Ruta: `/recetas/nueva` y `/recetas/editar/:id`

### Campos del formulario

#### Foto (opcional)
```
┌─────────────────────────────────┐
│                                 │
│   [📷 Añadir foto]              │
│   Toca para añadir una foto     │
│                                 │
└─────────────────────────────────┘
```
- Al tocar: abre selector nativo del dispositivo (cámara o galería)
- Input tipo `file` con `accept="image/*"` y `capture="environment"`
- La imagen se convierte a base64 y se guarda en el modelo
- Si hay foto: se muestra como preview, con botón ✕ para eliminarla
- Compresión: antes de guardar, redimensionar a máx 800px y calidad 80% (usando Canvas API)

#### Nombre (obligatorio)
- Input de texto
- Placeholder: "Ej: Tortilla de patatas"
- Validación: mínimo 3 caracteres

#### Ingredientes (obligatorio, mínimo 1)
- Lista dinámica de filas: `[cantidad] [nombre ingrediente] [🗑️]`
- Botón "+ Añadir ingrediente" al final
- Cada fila tiene dos inputs: cantidad (opcional, ej: "2 cucharadas") + nombre (ej: "aceite de oliva")
- Se puede reordenar (drag) — nice to have, no bloqueante

#### Pasos / Instrucciones (obligatorio, mínimo 1)
- Lista dinámica de áreas de texto numeradas automáticamente
- Placeholder: "Paso 1: Pela y corta las patatas..."
- Botón "+ Añadir paso" al final
- Cada paso tiene botón 🗑️ para eliminar

#### Tiempo (opcional)
- Input numérico + label "minutos"
- Placeholder: "45"

### Acciones del formulario
- **Guardar**: valida, llama a `addReceta()` o `updateReceta()`, navega a `/recetas`
- **Cancelar**: vuelve atrás con confirmación si hay cambios sin guardar

---

## Notas de implementación
- TheMealDB tiene un límite generoso en su plan gratuito (sin auth necesaria)
- Las imágenes de TheMealDB se cargan directamente desde su CDN (no se cachean localmente salvo que se guarde la receta)
- Para recetas guardadas de TheMealDB, guardar la URL de la foto (no descargarla en base64) para ahorrar localStorage
- Las recetas propias con foto pueden ocupar mucho espacio: comprimir imágenes antes de guardar