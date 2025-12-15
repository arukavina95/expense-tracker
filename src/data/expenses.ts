import { supabase } from '../lib/supabase'

/**
 * Shared Expense type (single source of truth)
 */
export type Expense = {
  id: string
  user_id: string
  amount: number
  category: string
  date: string
  note: string | null
  created_at: string
}

/**
 * Get all expenses for current user
 * RLS ensures only own rows are returned
 */
export async function getExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('getExpenses error:', error)
    throw error
  }

  return data ?? []
}

/**
 * Add new expense
 * user_id is injected automatically via RLS (auth.uid())
 */
export async function addExpense(expense: {
  amount: number
  category: string
  date: string
  note?: string
}): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .insert(expense)

  if (error) {
    console.error('addExpense error:', error)
    throw error
  }
}

/**
 * Delete expense (only own row allowed by RLS)
 */
export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('deleteExpense error:', error)
    throw error
  }
}

/**
 * Update expense (only own row allowed by RLS)
 */
export async function updateExpense(
  id: string,
  updates: Partial<Pick<Expense, 'amount' | 'category' | 'date' | 'note'>>
): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('updateExpense error:', error)
    throw error
  }
}
