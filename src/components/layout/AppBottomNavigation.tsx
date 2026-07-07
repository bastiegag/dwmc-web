import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Target, WalletCards, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSelectedMonth } from '@/shared/month'

const navigation = [
    { name: 'Overview', to: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Budgets', to: '/app/budgets', icon: Target },
    { name: 'Accounts', to: '/app/accounts', icon: WalletCards },
    { name: 'Tools', to: '/app/tools', icon: Wrench, matchPrefix: true },
]

export function AppBottomNavigation() {
    const { month } = useSelectedMonth()
    const location = useLocation()

    return (
        <nav className="fixed bottom-0 z-40 grid h-[calc(4rem+env(safe-area-inset-bottom))] w-full grid-cols-5 items-start border-t bg-background pt-2 lg:hidden">
            {navigation.slice(0, 2).map((item) => (
                <NavLink
                    key={item.name}
                    to={`${item.to}?month=${month}`}
                    className={({ isActive }) =>
                        cn(
                            'flex flex-col items-center gap-1 text-muted-foreground',
                            isActive && 'text-primary',
                        )
                    }
                >
                    {({ isActive }) => (
                        <>
                            <item.icon
                                className="size-6"
                                fill={isActive ? 'currentColor' : 'none'}
                            />
                            <span className="text-xs font-medium">{item.name}</span>
                        </>
                    )}
                </NavLink>
            ))}

            <div />

            {navigation.slice(2).map((item) => {
                const isCurrent = item.matchPrefix
                    ? location.pathname.startsWith(item.to)
                    : location.pathname === item.to

                return (
                    <NavLink
                        key={item.name}
                        to={`${item.to}?month=${month}`}
                        className={cn(
                            'flex flex-col items-center gap-1 text-muted-foreground',
                            isCurrent && 'text-primary',
                        )}
                        aria-current={isCurrent ? 'page' : undefined}
                    >
                        <item.icon className="size-6" fill={isCurrent ? 'currentColor' : 'none'} />
                        <span className="text-xs font-medium">{item.name}</span>
                    </NavLink>
                )
            })}
        </nav>
    )
}
