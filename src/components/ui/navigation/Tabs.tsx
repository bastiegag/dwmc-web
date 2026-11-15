import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cn } from '@/lib/utils'

export const Tabs = TabsPrimitive.Root

export const TabsList = forwardRef<
    ComponentRef<typeof TabsPrimitive.List>,
    ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            // Layout
            'inline-flex min-h-10 max-w-full items-center',
            'justify-start gap-1 rounded-md',
            'bg-muted p-1',

            // Typography
            'text-muted-foreground',

            className,
        )}
        {...props}
    />
))

TabsList.displayName = 'TabsList'

export const TabsTrigger = forwardRef<
    ComponentRef<typeof TabsPrimitive.Tab>,
    ComponentPropsWithoutRef<typeof TabsPrimitive.Tab>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Tab
        ref={ref}
        className={cn(
            // Layout
            'inline-flex min-h-8 shrink-0 items-center',
            'justify-center gap-2 whitespace-nowrap',
            'rounded-sm px-3 py-1.5',

            // Typography
            'text-sm font-medium text-muted-foreground',

            // Interaction
            'cursor-pointer transition-colors duration-150',
            'hover:text-foreground',
            'outline-none',

            // Focus
            'focus-visible:ring-2',
            'focus-visible:ring-ring',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-background',

            // Active
            'data-active:bg-background',
            'data-active:text-foreground',
            'data-active:shadow-sm',

            // Disabled
            'data-disabled:pointer-events-none',
            'data-disabled:opacity-50',

            // Reduced motion
            'motion-reduce:transition-none',

            className,
        )}
        {...props}
    />
))

TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = forwardRef<
    ComponentRef<typeof TabsPrimitive.Panel>,
    ComponentPropsWithoutRef<typeof TabsPrimitive.Panel>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Panel
        ref={ref}
        className={cn(
            'mt-4 min-w-0',
            'outline-none',

            'focus-visible:rounded-sm',
            'focus-visible:ring-2',
            'focus-visible:ring-ring',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-background',

            className,
        )}
        {...props}
    />
))

TabsContent.displayName = 'TabsContent'
