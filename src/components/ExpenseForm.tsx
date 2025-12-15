import { useState, type FormEvent } from 'react'

const categories: string[] = [
  'Food',
  'Transport',
  'Rent',
  'Utilities',
  'Entertainment',
  'Other',
]

type NewExpense = {
  amount: number
  category: string
  date: string
  note?: string
}

export const ExpenseForm: React.FC<{ onAdd: (e: NewExpense) => void }> = ({ onAdd }) => {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')

  const submit = (ev: FormEvent) => {
    ev.preventDefault()

    const amt = parseFloat(amount)
    if (!amt) return

    onAdd({
      amount: amt,
      category,
      date,
      note: note || undefined,
    })

    setAmount('')
    setNote('')
  }

  return (
    <form className="expense-form" onSubmit={submit}>
      <input
        placeholder="Amount"
        inputMode="decimal"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <select value={category} onChange={e => setCategory(e.target.value)}>
        {categories.map((c: string) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <input type="date" value={date} onChange={e => setDate(e.target.value)} />

      <input
        placeholder="Note (optional)"
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      <button type="submit">Add</button>
    </form>
  )
}

export default ExpenseForm
