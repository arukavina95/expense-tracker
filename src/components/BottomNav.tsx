import type { FC } from 'react'
import { DashboardIcon, ExpensesIcon, AnalyticsIcon, SettingsIcon } from './Icons'
import { useAuth } from '../auth/AuthContext'
import type { Page } from '../types/page'

export const BottomNav: FC<{
  current: Page
  onNavigate: (p: Page) => void
}> = ({ current, onNavigate }) => {
  const { user } = useAuth()
  if (!user) return null

  return (
    <footer className="nav-bottom" role="navigation">
      <button className={current === 'dashboard' ? 'active' : ''} onClick={() => onNavigate('dashboard')}>
        <DashboardIcon />
      </button>
      <button className={current === 'expenses' ? 'active' : ''} onClick={() => onNavigate('expenses')}>
        <ExpensesIcon />
      </button>
      <button className={current === 'analytics' ? 'active' : ''} onClick={() => onNavigate('analytics')}>
        <AnalyticsIcon />
      </button>
      <button className={current === 'settings' ? 'active' : ''} onClick={() => onNavigate('settings')}>
        <SettingsIcon />
      </button>
    </footer>
  )
}

export default BottomNav
