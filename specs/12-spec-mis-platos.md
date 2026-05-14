# Spec 12 — Mis Platos: platos personales con ingredientes de la despensa

## Concepto
Sección dentro de Recetas donde el usuario define sus platos habituales
vinculando ingredientes de su lista. La app muestra qué puede cocinar ahora
mismo según lo que tiene en la despensa.

---

## Modelo de datos: `Plato`
```typescript
interface Plato {
  id: string
  nombre: string           // "Espaguetti carbonara"
  emoji: string            // "🍝"
  ingredienteIds: string[] // IDs de items del store
  creadoEn: number
}
```

## Lógica de disponibilidad
- ✅ Puedo hacerlo → TODOS los ingredienteIds tienen tengo:true
- ⚠️ Casi → 1-2 ingredientes sin tengo:true
- ❌ Faltan ingredientes → 3+ ingredientes sin tengo:true

## Pantalla "Mis Platos" (tab en Recetas)
- Secciones: ✅ Puedo hacerlo / ⚠️ Casi / ❌ Faltan ingredientes
- Cada plato: emoji + nombre + ingredientes faltantes
- Botón discreto "Añadir X a la lista" para ingredientes faltantes
- FAB ➕ para crear nuevo plato
- Estado vacío si no hay platos

## Formulario añadir/editar plato
- Nombre + emoji
- Selección de ingredientes: buscador con checkboxes desde los items del store
- Ruta: pantalla completa (no modal)

## Archivos
- `specs/12-spec-mis-platos.md`
- `src/store/useStore.js` — añadir platos[] + addPlato, removePlato, updatePlato
- `src/pages/MisPlatos.jsx` — nueva página
- `src/pages/FormPlato.jsx` — formulario crear/editar
- `src/App.jsx` — rutas /platos/nuevo y /platos/editar/:id
- `src/pages/Recetas.jsx` — añadir 3er tab "Mis Platos"