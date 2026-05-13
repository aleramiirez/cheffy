import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore, { CATEGORIES } from '../store/useStore'
import Toast from '../components/common/Toast'

function ItemCompra({ item, tachado, onToggle }) {
  return (
    <button
      onClick={() => onToggle(item.id)}
      className={`w-full flex items-center gap-4 px-4 py-4 transition-all duration-200 active:scale-[0.98] text-left ${
        tachado ? 'bg-green-50' : 'bg-white hover:bg-gray-50'
      }`}
    >
      <span className={`text-2xl flex-shrink-0 leading-none transition-opacity ${tachado ? 'opacity-40' : ''}`}>
        {item.emoji}
      </span>
      <span className={`flex-1 font-medium text-base transition-all duration-200 ${
        tachado ? 'line-through text-gray-400' : 'text-text-main'
      }`}>
        {item.nombre}
      </span>
      {tachado && (
        <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          ✓
        </span>
      )}
    </button>
  )
}

export default function ModoCompra() {
  const navigate = useNavigate()
  const items = useStore((s) => s.items)
  const itemsTachados = useStore((s) => s.itemsTachados)
  const toggleTachadoCompra = useStore((s) => s.toggleTachadoCompra)
  const confirmarCompra = useStore((s) => s.confirmarCompra)
  const [toast, setToast] = useState({ visible: false, message: '' })

  const itemsParaComprar = items.filter((i) => i.enLista)
  const totalItems = itemsParaComprar.length
  const totalTachados = itemsTachados.length
  const progreso = totalItems > 0 ? (totalTachados / totalItems) * 100 : 0

  // Agrupar por categoría
  const grupos = CATEGORIES
    .map((cat) => ({
      categoria: cat,
      items: itemsParaComprar.filter((i) => i.categoriaId === cat.id),
    }))
    .filter((g) => g.items.length > 0)

  const handleConfirmar = () => {
    if (navigator.vibrate) navigator.vibrate(50)
    confirmarCompra()
    setToast({ visible: true, message: '✅ ¡Compra completada!' })
  }

  // Pantalla vacía
  if (totalItems === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <span className="text-7xl mb-6">🎉</span>
          <h2 className="text-xl font-bold text-text-main mb-2">¡Todo en orden!</h2>
          <p className="text-text-muted text-sm mb-8">
            No tienes nada pendiente de comprar. Ve a tu lista para marcar lo que te falta.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Ir a mi lista →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Barra de progreso con contador integrado */}
      <div className="px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Progreso</span>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {totalTachados}/{totalItems}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* Lista de productos agrupados */}
      <div className="flex-1 overflow-y-auto pb-32">
        {grupos.map(({ categoria, items: catItems }) => (
          <div key={categoria.id} className="mb-3 mx-4">
            <div className="flex items-center gap-2 px-1 py-2">
              <span className="text-base">{categoria.emoji}</span>
              <span className="text-sm font-semibold text-text-muted uppercase tracking-wide">
                {categoria.nombre}
              </span>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-card border border-gray-100 divide-y divide-gray-50">
              {catItems.map((item) => (
                <ItemCompra
                  key={item.id}
                  item={item}
                  tachado={itemsTachados.includes(item.id)}
                  onToggle={toggleTachadoCompra}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Botón confirmar compra (flotante, solo visible si hay tachados) */}
      {totalTachados > 0 && (
        <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-20">
          <button
            onClick={handleConfirmar}
            className="w-full bg-primary text-white font-semibold py-4 rounded-2xl shadow-fab flex items-center justify-center gap-2 text-base active:scale-[0.98] transition-transform"
          >
            <span>🏁</span>
            Ya he comprado ({totalTachados})
          </button>
        </div>
      )}

      <Toast
        message={toast.message}
        visible={toast.visible}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </div>
  )
}