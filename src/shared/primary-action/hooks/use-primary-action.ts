import { useContext, useEffect, useRef } from 'react'
import { PrimaryActionContext } from '../context/primary-action.context'
import type { PrimaryAction } from '../types/primary-action.types'

export const usePrimaryAction = (action: PrimaryAction | null) => {
    const context = useContext(PrimaryActionContext)
    if (!context) {
        throw new Error('usePrimaryAction must be used within a PrimaryActionProvider')
    }

    const { registerAction } = context
    const ownerRef = useRef(Symbol())
    const onClickRef = useRef(action?.onClick)
    const { label, isVisible, disabled, icon } = action ?? {}

    useEffect(() => {
        onClickRef.current = action?.onClick
    }, [action?.onClick])

    useEffect(() => {
        const owner = ownerRef.current

        if (label !== undefined) {
            registerAction(
                {
                    label,
                    onClick: () => onClickRef.current?.(),
                    ...(isVisible !== undefined ? { isVisible } : {}),
                    ...(disabled !== undefined ? { disabled } : {}),
                    ...(icon !== undefined ? { icon } : {}),
                },
                owner,
            )
        } else {
            registerAction(null, owner)
        }

        return () => {
            registerAction(null, owner)
        }
    }, [label, isVisible, disabled, icon, registerAction])
}
