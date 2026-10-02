import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

const variants = [
    'default',
    'secondary',
    'destructive',
    'outline',
    'success',
    'warning',
    'info',
] as const

const meta = {
    title: 'UI/Display/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: variants,
        },
    },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { children: 'Groceries' },
}

export const AllVariants: Story = {
    argTypes: { variant: { control: false } },
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {variants.map((variant) => (
                <Badge key={variant} variant={variant}>
                    {variant === 'default' ? 'Active' : variant[0].toUpperCase() + variant.slice(1)}
                </Badge>
            ))}
        </div>
    ),
}
