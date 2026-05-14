import { useState, useRef, useEffect, lazy, Suspense } from 'react'

const EmojiPicker = lazy(() => import('emoji-picker-react'))

export default function EmojiPickerField({ value = '📦', onChange, label = 'Emoji' }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('touchstart', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [open])

  const handleSelect = (emojiData) => {
    onChange(emojiData.emoji)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-main)' }}>
        {label}
      </label>

      {/* Botón que muestra el emoji actual */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border w-full transition-all"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderColor: open ? 'var(--color-primary)' : 'var(--color-border)',
          boxShadow: open ? '0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent)' : 'none',
        }}
      >
        <span className="text-3xl leading-none">{value || '📦'}</span>
        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Toca para cambiar emoji
        </span>
        <span className="ml-auto text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {/* Picker — se abre debajo del botón (carga lazy) */}
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1">
          <Suspense fallback={
            <div className="flex items-center justify-center h-20 rounded-xl border"
              style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
              <span className="text-text-muted text-sm">Cargando...</span>
            </div>
          }>
          <EmojiPicker
            onEmojiClick={handleSelect}
            searchPlaceholder="Buscar emoji..."
            skinTonesDisabled
            height={350}
            width="100%"
            previewConfig={{ showPreview: false }}
            style={{
              '--epr-bg-color': 'var(--color-bg-card)',
              '--epr-category-label-bg-color': 'var(--color-bg-main)',
              '--epr-text-color': 'var(--color-text-main)',
              '--epr-search-border-color': 'var(--color-border)',
              '--epr-highlight-color': 'var(--color-primary)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            }}
          />
          </Suspense>
        </div>
      )}
    </div>
  )
}