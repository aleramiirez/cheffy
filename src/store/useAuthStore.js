import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,

  // Inicializar: obtener sesión actual y suscribirse a cambios
  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null, loading: false })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, loading: false })
    })
  },

  // Login con email + contraseña
  loginWithEmail: async (email, password) => {
    set({ error: null })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) set({ error: error.message })
    return { error }
  },

  // Registro con email + contraseña
  registerWithEmail: async (email, password) => {
    set({ error: null })
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) set({ error: error.message })
    return { error }
  },

  // Login con Google
  loginWithGoogle: async () => {
    set({ error: null })
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) set({ error: error.message })
  },

  // Cerrar sesión
  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore