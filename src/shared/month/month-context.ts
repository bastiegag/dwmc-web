import { createContext, useContext } from 'react'

export type SelectedMonthState = {
    month: string
    label: string
    setMonth: (month: string) => void
    goToPreviousMonth: () => void
    goToNextMonth: () => void
}

export const SelectedMonthContext = createContext<SelectedMonthState | null>(null)

export const useSelectedMonth = (): SelectedMonthState => {
    const value = useContext(SelectedMonthContext)

    if (!value) {
        throw new Error('useSelectedMonth must be used within a month provider')
    }

    return value
}
