import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'

import { Button, Stack } from '@/components/ui'
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
        <header className="bg-primary py-2 px-4 text-primary-foreground">
            <Stack direction="horizontal" gap={4} align="center" justify="between">
                <Link
                    to={{
                        pathname: '/dashboard',
                        search: `?month=${encodeURIComponent(month)}`,
                    }}
                    aria-label="Dude, where's my cash? — Home"
                >
                    <Logo className="size-6 shrink-0 mr-2" />

                    <span className="truncate text-sm sm:text-base">Dude, where's my cash?</span>
                </Link>

                <Stack direction="horizontal" gap={1} align="center">
                    <ThemeToggle />

                    <Button
                        type="button"
                        variant="link"
                        color="theme"
                        icon
                        aria-label="Sign out"
                        onClick={onLogout}
                        disabled={isLoggingOut}
                    >
                        <LogOut aria-hidden="true" />
                    </Button>
                </Stack>
            </Stack>
        </header>
    )
}
