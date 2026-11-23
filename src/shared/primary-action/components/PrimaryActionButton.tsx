import { useContext } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import { PrimaryActionContext } from '../context/primary-action.context'

export const PrimaryActionButton = () => {
    const context = useContext(PrimaryActionContext)
    if (!context) {
        return null
    }

    const { action } = context

    if (!action || action.isVisible === false) {
        return null
    }

    const Icon = action.icon || Plus

    return (
        <Button
            data-testid="primary-action-button"
            aria-label={action.label}
            disabled={action.disabled}
            onClick={action.onClick}
            size="lg"
            icon
            color="primary"
        >
            <Icon aria-hidden="true" />
        </Button>
    )
}
