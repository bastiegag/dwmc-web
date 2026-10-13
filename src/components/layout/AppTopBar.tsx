import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSelectedMonth } from '@/shared/month'
import { ThemeToggle, Logo } from '@/components/layout'

interface AppTopBarProps {
    onLogout: () => void
    isLoggingOut?: boolean
}

export const AppTopBar = ({ onLogout, isLoggingOut = false }: AppTopBarProps) => {
    const { month } = useSelectedMonth()

    return (
        <header className="flex items-center justify-between bg-primary text-primary-foreground p-4">
            <Link to={`/dashboard?month=${month}`} className="flex items-center" aria-label="DWMC">
                <div className="flex items-center gap-2 text-sm">
                    <Logo className="size-6 text-white" />
                    Dude, where's my cash?
                </div>
            </Link>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                    variant="link"
                    className="no-underline hover:bg-accent/10"
                    icon
                    aria-label="Sign out"
                    onClick={onLogout}
                    disabled={isLoggingOut}
                >
                    <LogOut />
                </Button>
            </div>
        </header>
    )
}
