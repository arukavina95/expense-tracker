import type { FC } from 'react'
import { EditIcon, DeleteIcon } from './Icons'
import type { Expense } from '../data/expenses'


export const ExspenseList: FC<{
  expenses: Expense[]
  limit?: number
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}> = ({ expenses, limit, onEdit, onDelete }) => {
  const list = typeof limit === 'number' ? expenses.slice(0, limit) : expenses
  return (
    <div className="expense-list">
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
          {list.map(e => (
            <tr key={e.id}>
              <td className="amount">€{e.amount.toFixed(2)}</td>
              <td>{e.category}</td>
              <td>{new Date(e.date).toLocaleDateString()}</td>
              <td>{e.note}</td>
              <td className="actions">
                <button className="icon-btn" aria-label="Edit" title="Edit" onClick={() => onEdit?.(e.id)}><EditIcon/></button>
                <button className="icon-btn" aria-label="Delete" title="Delete" onClick={() => onDelete?.(e.id)}><DeleteIcon/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExspenseList
