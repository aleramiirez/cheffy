import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fallback seguro: si no hay env vars (ej: Netlify sin configurar), no crashea
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Helper: subir imagen a Supabase Storage
export async function uploadIcon(userId, file) {
  const ext = file.name.split('.').pop() || 'png'
  const fileName = `${userId}/${crypto.randomUUID()}.${ext}`

  const { data, error } = await supabase.storage
    .from('icons')
    .upload(fileName, file, { upsert: true, contentType: file.type })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('icons')
    .getPublicUrl(data.path)

  return publicUrl
}