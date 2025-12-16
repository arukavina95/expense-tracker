import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

type Props = { 
  onRegister?: () => void
  onSwitchToLogin: () => void 
}

export default function Register({ onRegister, onSwitchToLogin }: Props) {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      await signUp(email, password)
      setSuccess(true)
      onRegister?.()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-hero">
          <div className="hero-inner">
            <div className="hero-tag">Expense</div>
            <h1>Check your email</h1>
            <p className="muted">We've sent you a confirmation link. Please check your email to verify your account.</p>
          </div>
        </div>

        <div className="auth-card card">
          <div className="auth-form">
            <p className="muted">After confirming your email, you can sign in to your account.</p>
            <button onClick={onSwitchToLogin} className="primary" style={{ marginTop: '1rem' }}>
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="hero-inner">
          <div className="hero-tag">Expense</div>
          <h1>Create account</h1>
          <p className="muted">Start tracking your expenses and get insights into your spending.</p>
        </div>
      </div>

      <div className="auth-card card">
        <form onSubmit={handleSubmit} className="auth-form" aria-labelledby="register-heading">
          <h2 id="register-heading" className="visually-hidden">Register for Expense</h2>

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
              placeholder="Minimum 6 characters"
              aria-label="Password"
              minLength={6}
            />
          </label>

          <label className="field">
            <span className="field-label">Confirm Password</span>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              aria-label="Confirm Password"
            />
          </label>

          {error && <p className="muted" style={{ color: 'var(--red)' }}>{error}</p>}

          <div className="form-row">
            <button type="submit" className="primary">Create Account</button>
            <button type="button" className="secondary" onClick={() => { setEmail(''); setPassword(''); setConfirmPassword(''); setError(null); }}>Clear</button>
          </div>

          <div className="auth-foot muted">
            Already have an account?{' '}
            <button 
              type="button" 
              onClick={onSwitchToLogin}
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
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
