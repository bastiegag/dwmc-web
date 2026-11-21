import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { useSelectedMonth } from '@/shared/month'

const navigation = [
    { name: 'Overview', to: '/dashboard' },
    { name: 'Transactions', to: '/transactions' },
] as const

export const DashboardSectionNavigation = () => {
    const { month } = useSelectedMonth()

    return (
        <nav
            aria-label="Dashboard sections"
            className={cn('flex justify-center', 'bg-foreground px-4 pb-4', 'text-background')}
        >
            <ul className="flex items-center gap-2">
                {navigation.map((item) => (
                    <li key={item.to}>
                        <NavLink
                            to={{
                                pathname: item.to,
                                search: `?month=${encodeURIComponent(month)}`,
                            }}
                            end
                            className={({ isActive }) =>
                                cn(
                                    // Layout
                                    'inline-flex min-h-11 items-center',
                                    'justify-center rounded-full',
                                    'px-4 py-2 text-sm font-medium',

                                    // Interaction
                                    'transition-colors motion-reduce:transition-none',
                                    'hover:bg-primary-foreground/10',

                                    // Keyboard focus
                                    'focus-visible:outline-none',
                                    'focus-visible:ring-2',
                                    'focus-visible:ring-primary-foreground',
                                    'focus-visible:ring-offset-2',
                                    'focus-visible:ring-offset-primary',

                                    // Active
                                    isActive && 'bg-primary-foreground/10',
                                )
                            }
                        >
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
