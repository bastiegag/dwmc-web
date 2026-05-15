import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function AuthLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary">💰 DWMC</span>
                </div>
                <ThemeToggle />
            </header>
            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </main>
            <footer className="py-4 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} DWMC. All rights reserved.</p>
            </footer>
        </div>
    )
}
