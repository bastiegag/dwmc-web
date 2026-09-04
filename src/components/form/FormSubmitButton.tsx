import { LoadingSpinner } from '@/components/feedback'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FormSubmitButtonProps extends ButtonProps {
    isLoading?: boolean
    loadingText?: string
}

export const FormSubmitButton = ({
    isLoading = false,
    loadingText = 'Loading...',
    children,
    disabled,
    className,
    ...props
}: FormSubmitButtonProps) => {
    return (
        <Button
            type="submit"
            disabled={disabled || isLoading}
            aria-busy={isLoading}
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
