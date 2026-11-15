import { Alert } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface FormErrorProps {
    message?: string | null
    className?: string
    id?: string
}

export const FormError = ({ message, className, id }: FormErrorProps) => {
    if (!message?.trim()) return null

    return (
        <Alert
            id={id}
            variant="destructive"
            role="alert"
            description={message}
            className={cn(className)}
        />
    )
}
