/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

export const RadioGroup = RadioGroupPrimitive.Root

export const RadioGroupItem = React.forwardRef<
    React.ComponentRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
    <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
            'peer size-4 shrink-0 rounded-full border border-input bg-background shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
        )}
        {...props}
    >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center text-primary">
            <Circle className="size-2.5 fill-current" />
        </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
))
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName
