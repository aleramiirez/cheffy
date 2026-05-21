import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import useStore, { CATEGORIES } from '../store/useStore'
import Modal from '../components/common/Modal'
import Toast from '../components/common/Toast'
import IconField from '../components/common/IconField'

function normalizar(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// ─── Bottom Sheet contextual para Editar/Eliminar ───────────────────────────
function ItemActionSheet({ item, open, onClose, onEdit, onDelete }) {
  if (!item) return null
  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Sheet */}
      <div className={`absolute bottom-0 left-0 right-0 max-w-lg mx-auto rounded-t-3xl transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ backgroundColor: 'var(--color-bg-card)' }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--color-border)' }} />
        </div>
        {/* Item name */}
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <span className="text-2xl">{item.emoji}</span>
          <span className="font-semibold truncate" style={{ color: 'var(--color-text-main)' }}>{item.nombre}</span>
        </div>
        {/* Actions */}
        <div className="p-3 space-y-1 safe-bottom">
          <button
            onClick={() => { onClose(); onEdit(item) }}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-colors active:scale-[0.98]"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' }}
          >
            <span className="text-xl w-8 text-center">✏️</span>
            <span className="font-medium" style={{ color: 'var(--color-text-main)' }}>Editar producto</span>
          </button>
          <button
            onClick={() => { onClose(); onDelete(item.id) }}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-colors active:scale-[0.98]"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)' }}
          >
            <span className="text-xl w-8 text-center">🗑️</span>
            <span className="font-medium text-red-500">Eliminar producto</span>
          </button>
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-semibold transition-colors"
            style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Modal Añadir / Editar producto ──────────────────────────────────────────
function ItemModal({ open, onClose, itemEditar = null, nombreInicial = '' }) {
  const { addItem, updateItem, toggleEnLista } = useStore()
  const esEdicion = Boolean(itemEditar)
  const [nombre, setNombre] = useState('')
  const [emoji, setEmoji] = useState('📦')
  const [iconUrl, setIconUrl] = useState('')
  const [categoriaId, setCategoriaId] = useState('otros')
  const [enLista, setEnLista] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      if (esEdicion) {
        setNombre(itemEditar.nombre); setEmoji(itemEditar.emoji || '📦')
        setIconUrl(itemEditar.iconUrl || ''); setCategoriaId(itemEditar.categoriaId); setEnLista(itemEditar.enLista)
      } else {
        setNombre(nombreInicial); setEmoji('📦'); setIconUrl(''); setCategoriaId('otros'); setEnLista(false)
      }
      setError('')
    }
  }, [open, nombreInicial, itemEditar])

  const addItemFull = useStore((s) => s.addItemFull)

  const handleGuardar = () => {
    if (nombre.trim().length < 2) { setError('El nombre debe tener al menos 2 caracteres'); return }
    if (esEdicion) {
      updateItem(itemEditar.id, { nombre: nombre.trim(), emoji: emoji || '📦', iconUrl: iconUrl || null, categoriaId, enLista })
    } else {
      addItemFull({
        id: crypto.randomUUID(),
        nombre: nombre.trim(),
        categoriaId,
        emoji: emoji || '📦',
        iconUrl: iconUrl || null,
        enLista,
        tengo: false,
        creadoEn: Date.now(),
      })
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

        <IconField emoji={emoji} iconUrl={iconUrl} onEmojiChange={setEmoji} onIconUrlChange={setIconUrl} label="Icono" />

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
                <input type="radio" name="categoria" value={cat.id} checked={categoriaId === cat.id}
                  onChange={() => setCategoriaId(cat.id)} className="accent-primary" />
                <span className="text-lg">{cat.emoji}</span>
                <span className="text-sm text-text-main">{cat.nombre}</span>
              </label>
            ))}
          </div>
        </div>

        {!esEdicion && (
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
            <input type="checkbox" checked={enLista} onChange={(e) => setEnLista(e.target.checked)} className="w-5 h-5 accent-primary" />
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

// ─── Fila de item con Long Press ──────────────────────────────────────────────
function ItemRow({ item, onLongPress }) {
  const toggleEnLista = useStore((s) => s.toggleEnLista)
  const longPressTimer = useRef(null)
  const [pressing, setPressing] = useState(false)

  const startPress = (e) => {
    // Solo long press en touch, no en clicks normales
    setPressing(true)
    longPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(30)
      onLongPress(item)
      setPressing(false)
    }, 500)
  }

  const cancelPress = () => {
    clearTimeout(longPressTimer.current)
    setPressing(false)
  }

  return (
    <div
      className={`flex items-center gap-3 py-3 px-4 transition-colors select-none ${pressing ? 'bg-gray-50' : 'bg-white'}`}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
    >
      {item.iconUrl ? (
        <img src={item.iconUrl} alt={item.nombre} className="w-8 h-8 flex-shrink-0 rounded-lg object-contain" />
      ) : (
        <span className="text-2xl flex-shrink-0 leading-none">{item.emoji || '📦'}</span>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text-main truncate leading-tight">{item.nombre}</p>
      </div>
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => { e.stopPropagation(); clearTimeout(longPressTimer.current) }}
        onClick={() => toggleEnLista(item.id)}
        className={`flex-shrink-0 w-12 h-7 rounded-full transition-all duration-300 relative ${item.enLista ? 'bg-primary' : 'bg-gray-200'}`}
        aria-label={item.enLista ? 'Quitar de lista' : 'Añadir a lista'}
      >
        <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${item.enLista ? 'left-[calc(100%-26px)]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

// ─── Grupo de categoría colapsable ───────────────────────────────────────────
function CategoriaGroup({ categoria, items, onLongPress, autoExpand }) {
  const [expanded, setExpanded] = useState(false)
  useEffect(() => { if (autoExpand) setExpanded(true) }, [autoExpand])

  return (
    <div className="mb-2 bg-white rounded-xl overflow-hidden shadow-card border border-gray-100">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
        <span className="text-lg">{categoria.emoji}</span>
        <span className="flex-1 font-semibold text-text-main text-sm">{categoria.nombre}</span>
        <span className="text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">{items.length}</span>
        <span className="text-text-muted text-xs ml-1">{expanded ? '▼' : '▶'}</span>
      </button>
      {expanded && (
        <div className="divide-y divide-gray-50">
          {items.map((item) => (
            <ItemRow key={item.id} item={item} onLongPress={onLongPress} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── SVG Plus Icon ────────────────────────────────────────────────────────────
function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
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
  const [chipsVisible, setChipsVisible] = useState(true)
  const [actionItem, setActionItem] = useState(null)
  const [actionOpen, setActionOpen] = useState(false)
  const lastScrollY = useRef(0)
  const scrollContainerRef = useRef(null)

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const currentY = el.scrollTop
    if (currentY < 10) setChipsVisible(true)
    else if (currentY > lastScrollY.current + 5) setChipsVisible(false)
    else if (currentY < lastScrollY.current - 5) setChipsVisible(true)
    lastScrollY.current = currentY
  }, [])

  const handleLongPress = (item) => { setActionItem(item); setActionOpen(true) }
  const handleCloseAction = () => { setActionOpen(false); setTimeout(() => setActionItem(null), 300) }

  const handleDelete = (id) => {
    removeItem(id)
    setToast({ visible: true, message: '🗑️ Producto eliminado' })
  }

  const handleEdit = (item) => { setItemEditar(item); setModalOpen(true) }
  const handleOpenAdd = () => { setItemEditar(null); setNombreModal(busqueda.trim()); setModalOpen(true) }

  const { itemsFiltrados, hayResultadoExacto } = useMemo(() => {
    let filtered = items
    if (filtro === 'falta') filtered = filtered.filter((i) => i.enLista)
    if (busqueda.trim()) {
      const q = normalizar(busqueda.trim())
      filtered = filtered.filter((i) => normalizar(i.nombre).includes(q))
    }
    const exacto = busqueda.trim() ? items.some((i) => normalizar(i.nombre) === normalizar(busqueda.trim())) : false
    return { itemsFiltrados: filtered, hayResultadoExacto: exacto }
  }, [items, busqueda, filtro])

  const grupos = useMemo(() => {
    const map = {}
    itemsFiltrados.forEach((item) => {
      if (!map[item.categoriaId]) map[item.categoriaId] = []
      map[item.categoriaId].push(item)
    })
    return CATEGORIES.filter((cat) => map[cat.id]?.length > 0).map((cat) => ({ categoria: cat, items: map[cat.id] }))
  }, [itemsFiltrados])

  return (
    <div className="flex flex-col h-full">
      {/* Buscador sticky */}
      <div className="px-4 pt-3 pb-2 sticky top-0 z-10 bg-bg-main">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
          <input className="input-base pl-8 pr-9 py-2 text-sm" placeholder="Buscar o añadir producto..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          {busqueda && (
            <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-6 h-6 flex items-center justify-center">✕</button>
          )}
        </div>
        {busqueda.trim() && !hayResultadoExacto && (
          <button onClick={handleOpenAdd}
            className="mt-2 w-full flex items-center gap-2 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl text-primary font-medium text-sm hover:bg-primary/10 transition-colors">
            <PlusIcon /> Añadir &quot;{busqueda.trim()}&quot;
          </button>
        )}
      </div>

      {/* Chips de filtro */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${chipsVisible ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {[
            { key: 'todos', label: 'Todos', count: items.length },
            { key: 'falta', label: 'Me falta', count: items.filter((i) => i.enLista).length },
          ].map((f) => (
            <button key={f.key} onClick={() => setFiltro(f.key)}
              className={`chip flex-shrink-0 flex items-center gap-1.5 ${filtro === f.key ? 'chip-active' : 'chip-inactive'}`}>
              {f.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filtro === f.key ? 'bg-white/20' : 'bg-gray-200'}`}>{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 pb-20">
        {grupos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            {items.length === 0 ? (
              <>
                <span className="text-6xl mb-4">🛒</span>
                <h3 className="text-lg font-semibold text-text-main mb-2">Tu lista está vacía</h3>
                <p className="text-text-muted text-sm mb-6">Busca productos y añádelos</p>
                <button onClick={handleOpenAdd} className="btn-primary flex items-center gap-2">
                  <PlusIcon /> Añadir primer producto
                </button>
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
              onLongPress={handleLongPress}
              autoExpand={Boolean(busqueda.trim())}
            />
          ))
        )}
      </div>

      {/* FAB añadir */}
      <button
        onClick={handleOpenAdd}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-fab flex items-center justify-center transition-transform active:scale-95 z-20"
        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
        aria-label="Añadir producto"
      >
        <PlusIcon />
      </button>

      <ItemActionSheet
        item={actionItem}
        open={actionOpen}
        onClose={handleCloseAction}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
