'use client'

import { useCallback, useMemo, type ReactNode } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SelectedMonthContext, type SelectedMonthState } from '@/shared/month/month-context'
import {
    addMonths,
    formatMonthLabel,
    getCurrentMonth,
    isValidMonth,
} from '@/shared/month/utils/month.utils'

export function NextMonthProvider({ children }: Readonly<{ children: ReactNode }>) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const searchString = searchParams.toString()
    const currentMonth = searchParams.get('month')
    const month = isValidMonth(currentMonth) ? currentMonth : getCurrentMonth()

    const setMonth = useCallback(
        (newMonth: string) => {
            if (!isValidMonth(newMonth)) return

            const nextSearchParams = new URLSearchParams(searchString)
            nextSearchParams.set('month', newMonth)
            const query = nextSearchParams.toString()
            router.replace(`${pathname}${query ? `?${query}` : ''}`)
        },
        [pathname, router, searchString],
    )

    const value = useMemo<SelectedMonthState>(
        () => ({
            month,
            label: formatMonthLabel(month),
            setMonth,
            goToPreviousMonth: () => setMonth(addMonths(month, -1)),
            goToNextMonth: () => setMonth(addMonths(month, 1)),
        }),
        [month, setMonth],
    )

    return <SelectedMonthContext.Provider value={value}>{children}</SelectedMonthContext.Provider>
}
