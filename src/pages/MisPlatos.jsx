import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

function PlatoCard({ plato, items, onAddFaltantes, onEliminar }) {
  const [showIngredientes, setShowIngredientes] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const ingredientesConEstado = plato.ingredienteIds.map((id) => {
    const item = items.find((i) => i.id === id)
    return { id, nombre: item?.nombre || '(eliminado)', emoji: item?.emoji || '📦', tengo: item?.tengo || false }
  })

  const faltantes = ingredientesConEstado.filter((i) => !i.tengo)
  const totalIngredientes = ingredientesConEstado.length
  const tenidos = totalIngredientes - faltantes.length

  let estado, colorBorder, colorBg, colorText
  if (faltantes.length === 0) {
    estado = '✅'; colorBorder = '#22C55E'; colorBg = '#F0FDF4'; colorText = '#16A34A'
  } else if (faltantes.length <= 2) {
    estado = '⚠️'; colorBorder = '#F59E0B'; colorBg = '#FFFBEB'; colorText = '#D97706'
  } else {
    estado = '❌'; colorBorder = '#E5E7EB'; colorBg = 'var(--color-bg-card)'; colorText = 'var(--color-text-muted)'
  }

  return (
    <div className="rounded-2xl overflow-hidden mb-3 border-2 transition-all"
      style={{ borderColor: colorBorder, backgroundColor: colorBg }}>
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        onClick={() => setShowIngredientes(!showIngredientes)}
      >
        <span className="text-2xl">{plato.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate" style={{ color: 'var(--color-text-main)' }}>{plato.nombre}</p>
          <p className="text-xs mt-0.5" style={{ color: colorText }}>
            {faltantes.length === 0
              ? `${totalIngredientes} ingredientes ✓`
              : `${tenidos}/${totalIngredientes} — faltan ${faltantes.length}`}
          </p>
        </div>
        <span className="text-xl flex-shrink-0">{estado}</span>
        <button
          onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >🗑️</button>
      </button>

      {/* Confirmación eliminar */}
      {confirmDelete && (
        <div className="px-4 pb-3 flex items-center gap-2">
          <p className="text-xs flex-1" style={{ color: 'var(--color-text-muted)' }}>¿Eliminar plato?</p>
          <button onClick={() => setConfirmDelete(false)} className="text-xs px-3 py-1 rounded-lg" style={{ backgroundColor: 'var(--color-border)' }}>No</button>
          <button onClick={() => onEliminar(plato.id)} className="text-xs px-3 py-1 rounded-lg bg-red-500 text-white">Sí</button>
        </div>
      )}

      {/* Lista ingredientes expandida */}
      {showIngredientes && !confirmDelete && (
        <div className="px-4 pb-3">
          <div className="space-y-1 mb-2">
            {ingredientesConEstado.map((ing) => (
              <div key={ing.id} className="flex items-center gap-2 text-sm">
                <span>{ing.tengo ? '✅' : '❌'}</span>
                <span>{ing.emoji}</span>
                <span style={{ color: ing.tengo ? 'var(--color-text-main)' : 'var(--color-text-muted)', textDecoration: ing.tengo ? 'none' : 'line-through' }}>
                  {ing.nombre}
                </span>
              </div>
            ))}
          </div>
          {faltantes.length > 0 && (
            <button
              onClick={() => onAddFaltantes(faltantes)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', color: 'var(--color-primary)' }}
            >
              ➕ Añadir {faltantes.length} faltante{faltantes.length !== 1 ? 's' : ''} a la lista
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function MisPlatos() {
  const navigate = useNavigate()
  const platos = useStore((s) => s.platos)
  const items = useStore((s) => s.items)
  const removePlato = useStore((s) => s.removePlato)
  const toggleEnLista = useStore((s) => s.toggleEnLista)

  const handleAddFaltantes = (faltantes) => {
    faltantes.forEach((ing) => {
      const item = items.find((i) => i.id === ing.id)
      if (item && !item.enLista) toggleEnLista(item.id)
    })
  }

  const platosOrdenados = useMemo(() => {
    return [...platos].sort((a, b) => {
      const faltantesA = a.ingredienteIds.filter((id) => {
        const item = items.find((i) => i.id === id)
        return !item?.tengo
      }).length
      const faltantesB = b.ingredienteIds.filter((id) => {
        const item = items.find((i) => i.id === id)
        return !item?.tengo
      }).length
      return faltantesA - faltantesB
    })
  }, [platos, items])

  if (platos.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center py-16">
        <span className="text-6xl mb-4">🍽️</span>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-main)' }}>
          Sin platos todavía
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Añade tus platos habituales con sus ingredientes y te diremos qué puedes cocinar hoy
        </p>
        <button onClick={() => navigate('/platos/nuevo')} className="btn-primary">
          ➕ Añadir mi primer plato
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-20">
      <p className="text-xs py-2 mb-1" style={{ color: 'var(--color-text-muted)' }}>
        Ordenados por disponibilidad · {platos.length} plato{platos.length !== 1 ? 's' : ''}
      </p>
      {platosOrdenados.map((plato) => (
        <PlatoCard
          key={plato.id}
          plato={plato}
          items={items}
          onAddFaltantes={handleAddFaltantes}
          onEliminar={removePlato}
        />
      ))}

      {/* FAB añadir plato */}
      <button
        onClick={() => navigate('/platos/nuevo')}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-fab flex items-center justify-center transition-transform active:scale-95 z-20"
        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
        aria-label="Añadir plato"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  )
}
