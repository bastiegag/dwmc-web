import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export type LabelProps = ComponentPropsWithoutRef<'label'>

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, htmlFor, ...props }, ref) => (
        <label
            ref={ref}
            htmlFor={htmlFor}
            className={cn(
                'text-label',
                'cursor-pointer',
                'has-[+_:disabled]:cursor-not-allowed',
                'has-[+_:disabled]:opacity-70',
                className,
            )}
            {...props}
        />
    ),
)

Label.displayName = 'Label'
