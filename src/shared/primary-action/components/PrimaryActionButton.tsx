import { useContext } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
            className="size-14 rounded-full shadow-lg"
        >
            <Icon className="size-6" />
        </Button>
    )
}
