import * as React from 'react'
import { Menu } from '@base-ui/react/menu'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type TriggerProps = React.ComponentPropsWithoutRef<typeof Menu.Trigger> & {
    asChild?: boolean
}

type ContentProps = React.ComponentPropsWithoutRef<typeof Menu.Popup> & {
    positionerProps?: React.ComponentPropsWithoutRef<typeof Menu.Positioner>
}

type ItemProps = React.ComponentPropsWithoutRef<typeof Menu.Item> & {
    inset?: boolean
}

const itemStyles = cn(
    'relative flex min-h-8 w-full items-center gap-2',
    'rounded-sm px-2 py-1.5 text-sm',
    'cursor-default select-none outline-none',
    'focus:bg-accent focus:text-accent-foreground',
    'data-[highlighted]:bg-accent',
    'data-[highlighted]:text-accent-foreground',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
)

const indicatorStyles = 'absolute left-2 flex size-4 items-center justify-center'

// Root
export const DropdownMenu = Menu.Root

// Trigger
export const DropdownMenuTrigger = React.forwardRef<
    React.ComponentRef<typeof Menu.Trigger>,
    TriggerProps
>(({ asChild, children, render, ...props }, ref) => (
    <Menu.Trigger
        {...props}
        ref={ref as React.ComponentPropsWithRef<typeof Menu.Trigger>['ref']}
        render={render ?? (asChild ? (children as React.ReactElement) : undefined)}
    >
        {render || asChild ? undefined : children}
    </Menu.Trigger>
))

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

// Content
export const DropdownMenuContent = React.forwardRef<
    React.ComponentRef<typeof Menu.Popup>,
    ContentProps
>(({ className, positionerProps, ...props }, ref) => (
    <Menu.Portal>
        <Menu.Positioner
            sideOffset={4}
            align="start"
            {...positionerProps}
            className={cn('z-50', positionerProps?.className)}
        >
            <Menu.Popup
                {...props}
                ref={ref}
                className={cn(
                    'min-w-36 max-h-(--available-height)',
                    'overflow-y-auto overscroll-contain',
                    'rounded-md border border-border',
                    'bg-popover p-1 text-popover-foreground',
                    'shadow-md outline-none',

                    // Animation
                    'origin-(--transform-origin)',
                    'transition-[opacity,transform] duration-150',
                    'data-[starting-style]:scale-95',
                    'data-[starting-style]:opacity-0',
                    'data-[ending-style]:scale-95',
                    'data-[ending-style]:opacity-0',
                    'motion-reduce:transition-none',
                    className,
                )}
            />
        </Menu.Positioner>
    </Menu.Portal>
))

DropdownMenuContent.displayName = 'DropdownMenuContent'

// Item
export const DropdownMenuItem = React.forwardRef<React.ComponentRef<typeof Menu.Item>, ItemProps>(
    ({ className, inset, ...props }, ref) => (
        <Menu.Item {...props} ref={ref} className={cn(itemStyles, inset && 'pl-8', className)} />
    ),
)

DropdownMenuItem.displayName = 'DropdownMenuItem'

// Checkbox item
export const DropdownMenuCheckboxItem = React.forwardRef<
    React.ComponentRef<typeof Menu.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof Menu.CheckboxItem>
>(({ className, children, ...props }, ref) => (
    <Menu.CheckboxItem {...props} ref={ref} className={cn(itemStyles, 'pl-8', className)}>
        <Menu.CheckboxItemIndicator className={indicatorStyles}>
            <Check className="size-4" aria-hidden="true" />
        </Menu.CheckboxItemIndicator>

        {children}
    </Menu.CheckboxItem>
))

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'

// Radio group
export const DropdownMenuRadioGroup = Menu.RadioGroup

// Radio item
export const DropdownMenuRadioItem = React.forwardRef<
    React.ComponentRef<typeof Menu.RadioItem>,
    React.ComponentPropsWithoutRef<typeof Menu.RadioItem>
>(({ className, children, ...props }, ref) => (
    <Menu.RadioItem {...props} ref={ref} className={cn(itemStyles, 'pl-8', className)}>
        <Menu.RadioItemIndicator className={indicatorStyles}>
            <span className="size-2 rounded-full bg-current" aria-hidden="true" />
        </Menu.RadioItemIndicator>

        {children}
    </Menu.RadioItem>
))

DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem'

// Group
export const DropdownMenuGroup = Menu.Group

// Label
export const DropdownMenuLabel = React.forwardRef<
    React.ComponentRef<typeof Menu.GroupLabel>,
    React.ComponentPropsWithoutRef<typeof Menu.GroupLabel>
>(({ className, ...props }, ref) => (
    <Menu.GroupLabel
        {...props}
        ref={ref}
        className={cn('px-2 py-1.5 text-xs font-semibold text-muted-foreground', className)}
    />
))

DropdownMenuLabel.displayName = 'DropdownMenuLabel'

// Separator
export const DropdownMenuSeparator = React.forwardRef<
    React.ComponentRef<typeof Menu.Separator>,
    React.ComponentPropsWithoutRef<typeof Menu.Separator>
>(({ className, ...props }, ref) => (
    <Menu.Separator {...props} ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} />
))

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

// Submenu
export const DropdownMenuSub = Menu.SubmenuRoot

export const DropdownMenuSubTrigger = React.forwardRef<
    React.ComponentRef<typeof Menu.SubmenuTrigger>,
    React.ComponentPropsWithoutRef<typeof Menu.SubmenuTrigger>
>(({ className, children, ...props }, ref) => (
    <Menu.SubmenuTrigger {...props} ref={ref} className={cn(itemStyles, className)}>
        {children}

        <ChevronRight className="ml-auto size-4 shrink-0" aria-hidden="true" />
    </Menu.SubmenuTrigger>
))

DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger'

export const DropdownMenuSubContent = DropdownMenuContent
