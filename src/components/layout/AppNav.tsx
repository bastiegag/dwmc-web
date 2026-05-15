import { Link, useNavigate } from 'react-router-dom'
import { LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { useLogout } from '@/features/auth/hooks/useLogout'

export function AppNav() {
    const navigate = useNavigate()
    const { logout, isPending } = useLogout()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <header className="border-b bg-card px-6 py-3">
            <nav className="flex items-center justify-between" aria-label="Main navigation">
                <div className="flex items-center gap-6">
                    <Link
                        to="/app"
                        className="flex items-center gap-2 text-lg font-bold text-primary"
                    >
                        💰 DWMC
                    </Link>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/app" className="flex items-center gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        disabled={isPending}
                        className="flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        {isPending ? 'Signing out...' : 'Sign out'}
                    </Button>
                </div>
            </nav>
        </header>
    )
}
