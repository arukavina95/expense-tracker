import type { FC } from 'react'
import Card from './Card'
import type { Expense } from '../data/expenses'
import { loadSettings } from '../data/settings'

function sum(arr: Expense[]) {
  return arr.reduce((s, e) => s + e.amount, 0)
}

export const SummaryCards: FC<{ expenses: Expense[] }> = ({ expenses }) => {
  const total = sum(expenses)
  const today = sum(expenses.filter(e => new Date(e.date).toDateString() === new Date().toDateString()))
  const days = new Date().getDate()
  const avg = total / Math.max(1, days)
  const settings = loadSettings()
  const budget = settings.monthlyBudget ?? null
  const empty = expenses.length === 0

  return (
    <div className="summary-grid">
      <Card>
        <div className="summary-title">Total this month</div>
        <div className="summary-value">{empty ? '—' : `€${total.toFixed(2)}`}</div>
      </Card>
      <Card>
        <div className="summary-title">Today</div>
        <div className="summary-value">{empty ? '—' : `€${today.toFixed(2)}`}</div>
      </Card>
      <Card>
        <div className="summary-title">Avg / day</div>
        <div className="summary-value">{empty ? '—' : `€${avg.toFixed(2)}`}</div>
      </Card>
      <Card>
        <div className="summary-title">Monthly budget</div>
        <div className="summary-value">{budget ? `€${budget.toFixed(0)}` : '—'}</div>
      </Card>
    </div>
  )
}

export default SummaryCards
