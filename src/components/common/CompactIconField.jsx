import { useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import useAuthStore from '../../store/useAuthStore'

async function cropAndResize(file, size = 200) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = size; canvas.height = size
        const ctx = canvas.getContext('2d')
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

export default function CompactIconField({ emoji, iconUrl, onEmojiChange, onIconUrlChange }) {
  const [showEmojiInput, setShowEmojiInput] = useState(false)
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
    } catch (err) { console.error(err) }
    setUploading(false)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text-main mb-1.5">Icono</label>
      <div className="flex items-center gap-2 p-2 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}>
        {/* Preview */}
        {iconUrl ? (
          <img src={iconUrl} alt="icono" className="w-9 h-9 rounded-lg object-contain flex-shrink-0" style={{ backgroundColor: 'var(--color-bg-main)' }} />
        ) : (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: 'var(--color-bg-main)' }}>
            {emoji || '📦'}
          </div>
        )}

        {/* Emoji input inline */}
        {showEmojiInput ? (
          <input
            className="flex-1 text-lg bg-transparent focus:outline-none"
            placeholder="Pega emoji..."
            value={emoji}
            onChange={(e) => { onEmojiChange(e.target.value); onIconUrlChange('') }}
            autoFocus
            onBlur={() => setShowEmojiInput(false)}
            maxLength={8}
          />
        ) : (
          <span className="flex-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {iconUrl ? 'Imagen subida' : (emoji && emoji !== '📦') ? emoji : 'Sin icono personalizado'}
          </span>
        )}

        {/* Acciones */}
        <div className="flex gap-1 flex-shrink-0">
          <button type="button" onClick={() => setShowEmojiInput(!showEmojiInput)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors"
            style={{ backgroundColor: showEmojiInput ? 'var(--color-primary)' : 'var(--color-border)', color: showEmojiInput ? 'white' : 'var(--color-text-muted)' }}
            title="Emoji">✏️</button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
            title="Imagen">{uploading ? '⏳' : '🖼️'}</button>
          {(iconUrl || (emoji && emoji !== '📦')) && (
            <button type="button" onClick={() => { onIconUrlChange(''); onEmojiChange('📦') }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-red-400"
              style={{ backgroundColor: 'var(--color-border)' }} title="Quitar">✕</button>
          )}
        </div>
      </div>
    </div>
  )
}