import { useState, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import useAuthStore from '../../store/useAuthStore'

// Recortar imagen en cuadrado centrado y redimensionar
async function cropAndResize(file, size = 200) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        // Calcular recorte cuadrado centrado
        const minSide = Math.min(img.width, img.height)
        const sx = (img.width - minSide) / 2
        const sy = (img.height - minSide) / 2
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size)
        resolve(canvas.toDataURL('image/png', 0.85))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function IconField({ emoji, iconUrl, onEmojiChange, onIconUrlChange, label = 'Icono' }) {
  const [tab, setTab] = useState(iconUrl ? 'imagen' : 'emoji')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)
  const user = useAuthStore((s) => s.user)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      if (isSupabaseConfigured && supabase && user) {
        const ext = file.name.split('.').pop() || 'png'
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`
        // Comprimir antes de subir
        const base64 = await cropAndResize(file, 200)
        const blob = await fetch(base64).then(r => r.blob())
        const { data, error } = await supabase.storage.from('icons').upload(path, blob, { upsert: true, contentType: 'image/png' })
        if (!error) {
          const { data: urlData } = supabase.storage.from('icons').getPublicUrl(data.path)
          onIconUrlChange(urlData.publicUrl)
          onEmojiChange('')
        }
      } else {
        const base64 = await cropAndResize(file, 200)
        onIconUrlChange(base64)
        onEmojiChange('')
      }
    } catch (err) {
      console.error('Error subiendo imagen:', err)
    }
    setUploading(false)
  }

  return (
    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-main)' }}>
        {label}
      </label>

      {/* Preview */}
      <div className="flex items-center gap-3 mb-3">
        {iconUrl ? (
          <img src={iconUrl} alt="icono" className="w-12 h-12 rounded-xl object-contain border"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-main)' }} />
        ) : (
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl border"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-main)' }}>
            {emoji || '📦'}
          </div>
        )}
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>Icono actual</p>
          {iconUrl && (
            <button type="button" onClick={() => { onIconUrlChange(''); onEmojiChange('📦') }}
              className="text-xs text-red-500 mt-0.5">
              ✕ Quitar imagen
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {[{ key: 'emoji', label: '😊 Emoji' }, { key: 'imagen', label: '🖼️ Imagen' }].map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
            style={tab === t.key
              ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-main)' }
              : { backgroundColor: 'color-mix(in srgb, var(--color-text-muted) 12%, transparent)', color: 'var(--color-text-muted)' }
            }>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'emoji' && (
        <div>
          <input className="input-base text-2xl" placeholder="Pega un emoji aquí → 🥛"
            value={emoji} onChange={(e) => { onEmojiChange(e.target.value); onIconUrlChange('') }} maxLength={8} />
          <p className="text-xs mt-1.5" style={{ color: 'var(--color-text-muted)' }}>
            Busca en Google &quot;emoji [producto]&quot; y copia el emoji
          </p>
        </div>
      )}

      {tab === 'imagen' && (
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <button type="button" onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 font-medium text-sm transition-colors disabled:opacity-60"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
            {uploading ? '⏳ Subiendo...' : '📷 Elegir imagen de la galería'}
          </button>
          <p className="text-xs mt-1.5" style={{ color: 'var(--color-text-muted)' }}>
            PNG sin fondo recomendado · Se comprime automáticamente
          </p>
        </div>
      )}
    </div>
  )
}