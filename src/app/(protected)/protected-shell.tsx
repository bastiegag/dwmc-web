'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, Target, WalletCards, Wrench, ReceiptText, LogOut } from 'lucide-react'
import { ThemeToggle, Logo, SkipLink, ContextualFloatingActionButton } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { useSelectedMonth } from '@/shared/month'
import { PrimaryActionProvider } from '@/shared/primary-action'
import { cn } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'
import { authSessionQueryKey } from '@/lib/auth-session'

const navigation = [
    { name: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Budgets', to: '/budgets', icon: Target },
    { name: 'Transactions', to: '/transactions', icon: ReceiptText },
    { name: 'Accounts', to: '/accounts', icon: WalletCards },
    { name: 'Tools', to: '/tools', icon: Wrench, matchPrefix: true },
]

const withMonth = (path: string, month: string) => `${path}?month=${month}`

export function ProtectedShell({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { month } = useSelectedMonth()
    const queryClient = useQueryClient()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const showMonthNav = ['/dashboard', '/transactions', '/budgets'].some((path) =>
        pathname.startsWith(path),
    )
    const showDashboardSections =
        pathname.startsWith('/dashboard') || pathname.startsWith('/transactions')
    const currentQuery = searchParams.toString()
    const logout = async () => {
        setIsLoggingOut(true)
        try {
            await getSupabaseBrowserClient().auth.signOut()
            queryClient.removeQueries({
                predicate: (query) => query.queryKey[0] !== authSessionQueryKey[0],
            })
            queryClient.setQueryData(authSessionQueryKey, null)
            window.location.replace('/login')
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <>
            <SkipLink />
            <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center text-xl font-bold">DWMC</div>
                    <nav aria-label="Primary navigation">
                        <ul className="space-y-1">
                            {navigation.map((item) => {
                                const active = item.matchPrefix
                                    ? pathname.startsWith(item.to)
                                    : item.to === '/dashboard'
                                      ? pathname === item.to || pathname === '/transactions'
                                      : pathname === item.to
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={withMonth(item.to, month)}
                                            className={cn(
                                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                                active
                                                    ? 'bg-accent text-accent-foreground'
                                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                            )}
                                            aria-current={active ? 'page' : undefined}
                                        >
                                            <item.icon className="size-6 shrink-0" />
                                            {item.name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>
                </div>
            </aside>

            <PrimaryActionProvider>
                <div className="flex min-h-dvh flex-col lg:pl-64">
                    <header className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
                        <Link
                            href={withMonth('/dashboard', month)}
                            className="flex items-center"
                            aria-label="DWMC"
                        >
                            <span className="flex items-center gap-2 text-sm">
                                <Logo className="size-6 text-white" />
                                Dude, where&apos;s my cash?
                            </span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <Button
                                variant="link"
                                className="no-underline hover:bg-accent/10"
                                icon
                                aria-label="Sign out"
                                onClick={() => void logout()}
                                disabled={isLoggingOut}
                            >
                                <LogOut />
                            </Button>
                        </div>
                    </header>

                    {showDashboardSections && (
                        <nav
                            aria-label="Dashboard section"
                            className="flex justify-center bg-primary pb-4 text-primary-foreground"
                        >
                            <div className="flex gap-2">
                                {[
                                    ['/dashboard', 'Overview'],
                                    ['/transactions', 'Transactions'],
                                ].map(([path, label]) => (
                                    <Link
                                        key={path}
                                        href={withMonth(path, month)}
                                        className={cn(
                                            'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                                            pathname === path
                                                ? 'bg-primary-foreground/20'
                                                : 'hover:bg-primary-foreground/10',
                                        )}
                                        aria-current={pathname === path ? 'page' : undefined}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </nav>
                    )}

                    {showMonthNav && <MonthControls month={month} currentQuery={currentQuery} />}
                    <main
                        id="main-content"
                        className="flex-1 px-4 py-6 pb-[calc(4rem+1.5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:py-8"
                    >
                        {children}
                    </main>
                </div>
                <MobileNavigation pathname={pathname} month={month} />
                <ContextualFloatingActionButton />
            </PrimaryActionProvider>
        </>
    )
}

function MonthControls({ month, currentQuery }: { month: string; currentQuery: string }) {
    const { label, goToPreviousMonth, goToNextMonth } = useSelectedMonth()
    void currentQuery
    return (
        <div className="flex items-center justify-center p-4">
            <div className="flex w-full items-center justify-between gap-2 rounded-full bg-white p-1 shadow-md">
                <Button
                    variant="link"
                    icon
                    aria-label="Go to previous month"
                    onClick={goToPreviousMonth}
                >
                    ←
                </Button>
                <span role="status" aria-live="polite" className="text-center text-sm capitalize">
                    {label || month}
                </span>
                <Button variant="link" icon aria-label="Go to next month" onClick={goToNextMonth}>
                    →
                </Button>
            </div>
        </div>
    )
}

function MobileNavigation({ pathname, month }: { pathname: string; month: string }) {
    const items = [
        ['/dashboard', 'Overview', LayoutDashboard],
        ['/budgets', 'Budgets', Target],
        ['/accounts', 'Accounts', WalletCards],
        ['/tools', 'Tools', Wrench],
    ] as const
    return (
        <nav
            aria-label="Mobile navigation"
            className="fixed bottom-0 z-40 flex h-[calc(6rem+env(safe-area-inset-bottom))] w-full items-start bg-white px-4 pt-4 lg:hidden"
        >
            <div className="grid min-w-0 flex-1 grid-cols-4">
                {items.map(([path, label, Icon]) => {
                    const active =
                        path === '/tools'
                            ? pathname.startsWith(path)
                            : pathname === path ||
                              (path === '/dashboard' && pathname === '/transactions')
                    return (
                        <Link
                            key={path}
                            href={withMonth(path, month)}
                            className={cn(
                                'flex min-h-11 min-w-0 flex-col items-center gap-1 text-muted-foreground',
                                active && 'text-primary',
                            )}
                            aria-current={active ? 'page' : undefined}
                        >
                            <Icon className="size-6" fill={active ? 'currentColor' : 'none'} />
                            <span className="text-xs font-medium">{label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
