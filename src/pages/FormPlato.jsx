import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useStore from '../store/useStore'
import IconField from '../components/common/IconField'

function normalizar(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export default function FormPlato() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addPlato, updatePlato, platos, items } = useStore()

  const platoExistente = id ? platos.find((p) => p.id === id) : null
  const esEdicion = Boolean(platoExistente)

  const [nombre, setNombre] = useState('')
  const [emoji, setEmoji] = useState('🍽️')
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (platoExistente) {
      setNombre(platoExistente.nombre)
      setEmoji(platoExistente.emoji)
      setIngredientesSeleccionados(platoExistente.ingredienteIds || [])
    }
  }, [])

  const toggleIngrediente = (itemId) => {
    setIngredientesSeleccionados((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const itemsFiltrados = useMemo(() => {
    if (!busqueda.trim()) return items
    const q = normalizar(busqueda.trim())
    return items.filter((i) => normalizar(i.nombre).includes(q))
  }, [items, busqueda])

  const handleGuardar = () => {
    if (nombre.trim().length < 2) { setError('El nombre debe tener al menos 2 caracteres'); return }
    if (ingredientesSeleccionados.length === 0) { setError('Añade al menos un ingrediente'); return }
    const data = { nombre: nombre.trim(), emoji: emoji || '🍽️', ingredienteIds: ingredientesSeleccionados }
    if (esEdicion) updatePlato(id, data)
    else addPlato(data)
    navigate('/recetas')
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--color-bg-main)' }}>
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-4 pb-3 sticky top-0 z-10 border-b"
        style={{ backgroundColor: 'var(--color-bg-main)', borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full font-bold"
          style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-main)' }}
        >←</button>
        <h1 className="flex-1 text-lg font-bold" style={{ color: 'var(--color-text-main)' }}>
          {esEdicion ? 'Editar plato' : 'Nuevo plato'}
        </h1>
        <button onClick={handleGuardar} className="btn-primary py-2 px-4 text-sm">
          ✅ Guardar
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-8">
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-main)' }}>
            Nombre del plato <span className="text-red-500">*</span>
          </label>
          <input
            className="input-base"
            placeholder="Ej: Tortilla de patatas"
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); setError('') }}
            autoFocus
          />
        </div>

        <IconField
          emoji={emoji}
          iconUrl={platoExistente?.iconUrl || ''}
          onEmojiChange={setEmoji}
          onIconUrlChange={() => {}}
          label="Icono del plato"
        />

        {/* Ingredientes */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-main)' }}>
            Ingredientes <span className="text-red-500">*</span>
            {ingredientesSeleccionados.length > 0 && (
              <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                {ingredientesSeleccionados.length} seleccionados
              </span>
            )}
          </label>

          {/* Buscador de ingredientes */}
          <div className="relative mb-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--color-text-muted)' }}>🔍</span>
            <input
              className="input-base pl-8 py-2 text-sm"
              placeholder="Buscar ingrediente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
              Primero añade productos a tu lista
            </p>
          ) : (
            <div className="space-y-1 max-h-72 overflow-y-auto rounded-xl border p-2"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}>
              {itemsFiltrados.map((item) => {
                const seleccionado = ingredientesSeleccionados.includes(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => { toggleIngrediente(item.id); setError('') }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                    style={{
                      backgroundColor: seleccionado
                        ? 'color-mix(in srgb, var(--color-primary) 12%, transparent)'
                        : 'transparent',
                    }}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className="flex-1 text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>{item.nombre}</span>
                    {seleccionado && (
                      <span className="text-base" style={{ color: 'var(--color-primary)' }}>✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
