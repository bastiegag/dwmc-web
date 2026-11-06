import * as React from 'react'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

export const RadioGroup = React.forwardRef<
    HTMLDivElement,
    Omit<
        React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive>,
        'value' | 'defaultValue' | 'onValueChange'
    > & {
        value?: string
        defaultValue?: string
        onValueChange?: (value: string) => void
    }
>(({ className, ...props }, ref) => (
    <RadioGroupPrimitive ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />
))
RadioGroup.displayName = 'RadioGroup'

export const RadioGroupItem = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof RadioPrimitive.Root>
>(({ className, ...props }, ref) => (
    <RadioPrimitive.Root
        ref={ref}
        className={cn(
            'peer size-6 shrink-0 rounded-full border border-input bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
        )}
        {...props}
    >
        <Circle className="size-4.5 fill-current" />
    </RadioPrimitive.Root>
))
RadioGroupItem.displayName = 'RadioGroupItem'
