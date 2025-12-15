import type { Expense } from '../data/expenses'

type Props = {
  expenses: Expense[]
}

const COLORS = [
  '#4f46e5',
  '#22c55e',
  '#f97316',
  '#e11d48',
  '#06b6d4',
  '#a855f7',
]

export function PieChart({ expenses }: Props) {
  if (expenses.length === 0) {
    return <p className="muted">No data</p>
  }

  const totals = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})

  const entries = Object.entries(totals)
  const total = entries.reduce((s, [, v]) => s + v, 0)

  let cumulative = 0

  const slices = entries.map(([cat, value], i) => {
    const start = cumulative / total
    cumulative += value
    const end = cumulative / total

    return {
      cat,
      value,
      start,
      end,
      color: COLORS[i % COLORS.length],
    }
  })

  const radius = 60
  const cx = 70
  const cy = 70

  const arc = (start: number, end: number) => {
    const startAngle = 2 * Math.PI * start
    const endAngle = 2 * Math.PI * end

    const x1 = cx + radius * Math.cos(startAngle)
    const y1 = cy + radius * Math.sin(startAngle)
    const x2 = cx + radius * Math.cos(endAngle)
    const y2 = cy + radius * Math.sin(endAngle)

    const largeArc = end - start > 0.5 ? 1 : 0

    return `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `
  }

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <svg width={140} height={140}>
        {slices.map(s => (
          <path
            key={s.cat}
            d={arc(s.start, s.end)}
            fill={s.color}
          />
        ))}
      </svg>

      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {slices.map(s => (
          <li key={s.cat} style={{ marginBottom: 6 }}>
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                background: s.color,
                borderRadius: '50%',
                marginRight: 8,
              }}
            />
            {s.cat} – €{s.value.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  )
}
