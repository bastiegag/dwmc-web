import { useCallback, useMemo, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SelectedMonthContext, type SelectedMonthState } from '../month-context'
import { addMonths, formatMonthLabel, getCurrentMonth, isValidMonth } from '../utils/month.utils'

export function LegacyMonthProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [searchParams, setSearchParams] = useSearchParams()
    const month = isValidMonth(searchParams.get('month'))
        ? searchParams.get('month')!
        : getCurrentMonth()

    const setMonth = useCallback(
        (newMonth: string) => {
            if (!isValidMonth(newMonth)) return

            const nextSearchParams = new URLSearchParams(searchParams)
            nextSearchParams.set('month', newMonth)
            setSearchParams(nextSearchParams, { replace: true })
        },
        [searchParams, setSearchParams],
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
