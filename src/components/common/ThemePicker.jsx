import { useEffect, useState } from 'react'

const THEMES = [
  {
    id: 1,
    name: 'Dark & Luxury',
    emoji: '🖤',
    vars: {
      '--color-bg-main': '#0F0F0F',
      '--color-bg-card': '#1A1A1A',
      '--color-primary': '#C9A84C',
      '--color-primary-light': '#E8C97A',
      '--color-accent': '#E8C97A',
      '--color-text-main': '#F5F5F0',
      '--color-text-muted': '#9A9A90',
      '--color-border': '#2A2A2A',
      '--color-nav-bg': '#141414',
    },
  },
  {
    id: 2,
    name: 'Warm Cream',
    emoji: '🍂',
    vars: {
      '--color-bg-main': '#FAF7F2',
      '--color-bg-card': '#FFFFFF',
      '--color-primary': '#C45C26',
      '--color-primary-light': '#D97842',
      '--color-accent': '#E8A87C',
      '--color-text-main': '#2C2416',
      '--color-text-muted': '#8B7355',
      '--color-border': '#E8DFD0',
      '--color-nav-bg': '#FFFFFF',
    },
  },
  {
    id: 3,
    name: 'Midnight Blue',
    emoji: '🌙',
    vars: {
      '--color-bg-main': '#F8F9FB',
      '--color-bg-card': '#FFFFFF',
      '--color-primary': '#1B2B4B',
      '--color-primary-light': '#2D4478',
      '--color-accent': '#C9A84C',
      '--color-text-main': '#1B2B4B',
      '--color-text-muted': '#6B7A99',
      '--color-border': '#E2E8F0',
      '--color-nav-bg': '#FFFFFF',
    },
  },
  {
    id: 4,
    name: 'Morado & Lavanda',
    emoji: '💜',
    vars: {
      '--color-bg-main': '#FAF8FF',
      '--color-bg-card': '#FFFFFF',
      '--color-primary': '#4A2C6E',
      '--color-primary-light': '#6B44A0',
      '--color-accent': '#9B72CF',
      '--color-text-main': '#2D1B45',
      '--color-text-muted': '#7B6B95',
      '--color-border': '#E8E0F5',
      '--color-nav-bg': '#FFFFFF',
    },
  },
]

export default function ThemePicker() {
  const [active, setActive] = useState(
    () => parseInt(localStorage.getItem('preview-theme') || '1')
  )
  const [open, setOpen] = useState(false)

  const applyTheme = (id) => {
    const theme = THEMES.find((t) => t.id === id)
    if (!theme) return
    const root = document.documentElement
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v))
    localStorage.setItem('preview-theme', id)
    setActive(id)
  }

  useEffect(() => {
    applyTheme(active)
  }, [])

  return (
    <div className="fixed top-3 right-3 z-[9999]">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-lg"
        style={{ background: 'var(--color-primary)', color: 'var(--color-bg-main)' }}
        title="Cambiar tema"
      >
        🎨
      </button>

      {open && (
        <div
          className="absolute right-0 top-12 rounded-2xl shadow-xl p-3 w-52 flex flex-col gap-2"
          style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        >
          <p className="text-xs font-bold px-1" style={{ color: 'var(--color-text-muted)' }}>
            PREVIEW TEMAS
          </p>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => { applyTheme(t.id); setOpen(false) }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active === t.id ? 'var(--color-primary)' : 'transparent',
                color: active === t.id ? 'var(--color-bg-main)' : 'var(--color-text-main)',
                border: `1px solid ${active === t.id ? 'transparent' : 'var(--color-border)'}`,
              }}
            >
              <span>{t.emoji}</span>
              <span>{t.name}</span>
              {active === t.id && <span className="ml-auto">✓</span>}
            </button>
          ))}
          <p className="text-[10px] text-center px-1 pt-1" style={{ color: 'var(--color-text-muted)' }}>
            Solo preview local — no se sube a GitHub
          </p>
        </div>
      )}
    </div>
  )
}