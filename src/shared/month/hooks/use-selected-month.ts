import { useSearchParams } from 'react-router-dom'
import { useMemo, useCallback } from 'react'
import { getCurrentMonth, isValidMonth, formatMonthLabel, addMonths } from '../utils/month.utils'

export const useSelectedMonth = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const month = useMemo(() => {
        const monthParam = searchParams.get('month')
        return isValidMonth(monthParam) ? monthParam : getCurrentMonth()
    }, [searchParams])

    const setMonth = useCallback(
        (newMonth: string) => {
            if (!isValidMonth(newMonth)) return
            const newSearchParams = new URLSearchParams(searchParams)
            newSearchParams.set('month', newMonth)
            setSearchParams(newSearchParams, { replace: true })
        },
        [searchParams, setSearchParams],
    )

    const goToPreviousMonth = useCallback(() => {
        setMonth(addMonths(month, -1))
    }, [month, setMonth])

    const goToNextMonth = useCallback(() => {
        setMonth(addMonths(month, 1))
    }, [month, setMonth])

    return {
        month,
        label: formatMonthLabel(month),
        setMonth,
        goToPreviousMonth,
        goToNextMonth,
    }
}
