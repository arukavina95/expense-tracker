import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getExpenses, type Expense } from '../data/expenses'
import { loadSettings } from '../data/settings'

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  /* =========================
     LOAD + REALTIME
     ========================= */
  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const data = await getExpenses()
        if (mounted) setExpenses(data)
      } catch (e) {
        console.error(e)
      }
    }

    load()

    // ✅ REALTIME LISTENER
    const channel = supabase
      .channel('expenses-dashboard')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
        },
        load
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  /* =========================
     DATE HELPERS
     ========================= */
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const todayDay = now.getDate()

  /* =========================
     FILTERED DATA
     ========================= */
  const monthlyExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = new Date(e.date)
      return (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      )
    })
  }, [expenses, currentMonth, currentYear])

  /* =========================
     CALCULATIONS
     ========================= */
  const totalMonth = useMemo(
    () => monthlyExpenses.reduce((s, e) => s + e.amount, 0),
    [monthlyExpenses]
  )

  const todayTotal = useMemo(
    () =>
      monthlyExpenses
        .filter(e => e.date.slice(0, 10) === todayStr)
        .reduce((s, e) => s + e.amount, 0),
    [monthlyExpenses, todayStr]
  )

  // ✅ ispravno: dijelimo s proteklim danima
  const avgPerDay = useMemo(
    () => (todayDay > 0 ? totalMonth / todayDay : 0),
    [totalMonth, todayDay]
  )

  /* =========================
     BUDGET
     ========================= */
  const settings = useMemo(() => loadSettings(), [])
  const budget = settings.monthlyBudget ?? null

  const percent =
    budget && budget > 0
      ? Math.min(100, Math.round((totalMonth / budget) * 100))
      : null

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="page">
      <section className="summary-grid">
        <div className="card-panel">
          <div className="summary-title">Total this month</div>
          <div className="summary-value">€{totalMonth.toFixed(2)}</div>
        </div>

        <div className="card-panel">
          <div className="summary-title">Today</div>
          <div className="summary-value">€{todayTotal.toFixed(2)}</div>
        </div>

        <div className="card-panel">
          <div className="summary-title">Avg / day</div>
          <div className="summary-value">€{avgPerDay.toFixed(2)}</div>
        </div>

        <div className="card-panel">
          <div className="summary-title">Monthly budget</div>

          {!budget && <div className="muted">Not set</div>}

          {budget && (
            <>
              <div className="summary-value">
                €{totalMonth.toFixed(0)} / €{budget.toFixed(0)}
              </div>

              <div className="budget-bar">
                <div
                  className={`budget-fill ${
                    percent! >= 90
                      ? 'danger'
                      : percent! >= 75
                      ? 'warn'
                      : ''
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="muted">{percent}% used</div>
            </>
          )}
        </div>
      </section>

      <section className="section">
        <div className="card-panel chart-card">
          <div className="chart-title">
            Daily spending (this month)
          </div>
          <div className="chart-wrap" />
        </div>
      </section>

      <section className="section">
        <div className="card-panel recent-card">
          <h3>Recent expenses</h3>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {expenses.slice(0, 5).map(e => (
                  <tr key={e.id}>
                    <td className="amount">€{e.amount.toFixed(2)}</td>
                    <td>{e.category}</td>
                    <td>{new Date(e.date).toLocaleDateString()}</td>
                    <td>{e.note || '—'}</td>
                  </tr>
                ))}

                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="muted">
                      No expenses yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
