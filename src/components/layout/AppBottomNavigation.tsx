import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Target, WalletCards, Wrench } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useSelectedMonth } from '@/shared/month'

const navigation = [
    {
        name: 'Overview',
        to: '/dashboard',
        icon: LayoutDashboard,
        paths: ['/dashboard', '/transactions'],
    },
    {
        name: 'Budgets',
        to: '/budgets',
        icon: Target,
    },
    {
        name: 'Accounts',
        to: '/accounts',
        icon: WalletCards,
    },
    {
        name: 'Tools',
        to: '/tools',
        icon: Wrench,
        matchPrefix: true,
    },
] as const

const matchesPath = (pathname: string, path: string) =>
    pathname === path || pathname.startsWith(`${path}/`)

const isNavigationActive = (pathname: string, item: (typeof navigation)[number]): boolean => {
    if ('paths' in item) {
        return item.paths.some((path) => matchesPath(pathname, path))
    }

    if ('matchPrefix' in item && item.matchPrefix) {
        return matchesPath(pathname, item.to)
    }

    return pathname === item.to
}

export const AppBottomNavigation = () => {
    const { month } = useSelectedMonth()
    const { pathname } = useLocation()

    return (
        <nav
            aria-label="Main navigation"
            data-testid="mobile-bottom-nav"
            className={cn(
                'fixed inset-x-0 bottom-0 z-40',
                'h-[calc(6rem+env(safe-area-inset-bottom))]',
                'border-t border-border bg-background',
                'px-4 pt-3 pb-[env(safe-area-inset-bottom)]',
                'lg:hidden',
            )}
        >
            <ul className="grid h-full grid-cols-4 gap-1">
                {navigation.map((item) => {
                    const active = isNavigationActive(pathname, item)

                    const Icon = item.icon

                    return (
                        <li key={item.to} className="min-w-0">
                            <Link
                                to={{
                                    pathname: item.to,
                                    search: `?month=${encodeURIComponent(month)}`,
                                }}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'flex h-full min-h-11 flex-col',
                                    'items-center justify-start gap-1',
                                    'rounded-md px-1 pt-2',
                                    'text-xs font-medium',
                                    'transition-colors motion-reduce:transition-none',

                                    // Default
                                    'text-muted-foreground',

                                    // Interaction
                                    'hover:bg-accent',
                                    'hover:text-accent-foreground',
                                    'focus-visible:outline-none',
                                    'focus-visible:ring-2',
                                    'focus-visible:ring-ring',
                                    'focus-visible:ring-offset-2',
                                    'focus-visible:ring-offset-background',

                                    // Active
                                    active && 'text-primary-border',
                                )}
                            >
                                <Icon
                                    className="size-6 shrink-0"
                                    strokeWidth={active ? 2.5 : 2}
                                    aria-hidden="true"
                                />

                                <span className="truncate">{item.name}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
