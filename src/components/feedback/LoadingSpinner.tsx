import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    'aria-label'?: string
}

const sizeMap = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }

export const LoadingSpinner = ({
    size = 'md',
    className,
    'aria-label': ariaLabel = 'Loading',
}: LoadingSpinnerProps) => {
    return (
        <div
            role="status"
            aria-label={ariaLabel}
            className={cn(
                'animate-spin rounded-full border-2 border-current border-t-transparent',
                sizeMap[size],
                className,
            )}
        />
    )
}
