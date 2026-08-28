import { Link, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Target, WalletCards, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSelectedMonth } from '@/shared/month'

const navigation = [
    {
        name: 'Overview',
        to: '/dashboard',
        icon: LayoutDashboard,
        sectionPaths: ['/dashboard', '/transactions'],
    },
    { name: 'Budgets', to: '/budgets', icon: Target },
    { name: 'Accounts', to: '/accounts', icon: WalletCards },
    { name: 'Tools', to: '/tools', icon: Wrench, matchPrefix: true },
]

export const AppBottomNavigation = () => {
    const { month } = useSelectedMonth()
    const location = useLocation()

    return (
        <nav
            data-testid="mobile-bottom-nav"
            className="fixed bottom-0 z-40 flex h-[calc(4rem+env(safe-area-inset-bottom))] w-full items-start border-t bg-background pt-2 lg:hidden"
        >
            <div className="grid min-w-0 flex-1 grid-cols-2">
                {navigation.slice(0, 2).map((item) => {
                    const isSectionActive = item.sectionPaths?.some((path) =>
                        location.pathname.startsWith(path),
                    )
                    const content = (
                        <>
                            <item.icon
                                className="size-6"
                                fill={isSectionActive ? 'currentColor' : 'none'}
                            />
                            <span className="text-xs font-medium">{item.name}</span>
                        </>
                    )
                    const className = cn(
                        'flex min-h-11 min-w-0 flex-col items-center gap-1 text-muted-foreground',
                        isSectionActive && 'text-primary',
                    )

                    return item.sectionPaths ? (
                        <Link
                            key={item.name}
                            to={`${item.to}?month=${month}`}
                            className={className}
                            aria-current={isSectionActive ? 'page' : undefined}
                        >
                            {content}
                        </Link>
                    ) : (
                        <NavLink
                            key={item.name}
                            to={`${item.to}?month=${month}`}
                            className={({ isActive }) => cn(className, isActive && 'text-primary')}
                        >
                            {content}
                        </NavLink>
                    )
                })}
            </div>

            <div aria-hidden="true" className="size-14 shrink-0" />

            <div className="grid min-w-0 flex-1 grid-cols-2">
                {navigation.slice(2).map((item) => {
                    const isCurrent = item.matchPrefix
                        ? location.pathname.startsWith(item.to)
                        : location.pathname === item.to

                    return (
                        <NavLink
                            key={item.name}
                            to={`${item.to}?month=${month}`}
                            className={cn(
                                'flex min-h-11 min-w-0 flex-col items-center gap-1 text-muted-foreground',
                                isCurrent && 'text-primary',
                            )}
                            aria-current={isCurrent ? 'page' : undefined}
                        >
                            <item.icon
                                className="size-6"
                                fill={isCurrent ? 'currentColor' : 'none'}
                            />
                            <span className="text-xs font-medium">{item.name}</span>
                        </NavLink>
                    )
                })}
            </div>
        </nav>
    )
}
