import { createContext } from 'react'
import type { PrimaryAction } from '../types/primary-action.types'

type PrimaryActionContextValue = {
    action: PrimaryAction | null
    registerAction: (action: PrimaryAction | null) => void
}

export const PrimaryActionContext = createContext<PrimaryActionContextValue | undefined>(undefined)
