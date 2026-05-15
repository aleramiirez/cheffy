import { useState, useEffect } from 'react'
import useAuthStore from '../store/useAuthStore'

export default function Login() {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, error, clearError, loading } = useAuthStore()
  const [modo, setModo] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { clearError() }, [modo])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    if (modo === 'login') {
      await loginWithEmail(email, password)
    } else {
      const { error: err } = await registerWithEmail(email, password)
      if (!err) setEnviado(true)
    }
    setSubmitting(false)
  }

  if (enviado) {
    return (
      <div className="flex flex-col h-[100dvh] items-center justify-center px-8 text-center bg-bg-main">
        <span className="text-6xl mb-4">📧</span>
        <h2 className="text-xl font-bold text-text-main mb-2">¡Revisa tu email!</h2>
        <p className="text-text-muted text-sm">Te hemos enviado un enlace de confirmación. Haz click en él y luego inicia sesión.</p>
        <button onClick={() => { setEnviado(false); setModo('login') }} className="mt-6 btn-secondary">
          Volver al login
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[100dvh] items-center justify-center px-6 bg-bg-main">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/icons/icon-192x192.png" alt="Cheffy" className="w-20 h-20 mx-auto rounded-3xl mb-3 object-contain" />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>Cheffy</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Tu cocina inteligente</p>
        </div>

        {/* Botón Google */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border-2 font-semibold mb-4 transition-all active:scale-95"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-main)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>o con email</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
        </div>

        {/* Formulario email */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            className="input-base"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            className="input-base"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
          />

          {error && (
            <p className="text-red-500 text-sm px-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-3.5 disabled:opacity-60"
          >
            {submitting ? '...' : modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

        {/* Toggle login/register */}
        <p className="text-center text-sm mt-4" style={{ color: 'var(--color-text-muted)' }}>
          {modo === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button
            type="button"
            onClick={() => setModo(modo === 'login' ? 'register' : 'login')}
            className="font-semibold underline"
            style={{ color: 'var(--color-primary)' }}
          >
            {modo === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </p>
      </div>
    </div>
  )
}
