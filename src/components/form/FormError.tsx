import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui'

interface FormErrorProps {
    message?: string | null
}

export const FormError = ({ message }: FormErrorProps) => {
    if (!message) return null
    return (
        <Alert variant="destructive" role="alert">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    )
}
