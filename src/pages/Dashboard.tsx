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
    <div className="container">
      <div className="page">
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Dashboard
          </h1>
          <p className="muted">Track your spending and stay on budget</p>
        </div>

        {/* Summary Cards */}
        <section className="summary-grid">
          <div className="card-panel">
            <div className="summary-title">💰 Total this month</div>
            <div className="summary-value">€{totalMonth.toFixed(2)}</div>
            <div className="summary-subtitle">
              {monthlyExpenses.length} transaction{monthlyExpenses.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="card-panel">
            <div className="summary-title">📅 Today</div>
            <div className="summary-value">€{todayTotal.toFixed(2)}</div>
            <div className="summary-subtitle">
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </div>
          </div>

          <div className="card-panel">
            <div className="summary-title">📊 Avg / day</div>
            <div className="summary-value">€{avgPerDay.toFixed(2)}</div>
            <div className="summary-subtitle">
              Based on {todayDay} day{todayDay !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="card-panel">
            <div className="summary-title">🎯 Monthly budget</div>

            {!budget && (
              <>
                <div className="summary-value" style={{ fontSize: '1.5rem' }}>
                  Not set
                </div>
                <div className="muted">Set budget in Settings</div>
              </>
            )}

            {budget && (
              <>
                <div className="summary-value" style={{ fontSize: '1.5rem' }}>
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

                <div className="muted" style={{ fontWeight: 600 }}>
                  {percent}% used • €{(budget - totalMonth).toFixed(0)} remaining
                </div>
              </>
            )}
          </div>
        </section>

        {/* Chart Section */}
        <section className="section">
          <div className="card-panel chart-card">
            <div className="chart-title">
              Daily spending trends
            </div>
            <div className="chart-wrap">
              Chart visualization coming soon
            </div>
          </div>
        </section>

        {/* Recent Expenses Table */}
        <section className="section">
          <div className="card-panel recent-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <h3>Recent expenses</h3>
              <span className="muted">Last 5 transactions</span>
            </div>

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
                      <td>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '8px', 
                          background: 'var(--accent-soft)',
                          color: 'var(--accent)',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}>
                          {e.category}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {new Date(e.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td style={{ color: 'var(--muted)' }}>{e.note || '—'}</td>
                    </tr>
                  ))}

                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💸</div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>No expenses yet</div>
                        <div style={{ fontSize: '0.875rem', marginTop: '8px' }}>
                          Start tracking by adding your first expense
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
