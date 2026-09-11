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
        <nav
            aria-label="Dashboard section"
            className="flex justify-center pb-4 bg-primary text-primary-foreground"
        >
            <div className="flex gap-2">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={`${item.to}?month=${month}`}
                        className={({ isActive }) =>
                            cn(
                                'inline-flex items-center justify-center py-2 px-4 text-sm transition-colors rounded-full',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                                isActive
                                    ? 'bg-primary-foreground/20 text-primary-foreground'
                                    : 'border-transparent hover:border-muted-foreground/50 hover:bg-primary-foreground/10',
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
