import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { SelectedMonthContext, type SelectedMonthState } from '../month-context'
import { addMonths, formatMonthLabel, getCurrentMonth, isValidMonth } from '../utils/month.utils'

export function TestMonthProvider({
    children,
    initialMonth,
}: Readonly<{ children: ReactNode; initialMonth?: string }>) {
    const [month, setMonthState] = useState(() =>
        isValidMonth(initialMonth) ? initialMonth : getCurrentMonth(),
    )
    const setMonth = useCallback((newMonth: string) => {
        if (isValidMonth(newMonth)) setMonthState(newMonth)
    }, [])
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
