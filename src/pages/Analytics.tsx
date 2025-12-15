import { useEffect, useState } from 'react'
import { PieChart } from '../components/Charts'
import { getExpenses, type Expense } from '../data/expenses'

export default function Analytics() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    getExpenses()
      .then(setExpenses)
      .catch(console.error)
  }, [])

  const totalsByCategory = expenses.reduce(
    (acc: Record<string, number>, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    },
    {}
  )

  return (
    <div className="page">
      <section className="analytics-grid">
        <div className="card-panel">
          <h3>By category</h3>
          <PieChart expenses={expenses} />
        </div>

        <div className="card-panel">
          <h3>Top categories</h3>
          <ul>
            {Object.entries(totalsByCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, total]) => (
                <li key={cat}>
                  {cat}: €{total.toFixed(2)}
                </li>
              ))}
          </ul>

          {expenses.length === 0 && (
            <p className="muted">No data yet</p>
          )}
        </div>
      </section>
    </div>
  )
}
