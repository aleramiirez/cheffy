import { NavLink, useLocation } from 'react-router-dom'
import useStore from '../../store/useStore'

const tabs = [
  { to: '/', icon: '🛍️', label: 'Lista' },
  { to: '/compra', icon: '🛒', label: 'Compra' },
  { to: '/recetas', icon: '🍳', label: 'Recetas' },
]

export default function BottomNav() {
  const location = useLocation()
  const items = useStore((s) => s.items)
  const itemsFaltantes = items.filter((i) => i.enLista).length

  // Ocultar BottomNav en pantallas de formulario de receta
  const hideOn = ['/recetas/nueva', '/recetas/editar']
  const shouldHide = hideOn.some((path) => location.pathname.startsWith(path))
  if (shouldHide) return null

  return (
    <nav className="flex-shrink-0 bg-white border-t border-gray-100 safe-bottom">
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
              <div className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all duration-200 ${
                isActive ? 'bg-primary/10' : ''
              }`}>
                <span className="text-xl leading-none">{tab.icon}</span>
                <span className={`text-xs font-medium leading-none ${
                  isActive ? 'text-primary' : 'text-text-muted'
                }`}>
                  {tab.label}
                </span>
              </div>

              {/* Badge numérico en Compra */}
              {tab.to === '/compra' && itemsFaltantes > 0 && (
                <span className="absolute top-1 right-1/4 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
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