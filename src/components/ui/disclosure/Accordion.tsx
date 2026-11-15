import * as React from 'react'
import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Accordion = AccordionPrimitive.Root

export const AccordionItem = React.forwardRef<
    React.ComponentRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn(
            'border-b border-border',
            'last:border-b-0',
            'data-disabled:opacity-50',
            className,
        )}
        {...props}
    />
))

AccordionItem.displayName = 'AccordionItem'

export const AccordionHeader = React.forwardRef<
    React.ComponentRef<typeof AccordionPrimitive.Header>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Header ref={ref} className={cn('flex', className)} {...props} />
))

AccordionHeader.displayName = 'AccordionHeader'

export const AccordionTrigger = React.forwardRef<
    React.ComponentRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
            // Layout
            'flex w-full flex-1 items-center justify-between gap-4',
            'py-4 text-left text-sm font-medium',

            // Interaction
            'cursor-pointer transition-colors motion-reduce:transition-none',
            'hover:text-primary',
            'focus-visible:rounded-sm focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-ring',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-background',

            // Disabled
            'disabled:cursor-not-allowed',
            'data-disabled:cursor-not-allowed',

            // Chevron
            '[&[data-panel-open]>svg]:rotate-180',

            className,
        )}
        {...props}
    >
        {children}

        <ChevronDown
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none"
            aria-hidden="true"
        />
    </AccordionPrimitive.Trigger>
))

AccordionTrigger.displayName = 'AccordionTrigger'

export const AccordionPanel = React.forwardRef<
    React.ComponentRef<typeof AccordionPrimitive.Panel>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Panel>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Panel
        ref={ref}
        className={cn(
            'h-(--accordion-panel-height) overflow-hidden',
            'text-sm text-muted-foreground',

            // Opening and closing
            'transition-[height,opacity] duration-200 ease-in-out',
            'data-[starting-style]:h-0',
            'data-[starting-style]:opacity-0',
            'data-[ending-style]:h-0',
            'data-[ending-style]:opacity-0',

            // Accessibility
            'motion-reduce:transition-none',

            className,
        )}
        {...props}
    >
        <div className="pb-4">{children}</div>
    </AccordionPrimitive.Panel>
))

AccordionPanel.displayName = 'AccordionPanel'
