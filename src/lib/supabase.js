import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

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