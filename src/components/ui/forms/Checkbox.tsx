import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ComponentRef } from 'react'
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Checkbox = forwardRef<
    ComponentRef<typeof CheckboxPrimitive.Root>,
    ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            'peer flex size-5 shrink-0 cursor-pointer items-center justify-center',
            'rounded-sm border border-input bg-white text-primary-foreground',
            'transition-colors',

            // Checked
            'data-checked:border-primary data-checked:bg-primary data-checked:hover:bg-primary/90 data-checked:hover:text-primary-foreground',

            // Focus
            'focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-ring',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-background',

            // Disabled
            'data-disabled:cursor-not-allowed data-disabled:opacity-50',

            className,
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
            <Check className="size-3.5" strokeWidth={2.5} />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
))

Checkbox.displayName = 'Checkbox'
