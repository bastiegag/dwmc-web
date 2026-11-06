import { forwardRef } from 'react'
import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Input } from './input'

export const NumberField = NumberFieldPrimitive.Root

export const NumberFieldGroup = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'flex h-10 w-full items-center rounded-md border border-input bg-card',
                className,
            )}
            {...props}
        />
    ),
)
NumberFieldGroup.displayName = 'NumberFieldGroup'

export const NumberFieldInput = forwardRef<
    React.ComponentRef<typeof NumberFieldPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.Input>
>(({ className, ...props }, ref) => (
    <NumberFieldPrimitive.Input
        ref={ref}
        render={<Input />}
        className={cn('rounded-none border-0 text-center focus-visible:ring-0', className)}
        {...props}
    />
))
NumberFieldInput.displayName = 'NumberFieldInput'

export const NumberFieldDecrement = forwardRef<
    React.ComponentRef<typeof NumberFieldPrimitive.Decrement>,
    React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.Decrement>
>(({ className, children, ...props }, ref) => (
    <NumberFieldPrimitive.Decrement
        ref={ref}
        render={<Button type="button" variant="link" icon />}
        className={cn('rounded-none', className)}
        {...props}
    >
        {children ?? <Minus aria-hidden="true" />}
    </NumberFieldPrimitive.Decrement>
))
NumberFieldDecrement.displayName = 'NumberFieldDecrement'

export const NumberFieldIncrement = forwardRef<
    React.ComponentRef<typeof NumberFieldPrimitive.Increment>,
    React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.Increment>
>(({ className, children, ...props }, ref) => (
    <NumberFieldPrimitive.Increment
        ref={ref}
        render={<Button type="button" variant="link" icon />}
        className={cn('rounded-none', className)}
        {...props}
    >
        {children ?? <Plus aria-hidden="true" />}
    </NumberFieldPrimitive.Increment>
))
NumberFieldIncrement.displayName = 'NumberFieldIncrement'
