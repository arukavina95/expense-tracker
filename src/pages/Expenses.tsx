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
    <div className="page">
      {/* ADD */}
      <div className="card-panel">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 12,
          }}
        >
          <h3>Add expense</h3>
          <span className="muted">Total: €{total.toFixed(2)}</span>
        </div>

        {error && (
          <div className="muted" style={{ marginTop: 8 }}>
            {error}
          </div>
        )}

        <form
          className="expense-form"
          onSubmit={onSubmit}
          style={{ marginTop: 12 }}
        >
          <input
            placeholder="Amount"
            inputMode="decimal"
            pattern="[0-9.,]*"
            value={amount}
            onChange={e => setAmount(e.target.value)}
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
          />

          <input
            placeholder="Note"
            value={note}
            onChange={e => setNote(e.target.value)}
          />

          <button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Add'}
          </button>

          <button
            type="button"
            className="secondary"
            onClick={load}
            disabled={loading || saving}
          >
            Refresh
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="section">
        <div className="card-panel recent-card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <h3>All expenses</h3>
            <span className="muted">
              {loading ? 'Loading…' : `${expenses.length} items`}
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
                  <th />
                </tr>
              </thead>

              <tbody>
                {!loading && expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="muted">
                      No expenses yet
                    </td>
                  </tr>
                )}

                {expenses.map(e => (
                  <tr key={e.id}>
                    <td className="amount">€{e.amount.toFixed(2)}</td>
                    <td>{e.category}</td>
                    <td>{new Date(e.date).toLocaleDateString()}</td>
                    <td>{e.note ?? '—'}</td>
                    <td className="actions">
                      <button
                        className="icon-btn"
                        type="button"
                        onClick={() => onDelete(e.id)}
                        title="Delete"
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
  )
}
