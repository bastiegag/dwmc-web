import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
    InputGroup,
    InputGroupAddon,
    NumberField,
    NumberFieldDecrement,
    NumberFieldGroup,
    NumberFieldIncrement,
    NumberFieldInput,
    Pagination,
    ScrollArea,
    Separator,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './index'
import { Button } from './button'
import { Input } from './input'

const meta = {
    title: 'Design System/Primitives',
    parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Dropdown: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button />}>Actions</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Rename</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Disabled action</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
}

export const ComboboxStory: Story = {
    name: 'Combobox',
    render: () => (
        <Combobox items={['Checking', 'Savings', 'Credit card']}>
            <ComboboxInput placeholder="Choose an account" />
            <ComboboxContent>
                <ComboboxList>
                    <ComboboxEmpty>No accounts found.</ComboboxEmpty>
                    {['Checking', 'Savings', 'Credit card'].map((item) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    ))}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    ),
}

export const TooltipStory: Story = {
    name: 'Tooltip',
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger render={<Button aria-label="More information" icon />}>
                    ?
                </TooltipTrigger>
                <TooltipContent>More information</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
}

export const LoadingSkeleton: Story = {
    render: () => (
        <div className="w-72 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
        </div>
    ),
}

export const Separators: Story = {
    render: () => (
        <div className="flex h-12 items-center gap-4">
            <span>Before</span>
            <Separator orientation="vertical" decorative={false} />
            <span>After</span>
        </div>
    ),
}

export const InputGroups: Story = {
    render: () => (
        <InputGroup>
            <InputGroupAddon>$</InputGroupAddon>
            <Input aria-label="Amount" placeholder="0.00" />
            <InputGroupAddon>CAD</InputGroupAddon>
        </InputGroup>
    ),
}

export const NumberFields: Story = {
    render: () => (
        <NumberField defaultValue={2} min={0} max={10}>
            <NumberFieldGroup>
                <NumberFieldDecrement />
                <NumberFieldInput aria-label="Quantity" />
                <NumberFieldIncrement />
            </NumberFieldGroup>
        </NumberField>
    ),
}

export const Tables: Story = {
    render: () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Balance</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>Checking</TableCell>
                    <TableCell>$1,200.00</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
}

export const PaginationStory: Story = {
    name: 'Pagination',
    render: () => <PaginationExample />,
}

const PaginationExample = () => {
    const [page, setPage] = useState(2)
    return <Pagination page={page} totalPages={5} onPageChange={setPage} showPageNumbers />
}

export const DrawerStory: Story = {
    name: 'Drawer',
    render: () => (
        <Drawer>
            <DrawerTrigger render={<Button />}>Open drawer</DrawerTrigger>
            <DrawerContent>
                <DrawerTitle>Mobile panel</DrawerTitle>
                <DrawerDescription>Panel content.</DrawerDescription>
            </DrawerContent>
        </Drawer>
    ),
}

export const SheetStory: Story = {
    name: 'Sheet',
    render: () => (
        <Sheet>
            <SheetTrigger render={<Button />}>Open sheet</SheetTrigger>
            <SheetContent>
                <SheetTitle>Side panel</SheetTitle>
                <SheetDescription>Panel content.</SheetDescription>
            </SheetContent>
        </Sheet>
    ),
}

export const AccordionStory: Story = {
    name: 'Accordion',
    render: () => (
        <Accordion defaultValue={['details']}>
            <AccordionItem value="details">
                <AccordionHeader>
                    <AccordionTrigger>Details</AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel>Additional information.</AccordionPanel>
            </AccordionItem>
        </Accordion>
    ),
}

export const ScrollAreas: Story = {
    render: () => (
        <ScrollArea className="h-24 w-72 rounded border p-3">
            <p>Scrollable content</p>
            <p>More content</p>
            <p>Even more content</p>
            <p>Additional content</p>
        </ScrollArea>
    ),
}
