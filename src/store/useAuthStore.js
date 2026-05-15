import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,
  configError: !isSupabaseConfigured,

  init: async () => {
    if (!isSupabaseConfigured || !supabase) {
      set({ loading: false, configError: true })
      return
    }
    const { data } = await supabase.auth.getSession()
    set({ user: data.session?.user ?? null, loading: false })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, loading: false })
    })
  },

  loginWithEmail: async (email, password) => {
    set({ error: null })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) set({ error: error.message })
    return { error }
  },

  registerWithEmail: async (email, password) => {
    set({ error: null })
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) set({ error: error.message })
    return { error }
  },

  loginWithGoogle: async () => {
    set({ error: null })
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) set({ error: error.message })
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore