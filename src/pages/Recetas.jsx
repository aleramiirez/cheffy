import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import useStore from '../store/useStore'
import Toast from '../components/common/Toast'

function parseMealDBReceta(meal) {
  const ingredientes = []
  for (let i = 1; i <= 20; i++) {
    const nombre = meal['strIngredient' + i]
    const cantidad = meal['strMeasure' + i]
    if (nombre && nombre.trim()) {
      ingredientes.push({ nombre: nombre.trim(), cantidad: cantidad?.trim() || '' })
    }
  }
  const pasos = (meal.strInstructions || '')
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 10)

  return {
    id: 'mealdb-' + meal.idMeal,
    nombre: meal.strMeal,
    fuente: 'mealdb',
    ingredientes,
    pasos,
    foto: meal.strMealThumb,
    categoriaReceta: meal.strCategory || '',
    youtube: meal.strYoutube || '',
    guardada: false,
    creadoEn: Date.now(),
  }
}

// ─── Tarjeta de receta ───────────────────────────────────────────────────────

function RecetaCard({ receta, onGuardar, yaGuardada, onClick }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100 flex flex-col cursor-pointer active:scale-[0.97] transition-transform"
      onClick={onClick}
    >
      {receta.foto ? (
        <img
          src={receta.foto}
          alt={receta.nombre}
          className="w-full h-32 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-4xl">
          🍽️
        </div>
      )}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-text-main text-sm leading-tight line-clamp-2 flex-1">
          {receta.nombre}
        </h3>
        {receta.categoriaReceta && (
          <span className="text-xs text-text-muted mt-1">{receta.categoriaReceta}</span>
        )}
        {receta.fuente === 'mealdb' && (
          <button
            onClick={(e) => { e.stopPropagation(); onGuardar(receta) }}
            className={`mt-2 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors ${
              yaGuardada
                ? 'bg-green-100 text-green-700'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            {yaGuardada ? '✓ Guardada' : '💾 Guardar'}
          </button>
        )}
        {receta.fuente === 'propia' && (
          <span className="mt-2 text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-lg self-start">
            Propia
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Detalle de receta ───────────────────────────────────────────────────────

function RecetaDetalle({ receta, onClose, onGuardar, yaGuardada }) {
  return (
    <div className="fixed inset-0 z-50 bg-bg-main overflow-y-auto">
      <div className="max-w-lg mx-auto pb-8">
        {/* Foto cabecera */}
        <div className="relative">
          {receta.foto ? (
            <img src={receta.foto} alt={receta.nombre} className="w-full h-56 object-cover" />
          ) : (
            <div className="w-full h-56 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl">
              🍽️
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-text-main font-bold"
          >
            ←
          </button>
          {receta.fuente === 'mealdb' && (
            <button
              onClick={() => onGuardar(receta)}
              className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-colors ${
                yaGuardada ? 'bg-green-500 text-white' : 'bg-white/90 text-primary'
              }`}
            >
              {yaGuardada ? '✓ Guardada' : '💾 Guardar'}
            </button>
          )}
        </div>

        <div className="px-4 pt-5">
          <h1 className="text-2xl font-bold text-text-main mb-1">{receta.nombre}</h1>
          {receta.categoriaReceta && (
            <span className="text-sm text-text-muted bg-gray-100 px-3 py-1 rounded-full">
              {receta.categoriaReceta}
            </span>
          )}

          {/* Ingredientes */}
          <h2 className="text-lg font-semibold text-text-main mt-6 mb-3">🥕 Ingredientes</h2>
          <div className="space-y-2">
            {receta.ingredientes.map((ing, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50">
                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span className="flex-1 text-sm text-text-main">{ing.nombre}</span>
                {ing.cantidad && (
                  <span className="text-sm text-text-muted font-medium">{ing.cantidad}</span>
                )}
              </div>
            ))}
          </div>

          {/* Pasos */}
          <h2 className="text-lg font-semibold text-text-main mt-6 mb-3">📋 Preparación</h2>
          <div className="space-y-4">
            {receta.pasos.map((paso, i) => (
              <div key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-text-main leading-relaxed flex-1">{paso}</p>
              </div>
            ))}
          </div>

          {/* Enlace YouTube */}
          {receta.youtube && (
            <a
              href={receta.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-3 p-4 bg-red-50 rounded-xl text-red-600 font-medium text-sm"
            >
              <span className="text-2xl">▶️</span>
              Ver en YouTube
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100 animate-pulse">
      <div className="w-full h-32 bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )
}

// ─── Tab Descubrir ────────────────────────────────────────────────────────────

function TabDescubrir({ onVerDetalle }) {
  const { guardarRecetaMealDB, isRecetaGuardada } = useStore()
  const [busqueda, setBusqueda] = useState('')
  const [recetas, setRecetas] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '' })

  const buscarRecetas = useCallback(async (termino) => {
    setCargando(true)
    setError(null)
    try {
      const url = termino
        ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(termino)}`
        : `https://www.themealdb.com/api/json/v1/1/search.php?s=chicken`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Error de red')
      const data = await res.json()
      setRecetas((data.meals || []).map(parseMealDBReceta))
    } catch {
      setError('Error al cargar recetas. Comprueba tu conexión.')
      setRecetas([])
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    buscarRecetas('')
  }, [buscarRecetas])

  useEffect(() => {
    if (!busqueda.trim()) return
    const timer = setTimeout(() => buscarRecetas(busqueda), 500)
    return () => clearTimeout(timer)
  }, [busqueda, buscarRecetas])

  const handleGuardar = (receta) => {
    guardarRecetaMealDB(receta)
    setToast({ visible: true, message: '💾 Receta guardada' })
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
        <input
          className="input-base pl-9"
          placeholder="Buscar receta o ingrediente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-center py-8">
          <p className="text-text-muted mb-3">{error}</p>
          <button onClick={() => buscarRecetas(busqueda)} className="btn-secondary text-sm px-4 py-2">
            Reintentar
          </button>
        </div>
      )}

      {cargando ? (
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map((n) => <SkeletonCard key={n} />)}
        </div>
      ) : recetas.length === 0 && !error ? (
        <div className="text-center py-12">
          <span className="text-5xl">🍽️</span>
          <p className="text-text-muted mt-3">No encontramos recetas con ese término</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {recetas.map((r) => (
            <RecetaCard
              key={r.id}
              receta={r}
              onGuardar={handleGuardar}
              yaGuardada={isRecetaGuardada(r.id)}
              onClick={() => onVerDetalle(r)}
            />
          ))}
        </div>
      )}

      <Toast message={toast.message} visible={toast.visible} onHide={() => setToast({ ...toast, visible: false })} />
    </div>
  )
}

