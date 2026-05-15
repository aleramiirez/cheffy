import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

// Categorías predefinidas (orden de supermercado)
export const CATEGORIES = [
  { id: 'frutas-verduras', nombre: 'Frutas y Verduras', emoji: '🥦', orden: 1 },
  { id: 'carnes', nombre: 'Carnes y Aves', emoji: '🥩', orden: 2 },
  { id: 'pescados', nombre: 'Pescados y Mariscos', emoji: '🐟', orden: 3 },
  { id: 'lacteos', nombre: 'Lácteos y Huevos', emoji: '🧀', orden: 4 },
  { id: 'panaderia', nombre: 'Panadería y Cereales', emoji: '🍞', orden: 5 },
  { id: 'despensa', nombre: 'Despensa y Conservas', emoji: '🫙', orden: 6 },
  { id: 'congelados', nombre: 'Congelados', emoji: '❄️', orden: 7 },
  { id: 'bebidas', nombre: 'Bebidas', emoji: '🥤', orden: 8 },
  { id: 'limpieza', nombre: 'Limpieza del Hogar', emoji: '🧹', orden: 9 },
  { id: 'higiene', nombre: 'Higiene y Cuidado Personal', emoji: '🧴', orden: 10 },
  { id: 'otros', nombre: 'Otros', emoji: '📦', orden: 11 },
]

// Helper: convertir fila de Supabase → item local
function dbRowToItem(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    categoriaId: row.categoria_id,
    emoji: row.emoji || '📦',
    iconUrl: row.icon_url || null,
    enLista: row.en_lista,
    tengo: row.tengo,
    creadoEn: new Date(row.created_at).getTime(),
  }
}

function dbRowToReceta(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    fuente: row.fuente || 'propia',
    ingredientes: row.ingredientes || [],
    pasos: row.pasos || [],
    foto: row.foto || null,
    categoriaReceta: row.categoria_receta || '',
    youtube: row.youtube || '',
    guardada: true,
    creadoEn: new Date(row.created_at).getTime(),
  }
}

function dbRowToPlato(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    emoji: row.emoji || '🍽️',
    iconUrl: row.icon_url || null,
    ingredienteIds: row.ingrediente_ids || [],
    creadoEn: new Date(row.created_at).getTime(),
  }
}

