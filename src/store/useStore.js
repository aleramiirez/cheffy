import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

// userId se inyecta desde App.jsx para evitar circular dependency
let _currentUserId = null
export const setCurrentUserId = (id) => { _currentUserId = id }
const uid = () => _currentUserId

export const CATEGORIES = [
  { id: 'frutas-verduras', nombre: 'Frutas y Verduras', emoji: '🥦', orden: 1 },
  { id: 'carnes', nombre: 'Carnes y Aves', emoji: '🥩', orden: 2 },
  { id: 'pescados', nombre: 'Pescados y Mariscos', emoji: '🐟', orden: 3 },
  { id: 'lacteos', nombre: 'Lácteos y Huevos', emoji: '🧀', orden: 4 },
  { id: 'panaderia', nombre: 'Panadería y Cereales', emoji: '🍞', orden: 5 },
  { id: 'despensa', nombre: 'Despensa y Conservas', emoji: '🫙', orden: 6 },
  { id: 'charcuteria', nombre: 'Charcutería y Embutidos', emoji: '🥓', orden: 7 },
  { id: 'congelados', nombre: 'Congelados', emoji: '❄️', orden: 8 },
  { id: 'dulces', nombre: 'Dulces y Snacks', emoji: '🍫', orden: 9 },
  { id: 'especias', nombre: 'Especias y Condimentos', emoji: '🌶️', orden: 10 },
  { id: 'bebidas', nombre: 'Bebidas', emoji: '🥤', orden: 11 },
  { id: 'limpieza', nombre: 'Limpieza del Hogar', emoji: '🧹', orden: 12 },
  { id: 'higiene', nombre: 'Higiene y Cuidado Personal', emoji: '🧴', orden: 13 },
  { id: 'otros', nombre: 'Otros', emoji: '📦', orden: 14 },
]

function dbRowToItem(row) {
  return {
    id: row.id, nombre: row.nombre, categoriaId: row.categoria_id,
    emoji: row.emoji || '📦', iconUrl: row.icon_url || null,
    enLista: row.en_lista, tengo: row.tengo,
    creadoEn: new Date(row.created_at).getTime(),
  }
}

function dbRowToReceta(row) {
  return {
    id: row.id, nombre: row.nombre, fuente: row.fuente || 'propia',
    ingredientes: row.ingredientes || [], pasos: row.pasos || [],
    foto: row.foto || null, categoriaReceta: row.categoria_receta || '',
    youtube: row.youtube || '', guardada: true,
    creadoEn: new Date(row.created_at).getTime(),
  }
}

