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
    <div className="page settings-page">
      {/* =====================
          ACCOUNT
          ===================== */}
      <div className="card-panel">
        <h3>Account</h3>

        <div className="settings-row">
          <span className="muted">Signed in as</span>
          <strong>{user?.email}</strong>
        </div>

        <button className="secondary" onClick={signOut}>
          Log out
        </button>
      </div>

      {/* =====================
          PREFERENCES
          ===================== */}
      <div className="card-panel">
        <h3>Preferences</h3>

        <div className="field-row">
          <label>Currency</label>
          <select
            value={settings.currency ?? 'EUR'}
            onChange={e => update({ currency: e.target.value })}
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>

        <div className="field-row">
          <label>Monthly budget</label>
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
          />
        </div>
      </div>

      {/* =====================
          CATEGORIES
          ===================== */}
      <div className="card-panel">
        <h3>Categories</h3>
        <p className="muted">
          Used in Expenses and Analytics. Separate with commas.
        </p>

        <input
          placeholder="Food, Rent, Car, Fun"
          value={(settings.categories ?? []).join(', ')}
          onChange={e =>
            update({
              categories: e.target.value
                .split(',')
                .map(s => s.trim())
                .filter(Boolean),
            })
          }
        />
      </div>

      {/* =====================
          ACTIONS
          ===================== */}
      <div className="settings-actions">
        <button onClick={persist}>Save settings</button>
      </div>
    </div>
  )
}
