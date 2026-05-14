import { useState, useMemo, useRef } from 'react'
import useStore, { CATEGORIES } from '../store/useStore'

function normalizar(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function ItemDespensa({ item, onQuitar }) {
  const [offsetX, setOffsetX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(null)
  const ACTION_WIDTH = 90

  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (startXRef.current === null) return
    const delta = e.touches[0].clientX - startXRef.current
    if (delta < 0) setOffsetX(Math.max(delta, -ACTION_WIDTH))
    else if (offsetX < 0) setOffsetX(Math.min(0, offsetX + delta))
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    startXRef.current = null
    if (offsetX < -ACTION_WIDTH / 2) setOffsetX(-ACTION_WIDTH)
    else setOffsetX(0)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Botón quitar */}
      <div className="absolute right-0 top-0 bottom-0 flex items-stretch" style={{ width: ACTION_WIDTH }}>
        <button
          onClick={() => onQuitar(item.id)}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-white text-xs font-medium"
          style={{ backgroundColor: '#EF4444' }}
        >
          <span className="text-lg">🗑️</span>
          Quitar
        </button>
      </div>

      {/* Fila deslizable */}
      <div
        className="relative flex items-center gap-3 py-3 px-4"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s ease',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <span className="text-2xl flex-shrink-0 leading-none">{item.emoji}</span>
        <p className="font-medium truncate" style={{ color: 'var(--color-text-main)' }}>
          {item.nombre}
        </p>
      </div>
    </div>
  )
}

function CategoriaGroup({ categoria, items, onQuitar }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mb-2 rounded-xl overflow-hidden border"
      style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left"
        style={{ backgroundColor: 'var(--color-bg-card)' }}
      >
        <span className="text-lg">{categoria.emoji}</span>
        <span className="flex-1 font-semibold text-sm" style={{ color: 'var(--color-text-main)' }}>{categoria.nombre}</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>{items.length}</span>
        <span className="text-xs ml-1" style={{ color: 'var(--color-text-muted)' }}>{expanded ? '▼' : '▶'}</span>
      </button>
      {expanded && (
        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {items.map((item) => (
            <ItemDespensa key={item.id} item={item} onQuitar={onQuitar} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Despensa() {
  const items = useStore((s) => s.items)
  const updateItem = useStore((s) => s.updateItem)
  const [busqueda, setBusqueda] = useState('')

  const handleQuitar = (id) => {
    updateItem(id, { tengo: false })
  }

  const itemsEnDespensa = useMemo(() => {
    let lista = items.filter((i) => i.tengo)
    if (busqueda.trim()) {
      const q = normalizar(busqueda.trim())
      lista = lista.filter((i) => normalizar(i.nombre).includes(q))
    }
    return lista
  }, [items, busqueda])

  const grupos = useMemo(() => {
    const map = {}
    itemsEnDespensa.forEach((item) => {
      if (!map[item.categoriaId]) map[item.categoriaId] = []
      map[item.categoriaId].push(item)
    })
    return CATEGORIES
      .filter((cat) => map[cat.id]?.length > 0)
      .map((cat) => ({ categoria: cat, items: map[cat.id] }))
  }, [itemsEnDespensa])

  const totalEnDespensa = items.filter((i) => i.tengo).length

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--color-bg-main)' }}>
      {/* Buscador */}
      <div className="px-4 pt-3 pb-2 sticky top-0 z-10" style={{ backgroundColor: 'var(--color-bg-main)' }}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}>🔍</span>
          <input
            className="input-base pl-8 pr-9 py-2 text-sm"
            placeholder="Buscar en despensa..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center"
              style={{ color: 'var(--color-text-muted)' }}
            >✕</button>
          )}
        </div>
      </div>

      {/* Contador */}
      {totalEnDespensa > 0 && (
        <div className="px-4 pb-2">
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {totalEnDespensa} producto{totalEnDespensa !== 1 ? 's' : ''} en casa
          </p>
        </div>
      )}

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {grupos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <span className="text-6xl mb-4">🏠</span>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-main)' }}>
              {busqueda ? 'Sin resultados' : 'Tu despensa está vacía'}
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {busqueda
                ? 'No encontramos productos con ese nombre'
                : 'Los productos que confirmes como comprados aparecerán aquí'}
            </p>
          </div>
        ) : (
          grupos.map(({ categoria, items: catItems }) => (
            <CategoriaGroup
              key={categoria.id}
              categoria={categoria}
              items={catItems}
              onQuitar={handleQuitar}
            />
          ))
        )}
      </div>
    </div>
  )
}