// ─── Tab Mis Recetas ──────────────────────────────────────────────────────────

function TabMisRecetas({ onVerDetalle }) {
  const navigate = useNavigate()
  const recipes = useStore((s) => s.recipes)
  const removeReceta = useStore((s) => s.removeReceta)
  const { guardarRecetaMealDB, isRecetaGuardada } = useStore()
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '' })

  const handleEliminar = (id) => {
    removeReceta(id)
    setConfirmDelete(null)
    setToast({ visible: true, message: '🗑️ Receta eliminada' })
  }

  if (recipes.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center py-16">
        <span className="text-6xl mb-4">👨‍🍳</span>
        <h3 className="text-lg font-semibold text-text-main mb-2">Aún no tienes recetas</h3>
        <p className="text-text-muted text-sm mb-6">Crea tu primera receta o guarda alguna de Descubrir</p>
        <button onClick={() => navigate('/recetas/nueva')} className="btn-primary">
          ➕ Crear receta
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {recipes.map((r) => (
            <div key={r.id} className="relative group">
              <RecetaCard
                receta={r}
                onGuardar={() => {}}
                yaGuardada={true}
                onClick={() => onVerDetalle(r)}
              />
              <button
                onClick={() => setConfirmDelete(r.id)}
                className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full shadow text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                🗑️
              </button>
              {confirmDelete === r.id && (
                <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-3 gap-2">
                  <p className="text-xs font-semibold text-text-main text-center">¿Eliminar receta?</p>
                  <div className="flex gap-2">
                    <button onClick={() => setConfirmDelete(null)} className="text-xs px-3 py-1.5 bg-gray-100 rounded-lg">No</button>
                    <button onClick={() => handleEliminar(r.id)} className="text-xs px-3 py-1.5 bg-red-500 text-white rounded-lg">Sí</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      <Toast message={toast.message} visible={toast.visible} onHide={() => setToast({ ...toast, visible: false })} />
    </div>
  )
}

// ─── Pantalla principal Recetas ───────────────────────────────────────────────

export default function Recetas() {
  const navigate = useNavigate()
  const { guardarRecetaMealDB, isRecetaGuardada } = useStore()
  const [tabActivo, setTabActivo] = useState('descubrir')
  const [recetaDetalle, setRecetaDetalle] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '' })

  const handleGuardar = (receta) => {
    guardarRecetaMealDB(receta)
    setToast({ visible: true, message: '💾 Receta guardada' })
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Recetas"
        emoji="🍳"
        rightAction={
          <button
            onClick={() => navigate('/recetas/nueva')}
            className="flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-3 py-2 rounded-xl active:scale-95 transition-transform"
          >
            <span>➕</span> Nueva
          </button>
        }
      />

      {/* Tabs internos */}
      <div className="flex gap-1 px-4 pb-3">
        {[
          { key: 'descubrir', label: '🌍 Descubrir' },
          { key: 'mis-recetas', label: '📖 Mis Recetas' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTabActivo(tab.key)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tabActivo === tab.key
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido del tab */}
      {tabActivo === 'descubrir' ? (
        <TabDescubrir onVerDetalle={setRecetaDetalle} />
      ) : (
        <TabMisRecetas onVerDetalle={setRecetaDetalle} />
      )}

      {/* Vista detalle */}
      {recetaDetalle && (
        <RecetaDetalle
          receta={recetaDetalle}
          onClose={() => setRecetaDetalle(null)}
          onGuardar={handleGuardar}
          yaGuardada={isRecetaGuardada(recetaDetalle.id)}
        />
      )}

      <Toast message={toast.message} visible={toast.visible} onHide={() => setToast({ ...toast, visible: false })} />
    </div>
  )
}
