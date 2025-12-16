import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
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

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')

  /* =========================
     LOAD + REALTIME
     ========================= */
  async function load() {
    try {
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
    let mounted = true

    const init = async () => {
      if (!mounted) return
      await load()
    }

    init()

    const channel = supabase
      .channel('expenses-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'expenses' },
        () => load()
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  /* =========================
     TOTAL
     ========================= */
  const total = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  )

  /* =========================
     ADD
     ========================= */
  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()

    const normalized = amount.replace(',', '.')
    const value = Number(normalized)

    if (isNaN(value) || value <= 0) {
      setError('Amount must be a positive number.')
      return
    }

    try {
      setSaving(true)
      setError(null)

      await addExpense({
        amount: value,
        category,
        date: new Date(date).toISOString(),
        note: note.trim() || undefined,
      })

      setAmount('')
      setNote('')
    } catch (e: any) {
      console.error(e)
      setError(e?.message ?? 'Failed to add expense')
    } finally {
      setSaving(false)
    }
  }

  /* =========================
     DELETE
     ========================= */
  async function onDelete(id: string) {
    const prev = expenses
    setExpenses(prev.filter(e => e.id !== id))

    try {
      await deleteExpense(id)
    } catch (e: any) {
      console.error(e)
      setError('Failed to delete expense')
      setExpenses(prev) // rollback
    }
  }

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="page">
      {/* ADD */}
      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>Add expense</h3>
          <span className="muted">Total: €{total.toFixed(2)}</span>
        </div>

        {error && <div className="muted" style={{ marginTop: 8 }}>{error}</div>}

        <form className="expense-form" onSubmit={onSubmit}>
          <input
            placeholder="Amount"
            inputMode="decimal"
            pattern="[0-9.,]*"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input type="date" value={date} onChange={e => setDate(e.target.value)} />

          <input
            placeholder="Note"
            value={note}
            onChange={e => setNote(e.target.value)}
          />

          <button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Add'}
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="section">
        <div className="card-panel recent-card">
          <h3>All expenses</h3>

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
                    <td>{e.note || '—'}</td>
                    <td className="actions">
                      <button
                        className="icon-btn"
                        type="button"
                        onClick={() => onDelete(e.id)}
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
