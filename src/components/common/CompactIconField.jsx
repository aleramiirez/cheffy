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

function getFirstEmoji(str) {
  if (!str) return ''
  const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/u
  const match = str.match(emojiRegex)
  return match ? match[0] : ''
}

export default function CompactIconField({ emoji, iconUrl, onEmojiChange, onIconUrlChange }) {
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)
  const inputRef = useRef(null)
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

  const startEditing = () => {
    if (!iconUrl) {
      setEditing(true)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }

  const handleEmojiInput = (e) => {
    const val = e.target.value
    if (!val) return
    const first = getFirstEmoji(val)
    if (first) {
      onEmojiChange(first)
      onIconUrlChange('')
      setEditing(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text-main mb-1.5">Icono</label>
      <div className="flex items-center gap-2">

        {/* Cuadrado emoji / input emoji */}
        {editing ? (
          <input
            ref={inputRef}
            className="w-10 h-10 rounded-xl text-center text-2xl focus:outline-none border-2"
            style={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-bg-main)' }}
            defaultValue=""
            onInput={handleEmojiInput}
            onBlur={() => setEditing(false)}
            placeholder=""
          />
        ) : (
          <button
            type="button"
            onClick={startEditing}
            disabled={!!iconUrl}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl border transition-all active:scale-95 disabled:cursor-default"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-bg-main)',
              opacity: iconUrl ? 0.5 : 1,
            }}
            title={iconUrl ? 'Quita la imagen para usar emoji' : 'Toca para cambiar emoji'}
          >
            {iconUrl ? (
              <img src={iconUrl} alt="icono" className="w-full h-full rounded-xl object-contain" />
            ) : (
              emoji || '📦'
            )}
          </button>
        )}

        {/* Botón imagen */}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border transition-all active:scale-95 disabled:opacity-50"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-main)', color: 'var(--color-text-muted)' }}
          title="Subir imagen"
        >
          {uploading ? '⏳' : '🖼️'}
        </button>

        {/* Botón quitar (solo si hay algo personalizado) */}
        {(iconUrl || (emoji && emoji !== '📦')) && (
          <button
            type="button"
            onClick={() => { onIconUrlChange(''); onEmojiChange('📦'); setEditing(false) }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-red-400 transition-all active:scale-95"
            style={{ backgroundColor: 'var(--color-border)' }}
            title="Quitar icono"
          >✕</button>
        )}
      </div>
    </div>
  )
}