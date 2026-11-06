import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

const labelClasses = 'text-label peer-disabled:cursor-not-allowed peer-disabled:opacity-70'

const Label = forwardRef<HTMLLabelElement, ComponentPropsWithoutRef<'label'>>(
    ({ className, htmlFor, ...props }, ref) => (
        <label ref={ref} htmlFor={htmlFor} className={cn(labelClasses, className)} {...props} />
    ),
)
Label.displayName = 'Label'

export { Label }
