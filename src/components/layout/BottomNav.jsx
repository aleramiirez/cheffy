import { NavLink, useLocation } from 'react-router-dom'
import useStore from '../../store/useStore'

const tabs = [
  { to: '/', icon: '🛍️', label: 'Lista' },
  { to: '/compra', icon: '🛒', label: 'Compra' },
  { to: '/despensa', icon: '🏠', label: 'Despensa' },
  { to: '/recetas', icon: '🍳', label: 'Recetas' },
]

export default function BottomNav() {
  const location = useLocation()
  const items = useStore((s) => s.items)
  const itemsFaltantes = items.filter((i) => i.enLista).length

  // Ocultar BottomNav en pantallas de formulario de receta
  const hideOn = ['/recetas/nueva', '/recetas/editar', '/platos/nuevo', '/platos/editar']
  const shouldHide = hideOn.some((path) => location.pathname.startsWith(path))
  if (shouldHide) return null

  return (
    <nav className="flex-shrink-0 safe-bottom border-t transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-nav-bg)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = tab.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(tab.to)

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              <div
                className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all duration-200"
                style={isActive ? { backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' } : {}}
              >
                <span className="text-xl leading-none">{tab.icon}</span>
                <span
                  className="text-xs font-medium leading-none transition-colors"
                  style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                >
                  {tab.label}
                </span>
              </div>

              {/* Badge numérico en Compra */}
              {tab.to === '/compra' && itemsFaltantes > 0 && (
                <span className="absolute top-1 right-1/4 min-w-[18px] h-[18px] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                  style={{ backgroundColor: 'var(--color-accent)' }}>
                  {itemsFaltantes > 99 ? '99+' : itemsFaltantes}
                </span>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}