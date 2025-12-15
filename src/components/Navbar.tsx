import type { FC } from 'react'
import { DashboardIcon, ExpensesIcon, AnalyticsIcon, SettingsIcon } from './Icons'
import { useAuth } from '../auth/AuthContext'
import type { Page } from '../types/page'

export const Navbar: FC<{
  current: Page
  onNavigate: (p: Page) => void
}> = ({ current, onNavigate }) => {
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <header className="nav-top">
      <div className="nav-inner">
        <div className="brand" onClick={() => onNavigate('dashboard')}>
          <div className="logo-mark">💸</div>
          <div className="brand-text">Expense</div>
        </div>

        <nav className="nav-links">
          <button className={current === 'dashboard' ? 'active' : ''} onClick={() => onNavigate('dashboard')}>
            <DashboardIcon className="nav-icon" /> <span>Dashboard</span>
          </button>
          <button className={current === 'expenses' ? 'active' : ''} onClick={() => onNavigate('expenses')}>
            <ExpensesIcon className="nav-icon" /> <span>Expenses</span>
          </button>
          <button className={current === 'analytics' ? 'active' : ''} onClick={() => onNavigate('analytics')}>
            <AnalyticsIcon className="nav-icon" /> <span>Analytics</span>
          </button>
          <button className={current === 'settings' ? 'active' : ''} onClick={() => onNavigate('settings')}>
            <SettingsIcon className="nav-icon" /> <span>Settings</span>
          </button>
        </nav>

        <div className="nav-actions">
          <button className="ghost" onClick={signOut}>
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
