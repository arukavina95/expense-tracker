export type UserSettings = {
  email?: string
  currency?: string
  defaultCategory?: string
  monthlyBudget?: number | null
  categories?: string[]
}

const KEY = 'expense_settings'

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveSettings(settings: UserSettings) {
  localStorage.setItem(KEY, JSON.stringify(settings))
}
