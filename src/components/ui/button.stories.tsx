import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus } from 'lucide-react'
import { Button } from './button'

const colors = [
    'default',
    'primary',
    'secondary',
    'destructive',
    'warning',
    'success',
    'info',
] as const
const variants = ['contained', 'outlined', 'link'] as const
const formatColor = (color: (typeof colors)[number]) => color[0].toUpperCase() + color.slice(1)

const meta = {
    title: 'Design System/Components/Actions/Button',
    component: Button,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Triggers an action or event. Supports semantic colors, multiple sizes, outline styling, icons, disabled states, and loading feedback.',
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['contained', 'outlined', 'link'],
        },
        color: {
            control: 'select',
            options: colors,
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        icon: { control: false },
        disabled: { control: 'boolean' },
        isLoading: { control: 'boolean' },
        loadingText: { control: 'text' },
        children: { control: 'text' },
        asChild: { control: false },
    },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { children: 'Button' },
}

export const WithIcon: Story = {
    args: { children: 'Button with icon' },
    render: ({ children, ...props }) => (
        <Button {...props}>
            {children}
            <Plus />
        </Button>
    ),
}

export const IconOnly: Story = {
    argTypes: {
        children: { control: false },
    },
    render: (props) => (
        <Button icon {...props}>
            <Plus />
        </Button>
    ),
}

export const Disabled: Story = {
    args: { children: 'Button', disabled: true },
}

export const Loading: Story = {
    args: { children: 'Save changes', isLoading: true, loadingText: 'Saving...' },
}

export const AllVariants: Story = {
    args: { size: 'md' },
    argTypes: {
        children: { control: false },
        variant: { control: false },
        color: { control: false },
        disabled: { control: false },
    },
    parameters: {
        docs: {
            codePanel: false,
            canvas: {
                sourceState: 'none',
            },
        },
    },
    render: ({ size }) => (
        <div style={{ display: 'grid', gap: '1rem' }}>
            {variants.map((variant) => (
                <div key={variant} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {colors.map((color) => (
                        <Button
                            key={`${variant}-${color}`}
                            color={color === 'default' ? undefined : color}
                            variant={variant}
                            size={size}
                        >
                            {formatColor(color)}
                        </Button>
                    ))}
                </div>
            ))}
        </div>
    ),
}
