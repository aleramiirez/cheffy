import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/layout/BottomNav'
import Lista from './pages/Lista'
import ModoCompra from './pages/ModoCompra'
import Despensa from './pages/Despensa'
import Recetas from './pages/Recetas'
import FormReceta from './pages/FormReceta'
import FormPlato from './pages/FormPlato'
import Login from './pages/Login'
import useStore, { setCurrentUserId } from './store/useStore'
import useAuthStore from './store/useAuthStore'
import { INITIAL_ITEMS } from './data/initialItems'

function AppInit() {
  const { user } = useAuthStore()
  const items = useStore((s) => s.items)
  const addItem = useStore((s) => s.addItem)
  const loadFromSupabase = useStore((s) => s.loadFromSupabase)

  useEffect(() => {
    // Siempre actualizar el userId en el store
    setCurrentUserId(user?.id ?? null)

    if (user) {
      loadFromSupabase(user.id)
    }
    // INITIAL_ITEMS está vacío - los productos se añaden desde la app
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

function AuthLoader({ children }) {
  const { init, loading, user } = useAuthStore()

  useEffect(() => { init() }, [])

  if (loading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-bg-main">
        <div className="text-center">
          <img src="/icons/icon-192x192.png" alt="Cheffy" className="w-16 h-16 mx-auto rounded-2xl mb-3 object-contain" />
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Cargando...</p>
        </div>
      </div>
    )
  }

  return children
}

export default function App() {
  const { user } = useAuthStore()

  return (
    <BrowserRouter>
      <AuthLoader>
        {!user ? (
          <Login />
        ) : (
          <div className="flex flex-col h-[100dvh] max-w-lg mx-auto overflow-hidden bg-bg-main">
            <AppInit />
            <main className="flex-1 min-h-0 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Lista />} />
                <Route path="/compra" element={<ModoCompra />} />
                <Route path="/despensa" element={<Despensa />} />
                <Route path="/recetas" element={<Recetas />} />
                <Route path="/recetas/nueva" element={<FormReceta />} />
                <Route path="/recetas/editar/:id" element={<FormReceta />} />
                <Route path="/platos/nuevo" element={<FormPlato />} />
                <Route path="/platos/editar/:id" element={<FormPlato />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <BottomNav />
          </div>
        )}
      </AuthLoader>
    </BrowserRouter>
  )
}
