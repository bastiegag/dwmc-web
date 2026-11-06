import type { Meta, StoryObj } from '@storybook/react-vite'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from './Table'

const meta = {
    title: 'Design System/Components/Data Display/Table',
    component: Table,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Semantic table built from `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell`. Use `TableCaption` to name the table for assistive technology. Wrap wide tables in a scrollable container so they overflow horizontally without breaking the page layout.',
            },
        },
    },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Table>
            <TableCaption>Accounts</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>Checking</TableCell>
                    <TableCell>Chequing</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Savings</TableCell>
                    <TableCell>Savings</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
}

export const FinancialData: Story = {
    render: () => (
        <Table>
            <TableCaption>May transactions</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Payee</TableHead>
                    <TableHead>Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>2025-05-02</TableCell>
                    <TableCell>Grocery store</TableCell>
                    <TableCell>-$84.20</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>2025-05-03</TableCell>
                    <TableCell>Salary</TableCell>
                    <TableCell>$2,450.00</TableCell>
                </TableRow>
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell>Net</TableCell>
                    <TableCell />
                    <TableCell>$2,365.80</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    ),
}

export const EmptyState: Story = {
    render: () => (
        <Table>
            <TableCaption>Transactions</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Payee</TableHead>
                    <TableHead>Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell colSpan={3}>No transactions for this month.</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
}

export const HorizontalOverflow: Story = {
    render: () => (
        <div className="w-80 overflow-x-auto rounded border">
            <Table>
                <TableCaption>Wide transaction table</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Payee</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>2025-05-02</TableCell>
                        <TableCell>Grocery store</TableCell>
                        <TableCell>Food</TableCell>
                        <TableCell>Checking</TableCell>
                        <TableCell>-$84.20</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    ),
}
