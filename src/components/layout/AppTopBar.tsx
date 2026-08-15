import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSelectedMonth } from '@/shared/month'
import { ThemeToggle } from './ThemeToggle'

interface AppTopBarProps {
    onLogout: () => void
    isLoggingOut?: boolean
}

export const AppTopBar = ({ onLogout, isLoggingOut = false }: AppTopBarProps) => {
    const { month } = useSelectedMonth()

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6 lg:px-8">
            <Link to={`/dashboard?month=${month}`} className="text-xl font-bold tracking-tight">
                DWMC
            </Link>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="sm" onClick={onLogout} disabled={isLoggingOut}>
                    <LogOut className="mr-2" />
                    Sign out
                </Button>
            </div>
        </header>
    )
}
