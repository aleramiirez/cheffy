import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

const useStore = create(
  persist(
    (set, get) => ({
      items: [],
      recipes: [],
      itemsTachados: [],

      // Items
      addItem: (nombre, categoriaId, emoji = '📦') => {
        const newItem = {
          id: crypto.randomUUID(),
          nombre: nombre.trim(),
          categoriaId,
          emoji,
          enLista: false,
          tengo: false,
          creadoEn: Date.now(),
        }
        set((state) => ({ items: [...state.items, newItem] }))
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          itemsTachados: state.itemsTachados.filter((tid) => tid !== id),
        }))
      },

      toggleEnLista: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, enLista: !item.enLista } : item
          ),
        }))
      },

      updateItem: (id, changes) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...changes } : item
          ),
        }))
      },

      // Modo Compra
      toggleTachadoCompra: (id) => {
        const { itemsTachados } = get()
        if (itemsTachados.includes(id)) {
          set((state) => ({
            itemsTachados: state.itemsTachados.filter((tid) => tid !== id),
          }))
        } else {
          set((state) => ({
            itemsTachados: [...state.itemsTachados, id],
          }))
        }
      },

      confirmarCompra: () => {
        const { itemsTachados } = get()
        set((state) => ({
          items: state.items.map((item) =>
            itemsTachados.includes(item.id)
              ? { ...item, enLista: false, tengo: true }
              : item
          ),
          itemsTachados: [],
        }))
      },

      resetSesionCompra: () => {
        set({ itemsTachados: [] })
      },

      // Recetas
      addReceta: (recetaData) => {
        const newReceta = {
          id: crypto.randomUUID(),
          creadoEn: Date.now(),
          guardada: true,
          ...recetaData,
        }
        set((state) => ({ recipes: [...state.recipes, newReceta] }))
        return newReceta.id
      },

      removeReceta: (id) => {
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        }))
      },

      updateReceta: (id, changes) => {
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id ? { ...r, ...changes } : r
          ),
        }))
      },

      guardarRecetaMealDB: (recetaMealDB) => {
        const exists = get().recipes.find((r) => r.id === recetaMealDB.id)
        if (!exists) {
          set((state) => ({
            recipes: [...state.recipes, { ...recetaMealDB, guardada: true, creadoEn: Date.now() }],
          }))
        }
      },

      isRecetaGuardada: (id) => {
        return get().recipes.some((r) => r.id === id)
      },
    }),
    {
      name: 'mi-cocina-storage',
      partialize: (state) => ({
        items: state.items,
        recipes: state.recipes,
        // itemsTachados NO se persiste (sesión temporal)
      }),
    }
  )
)

export default useStore