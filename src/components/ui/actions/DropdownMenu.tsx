import * as React from 'react'
import { Menu } from '@base-ui/react/menu'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const DropdownMenu = Menu.Root
export const DropdownMenuTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof Menu.Trigger> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => (
    <Menu.Trigger
        ref={ref}
        render={asChild ? (children as React.ReactElement) : undefined}
        {...props}
    >
        {asChild ? undefined : children}
    </Menu.Trigger>
))
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

export const DropdownMenuContent = React.forwardRef<
    React.ComponentRef<typeof Menu.Popup>,
    React.ComponentPropsWithoutRef<typeof Menu.Popup>
>(({ className, ...props }, ref) => (
    <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
            <Menu.Popup
                ref={ref}
                className={cn(
                    'z-50 min-w-32 rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none data-starting-style:animate-in data-ending-style:animate-out',
                    className,
                )}
                {...props}
            />
        </Menu.Positioner>
    </Menu.Portal>
))
DropdownMenuContent.displayName = 'DropdownMenuContent'

export const DropdownMenuItem = React.forwardRef<
    React.ComponentRef<typeof Menu.Item>,
    React.ComponentPropsWithoutRef<typeof Menu.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
    <Menu.Item
        ref={ref}
        className={cn(
            'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
            inset && 'pl-8',
            className,
        )}
        {...props}
    />
))
DropdownMenuItem.displayName = 'DropdownMenuItem'

export const DropdownMenuCheckboxItem = React.forwardRef<
    React.ComponentRef<typeof Menu.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof Menu.CheckboxItem>
>(({ className, children, ...props }, ref) => (
    <Menu.CheckboxItem
        ref={ref}
        className={cn(
            'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent data-disabled:pointer-events-none data-disabled:opacity-50',
            className,
        )}
        {...props}
    >
        <Menu.CheckboxItemIndicator className="absolute left-2">
            <Check className="size-4" />
        </Menu.CheckboxItemIndicator>
        {children}
    </Menu.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'

export const DropdownMenuRadioGroup = Menu.RadioGroup
export const DropdownMenuRadioItem = React.forwardRef<
    React.ComponentRef<typeof Menu.RadioItem>,
    React.ComponentPropsWithoutRef<typeof Menu.RadioItem>
>(({ className, children, ...props }, ref) => (
    <Menu.RadioItem
        ref={ref}
        className={cn(
            'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent data-disabled:pointer-events-none data-disabled:opacity-50',
            className,
        )}
        {...props}
    >
        <Menu.RadioItemIndicator className="absolute left-2">
            <span className="size-2 rounded-full bg-current" />
        </Menu.RadioItemIndicator>
        {children}
    </Menu.RadioItem>
))
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem'

export const DropdownMenuLabel = React.forwardRef<
    React.ComponentRef<typeof Menu.GroupLabel>,
    React.ComponentPropsWithoutRef<typeof Menu.GroupLabel>
>(({ className, ...props }, ref) => (
    <Menu.GroupLabel
        ref={ref}
        className={cn('px-2 py-1.5 text-sm font-semibold', className)}
        {...props}
    />
))
DropdownMenuLabel.displayName = 'DropdownMenuLabel'
export const DropdownMenuGroup = Menu.Group
export const DropdownMenuSeparator = React.forwardRef<
    React.ComponentRef<typeof Menu.Separator>,
    React.ComponentPropsWithoutRef<typeof Menu.Separator>
>(({ className, ...props }, ref) => (
    <Menu.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

export const DropdownMenuSub = Menu.SubmenuRoot
export const DropdownMenuSubTrigger = React.forwardRef<
    React.ComponentRef<typeof Menu.SubmenuTrigger>,
    React.ComponentPropsWithoutRef<typeof Menu.SubmenuTrigger>
>(({ className, children, ...props }, ref) => (
    <Menu.SubmenuTrigger
        ref={ref}
        className={cn(
            'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent',
            className,
        )}
        {...props}
    >
        {children}
        <ChevronRight className="ml-auto size-4" />
    </Menu.SubmenuTrigger>
))
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger'
export const DropdownMenuSubContent = DropdownMenuContent
