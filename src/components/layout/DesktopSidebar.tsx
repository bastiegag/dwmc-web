import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Target, WalletCards, Wrench, ReceiptText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSelectedMonth } from '@/shared/month'

const navigation = [
    { name: 'Overview', to: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Budgets', to: '/app/budgets', icon: Target },
    { name: 'Transactions', to: '/app/transactions', icon: ReceiptText },
    { name: 'Accounts', to: '/app/accounts', icon: WalletCards },
    { name: 'Tools', to: '/app/tools', icon: Wrench, matchPrefix: true },
]

export const DesktopSidebar = () => {
    const { month } = useSelectedMonth()
    const location = useLocation()

    return (
        <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center text-xl font-bold tracking-tight">
                    DWMC
                </div>
                <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul className="-mx-2 space-y-1">
                                {navigation.map((item) => {
                                    const isCurrent = item.matchPrefix
                                        ? location.pathname.startsWith(item.to)
                                        : location.pathname === item.to
                                    return (
                                        <li key={item.name}>
                                            <NavLink
                                                to={`${item.to}?month=${month}`}
                                                className={cn(
                                                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                                    isCurrent
                                                        ? 'bg-accent text-accent-foreground'
                                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                                )}
                                                aria-current={isCurrent ? 'page' : undefined}
                                            >
                                                <item.icon className="size-6 shrink-0" />
                                                {item.name}
                                            </NavLink>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    )
}
