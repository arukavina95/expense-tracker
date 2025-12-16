import { useEffect, useState } from 'react'
import { loadSettings, saveSettings, type UserSettings } from '../data/settings'
import { useAuth } from '../auth/AuthContext'

export default function Settings() {
  const { user, signOut } = useAuth()
  const [settings, setSettings] = useState<UserSettings>({
    currency: 'EUR',
    categories: [],
  })

  useEffect(() => {
    setSettings({
      currency: 'EUR',
      categories: [],
      ...loadSettings(),
    })
  }, [])

  const update = (patch: Partial<UserSettings>) =>
    setSettings(prev => ({ ...prev, ...patch }))

  const persist = () => saveSettings(settings)

  return (
    <div className="container">
      <div className="page settings-page">
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Settings
          </h1>
          <p className="muted">Manage your account and preferences</p>
        </div>

        {/* =====================
            ACCOUNT
            ===================== */}
        <div className="card-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: '50%', 
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 900,
              color: 'white'
            }}>
              {user?.email?.[0].toUpperCase()}
            </div>
            <div>
              <h3 style={{ marginBottom: 4 }}>👤 Account</h3>
              <p className="muted" style={{ fontSize: '0.875rem' }}>
                Your profile information
              </p>
            </div>
          </div>

          <div className="settings-row" style={{ 
            padding: '16px', 
            background: 'var(--surface-hover)', 
            borderRadius: 'var(--radius)',
            marginBottom: 20
          }}>
            <span className="muted" style={{ fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Email address
            </span>
            <strong style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>
              {user?.email}
            </strong>
          </div>

          <button 
            className="secondary" 
            onClick={signOut}
            style={{ 
              width: '100%',
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            🚪 Log out
          </button>
        </div>

        {/* =====================
            PREFERENCES
            ===================== */}
        <div className="card-panel">
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 4 }}>⚙️ Preferences</h3>
            <p className="muted" style={{ fontSize: '0.875rem' }}>
              Customize your expense tracking experience
            </p>
          </div>

          <div className="settings-row">
            <label style={{ 
              fontWeight: 600, 
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              💱 Currency
            </label>
            <select
              value={settings.currency ?? 'EUR'}
              onChange={e => update({ currency: e.target.value })}
              style={{ maxWidth: '200px' }}
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          <div className="settings-row">
            <label style={{ 
              fontWeight: 600, 
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              🎯 Monthly budget
            </label>
            <input
              type="number"
              placeholder="e.g. 1000"
              value={settings.monthlyBudget ?? ''}
              onChange={e =>
                update({
                  monthlyBudget: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
              style={{ maxWidth: '200px' }}
            />
          </div>
        </div>

        {/* =====================
            CATEGORIES
            ===================== */}
        <div className="card-panel">
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 4 }}>🏷️ Categories</h3>
            <p className="muted" style={{ fontSize: '0.875rem' }}>
              Used in Expenses and Analytics. Separate with commas.
            </p>
          </div>

          <input
            placeholder="Food, Rent, Car, Fun, Shopping"
            value={(settings.categories ?? []).join(', ')}
            onChange={e =>
              update({
                categories: e.target.value
                  .split(',')
                  .map(s => s.trim())
                  .filter(Boolean),
              })
            }
            style={{ width: '100%' }}
          />

          {settings.categories && settings.categories.length > 0 && (
            <div style={{ 
              marginTop: 16, 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 8 
            }}>
              {settings.categories.map((cat, i) => (
                <span key={i} style={{
                  padding: '6px 14px',
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* =====================
            ACTIONS
            ===================== */}
        <div className="settings-actions">
          <button 
            onClick={persist}
            style={{ 
              width: '100%',
              padding: '16px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            💾 Save settings
          </button>
        </div>
      </div>
    </div>
  )
}
