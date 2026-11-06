import * as React from 'react'
import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Accordion = AccordionPrimitive.Root
export const AccordionItem = React.forwardRef<
    React.ComponentRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item ref={ref} className={cn('border-b', className)} {...props} />
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
            'flex flex-1 items-center justify-between py-4 text-left font-medium transition-all hover:underline [&[data-panel-open]>svg]:rotate-180',
            className,
        )}
        {...props}
    >
        {children}
        <ChevronDown className="size-4 shrink-0 transition-transform" />
    </AccordionPrimitive.Trigger>
))
AccordionTrigger.displayName = 'AccordionTrigger'
export const AccordionPanel = React.forwardRef<
    React.ComponentRef<typeof AccordionPrimitive.Panel>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Panel>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Panel
        ref={ref}
        className={cn('overflow-hidden text-sm transition-all', className)}
        {...props}
    >
        <div className="pb-4 pt-0">{children}</div>
    </AccordionPrimitive.Panel>
))
AccordionPanel.displayName = 'AccordionPanel'
