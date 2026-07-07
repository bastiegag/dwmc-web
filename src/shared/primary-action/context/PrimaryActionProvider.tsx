import { useState, useCallback, useMemo, type ReactNode } from 'react'
import { PrimaryActionContext } from './primary-action.context'
import type { PrimaryAction } from '../types/primary-action.types'

export function PrimaryActionProvider({ children }: { children: ReactNode }) {
    const [action, setAction] = useState<PrimaryAction | null>(null)

    const registerAction = useCallback((newAction: PrimaryAction | null) => {
        setAction(newAction)
    }, [])

    const value = useMemo(() => ({ action, registerAction }), [action, registerAction])

    return <PrimaryActionContext.Provider value={value}>{children}</PrimaryActionContext.Provider>
}
