import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  addExpense,
  deleteExpense,
  getExpenses,
  type Expense,
} from '../data/expenses'

const categories = [
  'Piće i hrana',
  'Prijevoz (auto)',
  'Stan',
  'Gluposti',
  'Cigare',
  'Ostalo',
]

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // form state
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')

  /* =========================
     LOAD FROM DB
     ========================= */
  async function load() {
    try {
      setError(null)
      setLoading(true)
      const data = await getExpenses()
      setExpenses(data)
    } catch (e: any) {
      console.error(e)
      setError(e?.message ?? 'Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  /* =========================
     TOTAL
     ========================= */
  const total = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  )

  /* =========================
     ADD (OPTIMISTIC)
     ========================= */
  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()

    const normalized = amount.replace(',', '.')
    const value = Number(normalized)

    if (!value || value <= 0) {
      setError('Amount must be a positive number.')
      return
    }

    const optimistic: Expense = {
      id: crypto.randomUUID(), // privremeni ID
      user_id: 'local',
      amount: value,
      category,
      date: new Date(date).toISOString(),
      note: note.trim() || null,
      created_at: new Date().toISOString(),
    }

    try {
      setError(null)
      setSaving(true)

      // ✅ 1. ODMAH PRIKAŽI
      setExpenses(prev => [optimistic, ...prev])

      // ✅ 2. UPIS U BAZU
      await addExpense({
        amount: value,
        category,
        date: optimistic.date,
        note: optimistic.note ?? undefined,
      })

      setAmount('')
      setNote('')
    } catch (e: any) {
      console.error(e)
      setError(e?.message ?? 'Failed to add expense')

      // ⛔ rollback
      setExpenses(prev => prev.filter(e => e.id !== optimistic.id))
    } finally {
      setSaving(false)
    }
  }

  /* =========================
     DELETE (OPTIMISTIC)
     ========================= */
  async function onDelete(id: string) {
    const previous = expenses

    try {
      setError(null)

      // ✅ 1. ODMAH MAKNUTI IZ UI
      setExpenses(prev => prev.filter(e => e.id !== id))

      // ✅ 2. BRISANJE IZ BAZE
      await deleteExpense(id)
    } catch (e: any) {
      console.error(e)
      setError(e?.message ?? 'Failed to delete expense')

      // ⛔ rollback
      setExpenses(previous)
    }
  }

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="container">
      <div className="page">
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Expenses
          </h1>
          <p className="muted">Manage and track all your expenses</p>
        </div>

        {/* ADD EXPENSE FORM */}
        <div className="card-panel">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <div>
              <h3 style={{ marginBottom: 4 }}>➕ Add new expense</h3>
              <p className="muted" style={{ fontSize: '0.875rem' }}>
                Quick entry for tracking your spending
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 4 }}>
                TOTAL
              </div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 900,
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                €{total.toFixed(2)}
              </div>
            </div>
          </div>

          {error && (
            <div style={{ 
              padding: '12px 16px', 
              background: 'var(--danger-soft)', 
              color: 'var(--danger)',
              borderRadius: 'var(--radius)',
              marginBottom: 16,
              fontSize: '0.875rem',
              fontWeight: 600
            }}>
              ⚠️ {error}
            </div>
          )}

          <form className="expense-form" onSubmit={onSubmit}>
            <input
              placeholder="Amount (€)"
              inputMode="decimal"
              pattern="[0-9.,]*"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              style={{ fontWeight: 600 }}
            />

            <select value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />

            <input
              placeholder="Note (optional)"
              value={note}
              onChange={e => setNote(e.target.value)}
            />

            <button type="submit" disabled={saving}>
              {saving ? '💫 Saving…' : '✅ Add'}
            </button>

            <button
              type="button"
              className="secondary"
              onClick={load}
              disabled={loading || saving}
              title="Refresh list"
            >
              🔄 Refresh
            </button>
          </form>
        </div>

        {/* ALL EXPENSES LIST */}
        <div className="section">
          <div className="card-panel recent-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <div>
                <h3 style={{ marginBottom: 4 }}>📋 All expenses</h3>
                <p className="muted" style={{ fontSize: '0.875rem' }}>
                  Complete transaction history
                </p>
              </div>
              <span style={{
                padding: '6px 14px',
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 700
              }}>
                {loading ? 'Loading…' : `${expenses.length} item${expenses.length !== 1 ? 's' : ''}`}
              </span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Note</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {!loading && expenses.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                          No expenses yet
                        </div>
                        <div className="muted">
                          Add your first expense using the form above
                        </div>
                      </td>
                    </tr>
                  )}

                  {expenses.map(e => (
                    <tr key={e.id}>
                      <td className="amount">€{e.amount.toFixed(2)}</td>
                      <td>
                        <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '10px', 
                          background: 'var(--accent-soft)',
                          color: 'var(--accent)',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          whiteSpace: 'nowrap'
                        }}>
                          {e.category}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {new Date(e.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td style={{ color: 'var(--muted)', maxWidth: '300px' }}>
                        {e.note || '—'}
                      </td>
                      <td className="actions">
                        <button
                          className="icon-btn"
                          type="button"
                          onClick={() => onDelete(e.id)}
                          title="Delete expense"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
