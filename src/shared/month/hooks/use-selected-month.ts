/* eslint-disable react-hooks/rules-of-hooks */
import { useSearchParams as useLegacySearchParams, useInRouterContext } from 'react-router-dom'
import { useMemo, useCallback, useEffect, useState } from 'react'
import { getCurrentMonth, isValidMonth, formatMonthLabel, addMonths } from '../utils/month.utils'

export const useSelectedMonth = () => {
    const inLegacyRouter = useInRouterContext()
    // The hook is shared by the rollback Vite runtime and the Next runtime.
    // Each runtime owns its URL history implementation.
    const [legacySearchParams, setLegacySearchParams] = inLegacyRouter
        ? useLegacySearchParams()
        : [null, null]
    const [browserSearchParams, setBrowserSearchParams] = useState(() =>
        typeof window === 'undefined'
            ? new URLSearchParams()
            : new URLSearchParams(window.location.search),
    )

    useEffect(() => {
        if (inLegacyRouter) return
        const handlePopState = () =>
            setBrowserSearchParams(new URLSearchParams(window.location.search))
        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [inLegacyRouter])

    const searchParams = legacySearchParams ?? browserSearchParams

    const month = useMemo(() => {
        const monthParam = searchParams?.get('month')
        return isValidMonth(monthParam) ? monthParam : getCurrentMonth()
    }, [searchParams])

    const setMonth = useCallback(
        (newMonth: string) => {
            if (!isValidMonth(newMonth)) return
            const newSearchParams = new URLSearchParams(searchParams.toString())
            newSearchParams.set('month', newMonth)
            if (inLegacyRouter) {
                setLegacySearchParams?.(newSearchParams, { replace: true })
                return
            }
            const query = newSearchParams.toString()
            window.history.replaceState(
                {},
                '',
                `${window.location.pathname}${query ? `?${query}` : ''}`,
            )
            setBrowserSearchParams(newSearchParams)
        },
        [inLegacyRouter, searchParams, setLegacySearchParams],
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
