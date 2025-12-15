import type { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'

type Page = 'dashboard' | 'expenses' | 'analytics' | 'settings'

type Props = {
  page: Page
  onNavigate: (p: Page) => void
  children: ReactNode
}

export default function AppLayout({ page, onNavigate, children }: Props) {
  return (
    <div className="app-root">
      <Navbar current={page} onNavigate={onNavigate} />

      {/* ⬇⬇⬇ OVO JE KLJUČ ⬇⬇⬇ */}
      <div className="container">
        <main className="app-main">
          {children}
        </main>
      </div>

      <BottomNav current={page} onNavigate={onNavigate} />
    </div>
  )
}
