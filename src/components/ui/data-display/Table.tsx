import { forwardRef } from 'react'
import type { HTMLAttributes, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Table = forwardRef<HTMLTableElement, TableHTMLAttributes<HTMLTableElement>>(
    ({ className, ...props }, ref) => (
        <div className="relative w-full overflow-x-auto">
            <table
                ref={ref}
                className={cn('w-full caption-bottom border-collapse text-sm', className)}
                {...props}
            />
        </div>
    ),
)

Table.displayName = 'Table'

export const TableHeader = forwardRef<
    HTMLTableSectionElement,
    HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b [&_tr]:border-border', className)} {...props} />
))

TableHeader.displayName = 'TableHeader'

export const TableBody = forwardRef<
    HTMLTableSectionElement,
    HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
))

TableBody.displayName = 'TableBody'

export const TableFooter = forwardRef<
    HTMLTableSectionElement,
    HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            'border-t border-border bg-muted/50 font-medium',
            '[&>tr]:last:border-b-0',
            className,
        )}
        {...props}
    />
))

TableFooter.displayName = 'TableFooter'

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
        <tr
            ref={ref}
            className={cn(
                'border-b border-border',
                'transition-colors',
                'hover:bg-muted/50',
                'data-[state=selected]:bg-muted',
                className,
            )}
            {...props}
        />
    ),
)

TableRow.displayName = 'TableRow'

export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
    ({ className, scope = 'col', ...props }, ref) => (
        <th
            ref={ref}
            scope={scope}
            className={cn(
                'h-10 px-4 text-left align-middle',
                'font-medium text-muted-foreground',
                'whitespace-nowrap',
                className,
            )}
            {...props}
        />
    ),
)

TableHead.displayName = 'TableHead'

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <td ref={ref} className={cn('px-4 py-3 align-middle', className)} {...props} />
    ),
)

TableCell.displayName = 'TableCell'

export const TableCaption = forwardRef<
    HTMLTableCaptionElement,
    HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
))

TableCaption.displayName = 'TableCaption'
