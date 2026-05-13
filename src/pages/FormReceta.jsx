import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useStore from '../store/useStore'

function comprimirImagen(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX = 800
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = (height / width) * MAX; width = MAX }
          else { width = (width / height) * MAX; height = MAX }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function FormReceta() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addReceta, updateReceta, recipes } = useStore()
  const fileRef = useRef(null)

  const recetaExistente = id ? recipes.find((r) => r.id === id) : null
  const esEdicion = Boolean(recetaExistente)

  const [nombre, setNombre] = useState('')
  const [foto, setFoto] = useState(null)
  const [categoriaReceta, setCategoriaReceta] = useState('')
  const [tiempoMinutos, setTiempoMinutos] = useState('')
  const [ingredientes, setIngredientes] = useState([{ nombre: '', cantidad: '' }])
  const [pasos, setPasos] = useState([''])
  const [guardando, setGuardando] = useState(false)
  const [errores, setErrores] = useState({})

  useEffect(() => {
    if (recetaExistente) {
      setNombre(recetaExistente.nombre || '')
      setFoto(recetaExistente.foto || null)
      setCategoriaReceta(recetaExistente.categoriaReceta || '')
      setTiempoMinutos(recetaExistente.tiempoMinutos?.toString() || '')
      setIngredientes(
        recetaExistente.ingredientes?.length > 0
          ? recetaExistente.ingredientes
          : [{ nombre: '', cantidad: '' }]
      )
      setPasos(recetaExistente.pasos?.length > 0 ? recetaExistente.pasos : [''])
    }
  }, [])

  const handleFoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const compressed = await comprimirImagen(file)
    setFoto(compressed)
  }

  const validar = () => {
    const errs = {}
    if (nombre.trim().length < 3) errs.nombre = 'Mínimo 3 caracteres'
    if (ingredientes.every((i) => !i.nombre.trim())) errs.ingredientes = 'Añade al menos un ingrediente'
    if (pasos.every((p) => !p.trim())) errs.pasos = 'Añade al menos un paso'
    setErrores(errs)
    return Object.keys(errs).length === 0
  }

  const handleGuardar = () => {
    if (!validar()) return
    setGuardando(true)
    const data = {
      nombre: nombre.trim(),
      fuente: 'propia',
      foto: foto || null,
      categoriaReceta: categoriaReceta.trim(),
      tiempoMinutos: tiempoMinutos ? parseInt(tiempoMinutos) : null,
      ingredientes: ingredientes.filter((i) => i.nombre.trim()),
      pasos: pasos.filter((p) => p.trim()),
      guardada: true,
    }
    if (esEdicion) {
      updateReceta(id, data)
    } else {
      addReceta(data)
    }
    navigate('/recetas')
  }

  // Ingredientes
  const addIngrediente = () => setIngredientes([...ingredientes, { nombre: '', cantidad: '' }])
  const removeIngrediente = (i) => setIngredientes(ingredientes.filter((_, idx) => idx !== i))
  const updateIngrediente = (i, field, value) => {
    setIngredientes(ingredientes.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing))
  }

  // Pasos
  const addPaso = () => setPasos([...pasos, ''])
  const removePaso = (i) => setPasos(pasos.filter((_, idx) => idx !== i))
  const updatePaso = (i, value) => setPasos(pasos.map((p, idx) => idx === i ? value : p))

  return (
    <div className="flex flex-col h-full bg-bg-main">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-4 pb-3 bg-bg-main sticky top-0 z-10 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-text-main font-bold"
        >
          ←
        </button>
        <h1 className="flex-1 text-lg font-bold text-text-main">
          {esEdicion ? 'Editar receta' : 'Nueva receta'}
        </h1>
        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="btn-primary py-2 px-4 text-sm disabled:opacity-60"
        >
          {guardando ? '...' : '✅ Guardar'}
        </button>
      </header>

      {/* Formulario con scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-8">

        {/* Foto */}
        <div>
          <label className="block text-sm font-semibold text-text-main mb-2">Foto (opcional)</label>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFoto} />
          {foto ? (
            <div className="relative">
              <img src={foto} alt="preview" className="w-full h-48 object-cover rounded-2xl" />
              <button
                onClick={() => setFoto(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-36 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-text-muted hover:border-primary/40 transition-colors"
            >
              <span className="text-3xl">📷</span>
              <span className="text-sm">Toca para añadir una foto</span>
            </button>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-text-main mb-2">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            className="input-base"
            placeholder="Ej: Tortilla de patatas"
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); setErrores((prev) => ({ ...prev, nombre: '' })) }}
          />
          {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
        </div>

        {/* Categoría y tiempo en fila */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Categoría</label>
            <input
              className="input-base"
              placeholder="Ej: Pasta, Pollo..."
              value={categoriaReceta}
              onChange={(e) => setCategoriaReceta(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Tiempo (min)</label>
            <input
              className="input-base"
              placeholder="45"
              type="number"
              min="1"
              value={tiempoMinutos}
              onChange={(e) => setTiempoMinutos(e.target.value)}
            />
          </div>
        </div>

        {/* Ingredientes */}
        <div>
          <label className="block text-sm font-semibold text-text-main mb-2">
            Ingredientes <span className="text-red-500">*</span>
          </label>
          {errores.ingredientes && <p className="text-red-500 text-xs mb-2">{errores.ingredientes}</p>}
          <div className="space-y-2">
            {ingredientes.map((ing, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className="input-base w-24 flex-shrink-0 text-sm py-2"
                  placeholder="Cant."
                  value={ing.cantidad}
                  onChange={(e) => updateIngrediente(i, 'cantidad', e.target.value)}
                />
                <input
                  className="input-base flex-1 text-sm py-2"
                  placeholder="Ingrediente"
                  value={ing.nombre}
                  onChange={(e) => { updateIngrediente(i, 'nombre', e.target.value); setErrores((prev) => ({ ...prev, ingredientes: '' })) }}
                />
                {ingredientes.length > 1 && (
                  <button onClick={() => removeIngrediente(i)} className="w-8 h-8 flex items-center justify-center text-red-400 flex-shrink-0">
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addIngrediente}
            className="mt-2 flex items-center gap-1.5 text-primary text-sm font-medium py-2"
          >
            <span>➕</span> Añadir ingrediente
          </button>
        </div>

        {/* Pasos */}
        <div>
          <label className="block text-sm font-semibold text-text-main mb-2">
            Preparación <span className="text-red-500">*</span>
          </label>
          {errores.pasos && <p className="text-red-500 text-xs mb-2">{errores.pasos}</p>}
          <div className="space-y-3">
            {pasos.map((paso, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="flex-shrink-0 w-7 h-7 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center mt-2">
                  {i + 1}
                </span>
                <textarea
                  className="input-base flex-1 text-sm resize-none py-2"
                  placeholder={`Paso ${i + 1}...`}
                  rows={2}
                  value={paso}
                  onChange={(e) => { updatePaso(i, e.target.value); setErrores((prev) => ({ ...prev, pasos: '' })) }}
                />
                {pasos.length > 1 && (
                  <button onClick={() => removePaso(i)} className="w-8 h-8 flex items-center justify-center text-red-400 flex-shrink-0 mt-1">
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addPaso}
            className="mt-2 flex items-center gap-1.5 text-primary text-sm font-medium py-2"
          >
            <span>➕</span> Añadir paso
          </button>
        </div>

      </div>
    </div>
  )
}
