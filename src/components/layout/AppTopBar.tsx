import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui'
import { useSelectedMonth } from '@/shared/month'
import { ThemeToggle } from './ThemeToggle'
import { Logo } from './Logo'

export interface AppTopBarProps {
    onLogout: () => void
    isLoggingOut?: boolean
}

export const AppTopBar = ({ onLogout, isLoggingOut = false }: AppTopBarProps) => {
    const { month } = useSelectedMonth()

    return (
        <header
            className="
                flex h-16 shrink-0 items-center justify-between
                gap-4 bg-foreground px-4 text-background
                sm:px-6
            "
        >
            <Link
                to={{
                    pathname: '/dashboard',
                    search: `?month=${encodeURIComponent(month)}`,
                }}
                aria-label="Dude, where's my cash? — Home"
                className="
                    flex min-w-0 items-center gap-2 rounded-md
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary-foreground
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-primary
                "
            >
                <Logo className="size-7 shrink-0" />

                <span className="truncate text-sm font-semibold sm:text-base">
                    Dude, where's my cash?
                </span>
            </Link>

            <div className="flex shrink-0 items-center gap-1">
                <ThemeToggle
                    className="
                        text-primary-foreground
                        hover:bg-primary-foreground/10
                        focus-visible:ring-primary-foreground
                        focus-visible:ring-offset-primary
                    "
                />

                <Button
                    type="button"
                    variant="link"
                    icon
                    aria-label="Sign out"
                    onClick={onLogout}
                    disabled={isLoggingOut}
                    className="
                        text-primary-foreground
                        hover:bg-primary-foreground/10
                        focus-visible:ring-primary-foreground
                        focus-visible:ring-offset-primary
                    "
                >
                    <LogOut aria-hidden="true" />
                </Button>
            </div>
        </header>
    )
}
