import { useState, useCallback, useMemo, type ReactNode } from 'react'
import { PrimaryActionContext } from './primary-action.context'
import type { PrimaryAction } from '../types/primary-action.types'

export const PrimaryActionProvider = ({ children }: { children: ReactNode }) => {
    const [registration, setRegistration] = useState<{
        action: PrimaryAction
        owner: symbol
    } | null>(null)

    const registerAction = useCallback((newAction: PrimaryAction | null, owner: symbol) => {
        setRegistration((current) => {
            if (newAction === null) {
                return current?.owner === owner ? null : current
            }

            return { action: newAction, owner }
        })
    }, [])

    const value = useMemo(
        () => ({ action: registration?.action ?? null, registerAction }),
        [registration, registerAction],
    )

    return <PrimaryActionContext.Provider value={value}>{children}</PrimaryActionContext.Provider>
}
