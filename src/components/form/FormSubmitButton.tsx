import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FormSubmitButtonProps extends ButtonProps {
    isLoading?: boolean
    loadingText?: string
}

export function FormSubmitButton({
    isLoading = false,
    loadingText = 'Loading...',
    children,
    disabled,
    className,
    ...props
}: FormSubmitButtonProps) {
    return (
        <Button
            type="submit"
            disabled={disabled || isLoading}
            className={cn('w-full', className)}
            {...props}
        >
            {isLoading ? (
                <>
                    <LoadingSpinner size="sm" aria-hidden="true" />
                    <span>{loadingText}</span>
                </>
            ) : (
                children
            )}
        </Button>
    )
}
