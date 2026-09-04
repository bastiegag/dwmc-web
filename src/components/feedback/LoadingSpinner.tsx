import { cn } from '@/lib/utils'

type LoadingSpinnerProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'role'> & {
    size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }

export const LoadingSpinner = ({
    size = 'md',
    className,
    'aria-label': ariaLabel = 'Loading',
    ...props
}: LoadingSpinnerProps) => {
    return (
        <div
            {...props}
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
