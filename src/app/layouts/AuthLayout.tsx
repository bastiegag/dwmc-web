import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function AuthLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:left-4 focus:top-4 focus:rounded focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring"
            >
                Skip to main content
            </a>
            <header className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary">
                        <span aria-hidden="true">💰</span> DWMC
                    </span>
                </div>
                <ThemeToggle />
            </header>
            <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-12">
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
