import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import { cn } from '@/lib/utils'

export type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>

export const Switch = forwardRef<ComponentRef<typeof SwitchPrimitive.Root>, SwitchProps>(
    ({ className, ...props }, ref) => (
        <SwitchPrimitive.Root
            ref={ref}
            className={cn(
                // Layout
                'peer inline-flex h-6 w-11 shrink-0 items-center',
                'rounded-full border-2 border-transparent',

                // Interaction
                'cursor-pointer transition-colors duration-200',
                'focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring',
                'focus-visible:ring-offset-2',
                'focus-visible:ring-offset-background',

                // States
                'data-checked:bg-primary',
                'data-unchecked:bg-input',
                'data-disabled:cursor-not-allowed',
                'data-disabled:opacity-50',

                // Accessibility
                'motion-reduce:transition-none',

                className,
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                className={cn(
                    'pointer-events-none block size-5',
                    'rounded-full bg-white shadow-sm',

                    'transition-transform duration-200 ease-out',
                    'data-checked:translate-x-5',
                    'data-unchecked:translate-x-0',

                    'motion-reduce:transition-none',
                )}
            />
        </SwitchPrimitive.Root>
    ),
)

Switch.displayName = 'Switch'
