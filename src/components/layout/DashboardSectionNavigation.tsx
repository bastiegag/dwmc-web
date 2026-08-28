import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useSelectedMonth } from '@/shared/month'

const navigation = [
    { name: 'Overview', to: '/dashboard' },
    { name: 'Transactions', to: '/transactions' },
]

export const DashboardSectionNavigation = () => {
    const { month } = useSelectedMonth()

    return (
        <nav aria-label="Dashboard section" className="flex justify-center border-b px-4">
            <div className="flex gap-1">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={`${item.to}?month=${month}`}
                        className={({ isActive }) =>
                            cn(
                                'inline-flex min-h-11 items-center justify-center border-b-2 px-4 text-sm font-medium text-muted-foreground transition-colors',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                isActive
                                    ? 'border-primary text-primary'
                                    : 'border-transparent hover:border-muted-foreground/50 hover:text-foreground',
                            )
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}
