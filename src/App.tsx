import { useState } from 'react'
import { useAuth } from './auth/AuthContext'
import AppLayout from './layout/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

type Page = 'dashboard' | 'expenses' | 'analytics' | 'settings'

export default function App() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState<Page>('dashboard')

  if (loading) return null
  if (!user) return <Login />

  return (
    <AppLayout page={page} onNavigate={setPage}>
      {page === 'dashboard' && <Dashboard />}
      {page === 'expenses' && <Expenses />}
      {page === 'analytics' && <Analytics />}
      {page === 'settings' && <Settings />}
    </AppLayout>
  )
}
