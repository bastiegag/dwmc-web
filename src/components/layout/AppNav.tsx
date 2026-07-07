import { Link } from 'react-router-dom'
import { LogOut, LayoutDashboard, Tags, Wallet, ReceiptText, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'

interface AppNavProps {
    onLogout: () => void
    isLoggingOut?: boolean
}

export const AppNav = ({ onLogout, isLoggingOut = false }: AppNavProps) => {
    return (
        <header className="border-b bg-card px-6 py-3">
            <nav className="flex items-center justify-between" aria-label="Main navigation">
                <div className="flex items-center gap-6">
                    <Link
                        to="/app"
                        className="flex items-center gap-2 text-lg font-bold text-primary"
                    >
                        <span aria-hidden="true">💰</span> DWMC
                    </Link>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/app" className="flex items-center gap-2">
                                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/app/categories" className="flex items-center gap-2">
                                <Tags className="h-4 w-4" aria-hidden="true" />
                                Categories
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/app/accounts" className="flex items-center gap-2">
                                <Wallet className="h-4 w-4" aria-hidden="true" />
                                Accounts
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/app/transactions" className="flex items-center gap-2">
                                <ReceiptText className="h-4 w-4" aria-hidden="true" />
                                Transactions
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/app/budgets" className="flex items-center gap-2">
                                <Target className="h-4 w-4" aria-hidden="true" />
                                Budgets
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        {isLoggingOut ? 'Signing out...' : 'Sign out'}
                    </Button>
                </div>
            </nav>
        </header>
    )
}
