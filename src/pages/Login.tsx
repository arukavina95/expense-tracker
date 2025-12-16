import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

type Props = { 
  onLogin?: () => void
  onSwitchToRegister: () => void
}

export default function Login({ onLogin, onSwitchToRegister }: Props) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      onLogin?.()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="hero-inner">
          <div className="hero-tag">Expense</div>
          <h1>Welcome to yours</h1>
          <p className="muted">Securely sign in to view your expenses and analytics.</p>
        </div>
      </div>

      <div className="auth-card card">
        <form onSubmit={handleSubmit} className="auth-form" aria-labelledby="login-heading">
          <h2 id="login-heading" className="visually-hidden">Log in to Expense</h2>

          <label className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              aria-label="Email"
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your secure password"
              aria-label="Password"
            />
          </label>

          {error && <p className="muted">{error}</p>}

          <div className="form-row">
            <button type="submit" className="primary">Sign in</button>
            <button type="button" className="secondary" onClick={() => { setEmail(''); setPassword(''); setError(null); }}>Clear</button>
          </div>

          <div className="auth-foot muted">
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={onSwitchToRegister}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--primary)', 
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                font: 'inherit'
              }}
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
