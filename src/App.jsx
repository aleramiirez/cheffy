import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/layout/BottomNav'
import Lista from './pages/Lista'
import ModoCompra from './pages/ModoCompra'
import Recetas from './pages/Recetas'
import FormReceta from './pages/FormReceta'
import useStore from './store/useStore'
import { INITIAL_ITEMS } from './data/initialItems'

function AppInit() {
  const items = useStore((s) => s.items)
  const addItem = useStore((s) => s.addItem)

  useEffect(() => {
    // Solo si es la primera vez (sin items en localStorage)
    if (items.length === 0) {
      INITIAL_ITEMS.forEach((item) => {
        addItem(item.nombre, item.categoriaId, item.emoji)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen max-w-lg mx-auto bg-bg-main overflow-hidden">
        <AppInit />
        {/* Área de contenido principal con scroll */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Lista />} />
            <Route path="/compra" element={<ModoCompra />} />
            <Route path="/recetas" element={<Recetas />} />
            <Route path="/recetas/nueva" element={<FormReceta />} />
            <Route path="/recetas/editar/:id" element={<FormReceta />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Navegación inferior fija */}
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}