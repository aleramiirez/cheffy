import { useState, useMemo, useEffect, useRef } from 'react'
import useStore, { CATEGORIES } from '../store/useStore'
import Modal from '../components/common/Modal'
import Toast from '../components/common/Toast'

function normalizar(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// ─── Modal Añadir / Editar producto ──────────────────────────────────────────
function ItemModal({ open, onClose, itemEditar = null, nombreInicial = '' }) {
  const { addItem, updateItem, toggleEnLista } = useStore()
  const esEdicion = Boolean(itemEditar)

  const [nombre, setNombre] = useState('')
  const [emoji, setEmoji] = useState('📦')
  const [categoriaId, setCategoriaId] = useState('otros')
  const [enLista, setEnLista] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      if (esEdicion) {
        setNombre(itemEditar.nombre)
        setEmoji(itemEditar.emoji)
        setCategoriaId(itemEditar.categoriaId)
        setEnLista(itemEditar.enLista)
      } else {
        setNombre(nombreInicial)
        setEmoji('📦')
        setCategoriaId('otros')
        setEnLista(false)
      }
      setError('')
    }
  }, [open, nombreInicial, itemEditar])

  const handleGuardar = () => {
    if (nombre.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres')
      return
    }
    if (esEdicion) {
      updateItem(itemEditar.id, {
        nombre: nombre.trim(),
        emoji: emoji || '📦',
        categoriaId,
        enLista,
      })
    } else {
      addItem(nombre.trim(), categoriaId, emoji || '📦')
      if (enLista) {
        setTimeout(() => {
          const newItems = useStore.getState().items
          const created = newItems.find(
            (i) => normalizar(i.nombre) === normalizar(nombre.trim()) && !i.enLista
          )
          if (created) toggleEnLista(created.id)
        }, 0)
      }
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={esEdicion ? 'Editar producto' : 'Añadir producto'}>
      <div className="space-y-4 pb-4">
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            className="input-base"
            placeholder="Ej: Leche entera"
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); setError('') }}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleGuardar()}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">Emoji (opcional)</label>
          <input
            className="input-base text-xl"
            placeholder="📦"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            maxLength={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-2">
            Categoría <span className="text-red-500">*</span>
          </label>
          <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
            {CATEGORIES.map((cat) => (
              <label
                key={cat.id}
                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                  categoriaId === cat.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="categoria"
                  value={cat.id}
                  checked={categoriaId === cat.id}
                  onChange={() => setCategoriaId(cat.id)}
                  className="accent-primary"
                />
                <span className="text-lg">{cat.emoji}</span>
                <span className="text-sm text-text-main">{cat.nombre}</span>
              </label>
            ))}
          </div>
        </div>

        {!esEdicion && (
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={enLista}
              onChange={(e) => setEnLista(e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <span className="text-sm font-medium text-text-main">Añadir a lista de compra</span>
          </label>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 btn-secondary">Cancelar</button>
          <button onClick={handleGuardar} className="flex-1 btn-primary">
            {esEdicion ? '💾 Actualizar' : '✅ Guardar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Item con swipe para editar/eliminar ─────────────────────────────────────
function ItemRow({ item, onEdit, onDelete }) {
  const toggleEnLista = useStore((s) => s.toggleEnLista)
  const [offsetX, setOffsetX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(null)
  const ACTION_WIDTH = 130 // ancho total de los botones de acción

  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (startXRef.current === null) return
    const delta = e.touches[0].clientX - startXRef.current
    if (delta < 0) {
      setOffsetX(Math.max(delta, -ACTION_WIDTH))
    } else if (offsetX < 0) {
      setOffsetX(Math.min(0, offsetX + delta))
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    startXRef.current = null
    if (offsetX < -ACTION_WIDTH / 2) {
      setOffsetX(-ACTION_WIDTH) // snap to open
    } else {
      setOffsetX(0) // snap closed
    }
  }

  const closeSwipe = () => setOffsetX(0)

  return (
    <div className="relative overflow-hidden">
      {/* Botones de acción detrás */}
      <div className="absolute right-0 top-0 bottom-0 flex items-stretch" style={{ width: ACTION_WIDTH }}>
        <button
          onClick={() => { closeSwipe(); onEdit(item) }}
          className="flex-1 bg-blue-500 flex flex-col items-center justify-center gap-1 text-white text-xs font-medium"
        >
          <span className="text-lg">✏️</span>
          Editar
        </button>
        <button
          onClick={() => { closeSwipe(); onDelete(item.id) }}
          className="flex-1 bg-red-500 flex flex-col items-center justify-center gap-1 text-white text-xs font-medium"
        >
          <span className="text-lg">🗑️</span>
          Borrar
        </button>
      </div>

      {/* Fila principal deslizable */}
      <div
        className="relative bg-white flex items-center gap-3 py-3 px-4"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s ease',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <span className="text-2xl flex-shrink-0 leading-none">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text-main truncate leading-tight">{item.nombre}</p>
        </div>
        <button
          onClick={() => toggleEnLista(item.id)}
          className={`flex-shrink-0 w-12 h-7 rounded-full transition-all duration-300 relative ${
            item.enLista ? 'bg-primary' : 'bg-gray-200'
          }`}
          aria-label={item.enLista ? 'Quitar de lista' : 'Añadir a lista'}
        >
          <span
            className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${
              item.enLista ? 'left-[calc(100%-26px)]' : 'left-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  )
}

// ─── Grupo de categoría colapsable ───────────────────────────────────────────
function CategoriaGroup({ categoria, items, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="mb-2 bg-white rounded-xl overflow-hidden shadow-card border border-gray-100">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg">{categoria.emoji}</span>
        <span className="flex-1 font-semibold text-text-main text-sm">{categoria.nombre}</span>
        <span className="text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">{items.length}</span>
        <span className="text-text-muted text-xs ml-1">{expanded ? '▼' : '▶'}</span>
      </button>
      {expanded && (
        <div className="divide-y divide-gray-50">
          {items.map((item) => (
            <ItemRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function Lista() {
  const items = useStore((s) => s.items)
  const removeItem = useStore((s) => s.removeItem)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [modalOpen, setModalOpen] = useState(false)
  const [itemEditar, setItemEditar] = useState(null)
  const [nombreModal, setNombreModal] = useState('')
  const [toast, setToast] = useState({ visible: false, message: '' })

  const showToast = (message) => setToast({ visible: true, message })

  const handleDelete = (id) => {
    removeItem(id)
    showToast('🗑️ Producto eliminado')
  }

  const handleEdit = (item) => {
    setItemEditar(item)
    setModalOpen(true)
  }

  const handleOpenAdd = () => {
    setItemEditar(null)
    setNombreModal(busqueda.trim())
    setModalOpen(true)
  }

  const { itemsFiltrados, hayResultadoExacto } = useMemo(() => {
    let filtered = items
    if (filtro === 'falta') filtered = filtered.filter((i) => i.enLista)
    else if (filtro === 'tengo') filtered = filtered.filter((i) => i.tengo && !i.enLista)
    if (busqueda.trim()) {
      const q = normalizar(busqueda.trim())
      filtered = filtered.filter((i) => normalizar(i.nombre).includes(q))
    }
    const exacto = busqueda.trim()
      ? items.some((i) => normalizar(i.nombre) === normalizar(busqueda.trim()))
      : false
    return { itemsFiltrados: filtered, hayResultadoExacto: exacto }
  }, [items, busqueda, filtro])

  const grupos = useMemo(() => {
    const map = {}
    itemsFiltrados.forEach((item) => {
      if (!map[item.categoriaId]) map[item.categoriaId] = []
      map[item.categoriaId].push(item)
    })
    return CATEGORIES
      .filter((cat) => map[cat.id]?.length > 0)
      .map((cat) => ({ categoria: cat, items: map[cat.id] }))
  }, [itemsFiltrados])

  return (
    <div className="flex flex-col h-full">
      {/* Buscador sticky */}
      <div className="px-4 pt-3 pb-2 sticky top-0 z-10 bg-bg-main">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
          <input
            className="input-base pl-8 pr-9 py-2 text-sm"
            placeholder="Buscar o añadir producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-6 h-6 flex items-center justify-center">
              ✕
            </button>
          )}
        </div>
        {busqueda.trim() && !hayResultadoExacto && (
          <button
            onClick={handleOpenAdd}
            className="mt-2 w-full flex items-center gap-2 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl text-primary font-medium text-sm hover:bg-primary/10 transition-colors"
          >
            <span>➕</span> Añadir &quot;{busqueda.trim()}&quot;
          </button>
        )}
      </div>

      {/* Chips de filtro */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
        {[
          { key: 'todos', label: 'Todos', count: items.length },
          { key: 'falta', label: 'Me falta', count: items.filter((i) => i.enLista).length },
          { key: 'tengo', label: 'Tengo', count: items.filter((i) => i.tengo && !i.enLista).length },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`chip flex-shrink-0 flex items-center gap-1.5 ${filtro === f.key ? 'chip-active' : 'chip-inactive'}`}
          >
            {f.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filtro === f.key ? 'bg-white/20' : 'bg-gray-200'}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {grupos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            {items.length === 0 ? (
              <>
                <span className="text-6xl mb-4">🛒</span>
                <h3 className="text-lg font-semibold text-text-main mb-2">Tu lista está vacía</h3>
                <p className="text-text-muted text-sm mb-6">Busca productos y añádelos</p>
                <button onClick={handleOpenAdd} className="btn-primary">➕ Añadir primer producto</button>
              </>
            ) : (
              <>
                <span className="text-5xl mb-4">🔍</span>
                <h3 className="text-lg font-semibold text-text-main mb-2">Sin resultados</h3>
                <p className="text-text-muted text-sm">No encontramos productos con ese nombre</p>
              </>
            )}
          </div>
        ) : (
          grupos.map(({ categoria, items: catItems }) => (
            <CategoriaGroup
              key={categoria.id}
              categoria={categoria}
              items={catItems}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* FAB añadir */}
      <button
        onClick={handleOpenAdd}
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-fab flex items-center justify-center text-2xl transition-transform active:scale-95 hover:bg-primary-light z-20"
        aria-label="Añadir producto"
      >
        ➕
      </button>

      <ItemModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setItemEditar(null) }}
        itemEditar={itemEditar}
        nombreInicial={!itemEditar ? nombreModal : ''}
      />

      <Toast message={toast.message} visible={toast.visible} onHide={() => setToast({ ...toast, visible: false })} />
    </div>
  )
}
