import { Landmark } from 'lucide-react'
import { Button, EmptyState } from '@/components/ui'

type EmptyAccountsStateProps = {
    onCreate: () => void
}

export const EmptyAccountsState = ({ onCreate }: EmptyAccountsStateProps) => {
    return (
        <EmptyState
            icon={Landmark}
            title="No accounts yet"
            description="Get started by creating your first account."
            action={
                <Button onClick={onCreate} aria-label="Create your first account">
                    Create account
                </Button>
            }
        />
    )
}

export default EmptyAccountsState
