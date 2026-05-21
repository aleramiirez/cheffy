import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-modal max-h-[92vh] flex flex-col safe-bottom">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-semibold text-text-main">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-text-muted hover:bg-gray-200 transition-colors">
            ✕
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {children}
        </div>

        {/* Footer fijo con botones (siempre visible) */}
        {footer && (
          <div className="flex-shrink-0 px-5 py-3 border-t border-gray-100 bg-white">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}