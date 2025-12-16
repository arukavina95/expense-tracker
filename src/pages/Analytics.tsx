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

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0)
  const sortedCategories = Object.entries(totalsByCategory)
    .sort((a, b) => b[1] - a[1])

  return (
    <div className="container">
      <div className="page">
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Analytics
          </h1>
          <p className="muted">Visualize your spending patterns and insights</p>
        </div>

        {/* Total Overview Card */}
        <div className="card-panel" style={{ marginBottom: 24 }}>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div className="muted" style={{ 
              fontSize: '0.813rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: 12
            }}>
              📊 Total Spending
            </div>
            <div style={{ 
              fontSize: '3.5rem', 
              fontWeight: 900,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 8
            }}>
              €{totalAmount.toFixed(2)}
            </div>
            <div className="muted">
              Across {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <section className="analytics-grid">
          {/* Pie Chart */}
          <div className="card-panel">
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 4 }}>🥧 By category</h3>
              <p className="muted" style={{ fontSize: '0.875rem' }}>
                Visual breakdown of your spending
              </p>
            </div>
            
            {expenses.length > 0 ? (
              <PieChart expenses={expenses} />
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: 'var(--muted)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📈</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>
                  No data yet
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  Add expenses to see analytics
                </div>
              </div>
            )}
          </div>

          {/* Top Categories List */}
          <div className="card-panel">
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 4 }}>🏆 Top categories</h3>
              <p className="muted" style={{ fontSize: '0.875rem' }}>
                Ranked by total spending amount
              </p>
            </div>

            {expenses.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: 'var(--muted)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📊</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>
                  No data yet
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  Start tracking expenses to see insights
                </div>
              </div>
            )}

            {expenses.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sortedCategories.map(([cat, total], index) => {
                  const percentage = ((total / totalAmount) * 100).toFixed(1)
                  const colors = [
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  ]
                  
                  return (
                    <div 
                      key={cat}
                      style={{
                        padding: '16px 20px',
                        background: 'var(--surface-hover)',
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all var(--transition-base)',
                        border: '1px solid var(--border)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Background percentage bar */}
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${percentage}%`,
                        background: colors[index % colors.length],
                        opacity: 0.1,
                        transition: 'width var(--transition-slow)'
                      }} />
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: '12px',
                          background: colors[index % colors.length],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          color: 'white',
                          flexShrink: 0
                        }}>
                          #{index + 1}
                        </div>
                        <div>
                          <div style={{ 
                            fontWeight: 700, 
                            fontSize: '1.125rem',
                            color: 'var(--text-primary)',
                            marginBottom: 2
                          }}>
                            {cat}
                          </div>
                          <div className="muted" style={{ fontSize: '0.813rem' }}>
                            {percentage}% of total
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 900,
                        background: colors[index % colors.length],
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        position: 'relative'
                      }}>
                        €{total.toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
