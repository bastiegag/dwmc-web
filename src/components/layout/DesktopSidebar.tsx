import { Link, NavLink } from 'react-router-dom'
import { LayoutDashboard, Target, WalletCards, Wrench, ReceiptText } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useSelectedMonth } from '@/shared/month'
import { Logo } from './Logo'

const navigation = [
    {
        name: 'Overview',
        to: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Budgets',
        to: '/budgets',
        icon: Target,
    },
    {
        name: 'Transactions',
        to: '/transactions',
        icon: ReceiptText,
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

export const DesktopSidebar = () => {
    const { month } = useSelectedMonth()
    const search = `?month=${encodeURIComponent(month)}`

    return (
        <aside
            data-testid="desktop-sidebar"
            className={cn(
                'fixed inset-y-0 left-0 z-40',
                'hidden w-64 flex-col',
                'border-r border-border bg-background',
                'lg:flex',
            )}
        >
            <div className="flex h-16 shrink-0 items-center px-6">
                <Link
                    to={{
                        pathname: '/dashboard',
                        search,
                    }}
                    aria-label="Dude, where's my cash? — Home"
                    className={cn(
                        'flex items-center gap-3 rounded-md',
                        'text-lg font-bold',
                        'focus-visible:outline-none',
                        'focus-visible:ring-2 focus-visible:ring-ring',
                        'focus-visible:ring-offset-2',
                        'focus-visible:ring-offset-background',
                    )}
                >
                    <Logo className="size-8 shrink-0 text-primary" />
                    <span>DWMC</span>
                </Link>
            </div>

            <nav aria-label="Main navigation" className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <ul className="space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon

                        return (
                            <li key={item.to}>
                                <NavLink
                                    to={{
                                        pathname: item.to,
                                        search,
                                    }}
                                    end={'matchPrefix' in item ? !item.matchPrefix : true}
                                    className={({ isActive }) =>
                                        cn(
                                            'group flex min-h-11 items-center gap-3',
                                            'rounded-md px-3 py-2',
                                            'text-sm font-medium',
                                            'transition-colors motion-reduce:transition-none',

                                            'focus-visible:outline-none',
                                            'focus-visible:ring-2',
                                            'focus-visible:ring-ring',
                                            'focus-visible:ring-offset-2',
                                            'focus-visible:ring-offset-background',

                                            isActive
                                                ? 'bg-accent text-accent-foreground'
                                                : cn(
                                                      'text-muted-foreground',
                                                      'hover:bg-accent',
                                                      'hover:text-accent-foreground',
                                                  ),
                                        )
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                className={cn(
                                                    'size-5 shrink-0',
                                                    isActive && 'text-primary',
                                                )}
                                                strokeWidth={isActive ? 2.5 : 2}
                                                aria-hidden="true"
                                            />

                                            <span>{item.name}</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    )
}