function dbRowToPlato(row) {
  return {
    id: row.id, nombre: row.nombre, emoji: row.emoji || '🍽️',
    iconUrl: row.icon_url || null, ingredienteIds: row.ingrediente_ids || [],
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

      loadFromSupabase: async (userId) => {
        if (!userId || !supabase) return
        const [a, b, c] = await Promise.all([
          supabase.from('items').select('*').eq('user_id', userId).order('created_at'),
          supabase.from('recipes').select('*').eq('user_id', userId).order('created_at'),
          supabase.from('platos').select('*').eq('user_id', userId).order('created_at'),
        ])
        set({
          items: (a.data || []).map(dbRowToItem),
          recipes: (b.data || []).map(dbRowToReceta),
          platos: (c.data || []).map(dbRowToPlato),
        })
      },

      addItem: async (nombre, categoriaId, emoji = '📦') => {
        const userId = uid()
        const item = {
          id: crypto.randomUUID(), nombre: nombre.trim(), categoriaId, emoji,
          iconUrl: null, enLista: false, tengo: false, creadoEn: Date.now(),
        }
        set((s) => ({ items: [...s.items, item] }))
        if (userId && supabase) {
          await supabase.from('items').insert({
            id: item.id, user_id: userId, nombre: item.nombre,
            categoria_id: item.categoriaId, emoji: item.emoji, en_lista: false, tengo: false,
          }).then(({ error }) => { if (error) console.error('addItem:', error) })
        }
      },

      addItemFull: async (itemData) => {
        const userId = uid()
        const item = { ...itemData }
        set((s) => ({ items: [...s.items, item] }))
        if (userId && supabase) {
          await supabase.from('items').insert({
            id: item.id, user_id: userId, nombre: item.nombre,
            categoria_id: item.categoriaId, emoji: item.emoji,
            icon_url: item.iconUrl || null,
            en_lista: item.enLista || false, tengo: false,
          }).then(({ error }) => { if (error) console.error('addItemFull:', error) })
        }
      },

      removeItem: async (id) => {
        const userId = uid()
        set((s) => ({
          items: s.items.filter((i) => i.id !== id),
          itemsTachados: s.itemsTachados.filter((t) => t !== id),
        }))
        if (userId && supabase) await supabase.from('items').delete().eq('id', id)
      },

      toggleEnLista: async (id) => {
        const userId = uid()
        const item = get().items.find((i) => i.id === id)
        if (!item) return
        const val = !item.enLista
        set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, enLista: val } : i) }))
        if (userId && supabase) await supabase.from('items').update({ en_lista: val }).eq('id', id)
      },

      updateItem: async (id, changes) => {
        const userId = uid()
        set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, ...changes } : i) }))
        if (userId && supabase) {
          const db = {}
          if (changes.nombre !== undefined) db.nombre = changes.nombre
          if (changes.emoji !== undefined) db.emoji = changes.emoji
          if (changes.iconUrl !== undefined) db.icon_url = changes.iconUrl
          if (changes.categoriaId !== undefined) db.categoria_id = changes.categoriaId
          if (changes.enLista !== undefined) db.en_lista = changes.enLista
          if (changes.tengo !== undefined) db.tengo = changes.tengo
          if (Object.keys(db).length > 0) {
            await supabase.from('items').update(db).eq('id', id)
          }
        }
      },

      toggleTachadoCompra: (id) => {
        const { itemsTachados } = get()
        if (itemsTachados.includes(id)) {
          set((s) => ({ itemsTachados: s.itemsTachados.filter((t) => t !== id) }))
        } else {
          set((s) => ({ itemsTachados: [...s.itemsTachados, id] }))
        }
      },

      confirmarCompra: async () => {
        const userId = uid()
        const { itemsTachados } = get()
        set((s) => ({
          items: s.items.map((i) => itemsTachados.includes(i.id) ? { ...i, enLista: false, tengo: true } : i),
          itemsTachados: [],
        }))
        if (userId && supabase) {
          for (const id of itemsTachados) {
            await supabase.from('items').update({ en_lista: false, tengo: true }).eq('id', id)
          }
        }
      },

      resetSesionCompra: () => set({ itemsTachados: [] }),

      addReceta: async (recetaData) => {
        const userId = uid()
        const r = { id: crypto.randomUUID(), creadoEn: Date.now(), guardada: true, ...recetaData }
        set((s) => ({ recipes: [...s.recipes, r] }))
        if (userId && supabase) {
          await supabase.from('recipes').insert({
            id: r.id, user_id: userId, nombre: r.nombre, fuente: r.fuente,
            ingredientes: r.ingredientes, pasos: r.pasos, foto: r.foto,
            categoria_receta: r.categoriaReceta, youtube: r.youtube || '',
          }).then(({ error }) => { if (error) console.error('addReceta:', error) })
        }
        return r.id
      },

      removeReceta: async (id) => {
        const userId = uid()
        set((s) => ({ recipes: s.recipes.filter((r) => r.id !== id) }))
        if (userId && supabase) await supabase.from('recipes').delete().eq('id', id)
      },

      updateReceta: async (id, changes) => {
        const userId = uid()
        set((s) => ({ recipes: s.recipes.map((r) => r.id === id ? { ...r, ...changes } : r) }))
        if (userId && supabase) await supabase.from('recipes').update(changes).eq('id', id)
      },

      guardarRecetaMealDB: async (recetaMealDB) => {
        const userId = uid()
        const exists = get().recipes.find((r) => r.id === recetaMealDB.id)
        if (!exists) {
          const r = { ...recetaMealDB, guardada: true, creadoEn: Date.now() }
          set((s) => ({ recipes: [...s.recipes, r] }))
          if (userId && supabase) {
            await supabase.from('recipes').insert({
              id: r.id, user_id: userId, nombre: r.nombre, fuente: 'mealdb',
              ingredientes: r.ingredientes, pasos: r.pasos, foto: r.foto,
              categoria_receta: r.categoriaReceta, youtube: r.youtube || '',
            }).then(({ error }) => { if (error) console.error('guardarReceta:', error) })
          }
        }
      },

      isRecetaGuardada: (id) => get().recipes.some((r) => r.id === id),

      addPlato: async (platoData) => {
        const userId = uid()
        const p = { id: crypto.randomUUID(), creadoEn: Date.now(), emoji: '🍽️', ...platoData }
        set((s) => ({ platos: [...s.platos, p] }))
        if (userId && supabase) {
          await supabase.from('platos').insert({
            id: p.id, user_id: userId, nombre: p.nombre,
            emoji: p.emoji, ingrediente_ids: p.ingredienteIds || [],
          }).then(({ error }) => { if (error) console.error('addPlato:', error) })
        }
        return p.id
      },

      removePlato: async (id) => {
        const userId = uid()
        set((s) => ({ platos: s.platos.filter((p) => p.id !== id) }))
        if (userId && supabase) await supabase.from('platos').delete().eq('id', id)
      },

      updatePlato: async (id, changes) => {
        const userId = uid()
        set((s) => ({ platos: s.platos.map((p) => p.id === id ? { ...p, ...changes } : p) }))
        if (userId && supabase) {
          const db = {}
          if (changes.nombre) db.nombre = changes.nombre
          if (changes.emoji) db.emoji = changes.emoji
          if (changes.ingredienteIds) db.ingrediente_ids = changes.ingredienteIds
          if (Object.keys(db).length > 0) await supabase.from('platos').update(db).eq('id', id)
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