const useStore = create(
  persist(
    (set, get) => ({
      items: [],
      recipes: [],
      platos: [],
      itemsTachados: [],

      // ─── Cargar datos desde Supabase ─────────────────────────────────────
      loadFromSupabase: async (userId) => {
        const [itemsRes, recipesRes, platosRes] = await Promise.all([
          supabase.from('items').select('*').eq('user_id', userId).order('created_at'),
          supabase.from('recipes').select('*').eq('user_id', userId).order('created_at'),
          supabase.from('platos').select('*').eq('user_id', userId).order('created_at'),
        ])
        set({
          items: (itemsRes.data || []).map(dbRowToItem),
          recipes: (recipesRes.data || []).map(dbRowToReceta),
          platos: (platosRes.data || []).map(dbRowToPlato),
        })
      },

      // ─── Items ──────────────────────────────────────────────────────────
      addItem: async (nombre, categoriaId, emoji = '📦', userId = null) => {
        const newItem = {
          id: crypto.randomUUID(),
          nombre: nombre.trim(),
          categoriaId,
          emoji,
          iconUrl: null,
          enLista: false,
          tengo: false,
          creadoEn: Date.now(),
        }
        set((state) => ({ items: [...state.items, newItem] }))
        if (userId) {
          await supabase.from('items').insert({
            id: newItem.id,
            user_id: userId,
            nombre: newItem.nombre,
            categoria_id: newItem.categoriaId,
            emoji: newItem.emoji,
            en_lista: false,
            tengo: false,
          })
        }
      },

      removeItem: async (id, userId = null) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          itemsTachados: state.itemsTachados.filter((tid) => tid !== id),
        }))
        if (userId) await supabase.from('items').delete().eq('id', id)
      },

      toggleEnLista: async (id, userId = null) => {
        const item = get().items.find((i) => i.id === id)
        if (!item) return
        const newVal = !item.enLista
        set((state) => ({
          items: state.items.map((i) => i.id === id ? { ...i, enLista: newVal } : i),
        }))
        if (userId) await supabase.from('items').update({ en_lista: newVal }).eq('id', id)
      },

      updateItem: async (id, changes, userId = null) => {
        set((state) => ({
          items: state.items.map((item) => item.id === id ? { ...item, ...changes } : item),
        }))
        if (userId) {
          const dbChanges = {}
          if (changes.nombre !== undefined) dbChanges.nombre = changes.nombre
          if (changes.emoji !== undefined) dbChanges.emoji = changes.emoji
          if (changes.iconUrl !== undefined) dbChanges.icon_url = changes.iconUrl
          if (changes.categoriaId !== undefined) dbChanges.categoria_id = changes.categoriaId
          if (changes.enLista !== undefined) dbChanges.en_lista = changes.enLista
          if (changes.tengo !== undefined) dbChanges.tengo = changes.tengo
          if (Object.keys(dbChanges).length > 0) {
            await supabase.from('items').update(dbChanges).eq('id', id)
          }
        }
      },

      // ─── Modo Compra ─────────────────────────────────────────────────────
      toggleTachadoCompra: (id) => {
        const { itemsTachados } = get()
        if (itemsTachados.includes(id)) {
          set((state) => ({ itemsTachados: state.itemsTachados.filter((tid) => tid !== id) }))
        } else {
          set((state) => ({ itemsTachados: [...state.itemsTachados, id] }))
        }
      },

      confirmarCompra: async (userId = null) => {
        const { itemsTachados } = get()
        set((state) => ({
          items: state.items.map((item) =>
            itemsTachados.includes(item.id) ? { ...item, enLista: false, tengo: true } : item
          ),
          itemsTachados: [],
        }))
        if (userId) {
          for (const id of itemsTachados) {
            await supabase.from('items').update({ en_lista: false, tengo: true }).eq('id', id)
          }
        }
      },

      resetSesionCompra: () => set({ itemsTachados: [] }),

      // ─── Recetas ─────────────────────────────────────────────────────────
      addReceta: async (recetaData, userId = null) => {
        const newReceta = { id: crypto.randomUUID(), creadoEn: Date.now(), guardada: true, ...recetaData }
        set((state) => ({ recipes: [...state.recipes, newReceta] }))
        if (userId) {
          await supabase.from('recipes').insert({
            id: newReceta.id, user_id: userId,
            nombre: newReceta.nombre, fuente: newReceta.fuente,
            ingredientes: newReceta.ingredientes, pasos: newReceta.pasos,
            foto: newReceta.foto, categoria_receta: newReceta.categoriaReceta,
            youtube: newReceta.youtube || '',
          })
        }
        return newReceta.id
      },

      removeReceta: async (id, userId = null) => {
        set((state) => ({ recipes: state.recipes.filter((r) => r.id !== id) }))
        if (userId) await supabase.from('recipes').delete().eq('id', id)
      },

      updateReceta: async (id, changes, userId = null) => {
        set((state) => ({ recipes: state.recipes.map((r) => r.id === id ? { ...r, ...changes } : r) }))
        if (userId) await supabase.from('recipes').update(changes).eq('id', id)
      },

      guardarRecetaMealDB: async (recetaMealDB, userId = null) => {
        const exists = get().recipes.find((r) => r.id === recetaMealDB.id)
        if (!exists) {
          const receta = { ...recetaMealDB, guardada: true, creadoEn: Date.now() }
          set((state) => ({ recipes: [...state.recipes, receta] }))
          if (userId) {
            await supabase.from('recipes').insert({
              id: receta.id, user_id: userId,
              nombre: receta.nombre, fuente: 'mealdb',
              ingredientes: receta.ingredientes, pasos: receta.pasos,
              foto: receta.foto, categoria_receta: receta.categoriaReceta,
              youtube: receta.youtube || '',
            })
          }
        }
      },

      isRecetaGuardada: (id) => get().recipes.some((r) => r.id === id),

      // ─── Platos ──────────────────────────────────────────────────────────
      addPlato: async (platoData, userId = null) => {
        const newPlato = { id: crypto.randomUUID(), creadoEn: Date.now(), emoji: '🍽️', ...platoData }
        set((state) => ({ platos: [...state.platos, newPlato] }))
        if (userId) {
          await supabase.from('platos').insert({
            id: newPlato.id, user_id: userId,
            nombre: newPlato.nombre, emoji: newPlato.emoji,
            ingrediente_ids: newPlato.ingredienteIds || [],
          })
        }
        return newPlato.id
      },

      removePlato: async (id, userId = null) => {
        set((state) => ({ platos: state.platos.filter((p) => p.id !== id) }))
        if (userId) await supabase.from('platos').delete().eq('id', id)
      },

      updatePlato: async (id, changes, userId = null) => {
        set((state) => ({ platos: state.platos.map((p) => p.id === id ? { ...p, ...changes } : p) }))
        if (userId) {
          const dbChanges = {}
          if (changes.nombre) dbChanges.nombre = changes.nombre
          if (changes.emoji) dbChanges.emoji = changes.emoji
          if (changes.ingredienteIds) dbChanges.ingrediente_ids = changes.ingredienteIds
          if (Object.keys(dbChanges).length > 0) await supabase.from('platos').update(dbChanges).eq('id', id)
        }
      },
    }),
    {
      name: 'cheffy-storage',
      partialize: (state) => ({
        items: state.items,
        recipes: state.recipes,
        platos: state.platos,
      }),
    }
  )
)

export default useStore
