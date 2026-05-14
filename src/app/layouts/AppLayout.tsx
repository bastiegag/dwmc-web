import { Outlet } from 'react-router-dom'
import { AppNav } from '@/components/layout/AppNav'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNav />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
