import { Alert } from '@/components/ui'

interface FormErrorProps {
    message?: string | null
}

export const FormError = ({ message }: FormErrorProps) => {
    if (!message) return null
    return <Alert variant="destructive" role="alert" description={message} />
}
