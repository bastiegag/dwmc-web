import type { Meta, StoryObj } from '@storybook/react-vite'
import {
    Archive,
    Banknote,
    CalendarDays,
    Check,
    CircleAlert,
    CircleHelp,
    CreditCard,
    Menu,
    Pencil,
    Plus,
    Search,
    Settings,
    Trash2,
    Wallet,
} from 'lucide-react'

const icons = [
    ['Plus', Plus],
    ['Pencil', Pencil],
    ['Trash2', Trash2],
    ['Check', Check],
    ['CircleAlert', CircleAlert],
    ['CircleHelp', CircleHelp],
    ['Search', Search],
    ['CalendarDays', CalendarDays],
    ['Settings', Settings],
    ['Menu', Menu],
    ['Wallet', Wallet],
    ['Banknote', Banknote],
    ['CreditCard', CreditCard],
    ['Archive', Archive],
] as const

const meta = {
    title: 'Design System/Foundations/Icons',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'The application uses Lucide React icons. Prefer these existing icons, keep decorative icons hidden from assistive technology, and provide an accessible label for icon-only controls.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const UsedIcons: Story = {
    render: () => (
        <div className="grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {icons.map(([name, Icon]) => (
                <div key={name} className="flex flex-col items-center gap-2 rounded-lg border p-4">
                    <Icon className="size-5" aria-hidden="true" />
                    <span className="text-center text-xs">{name}</span>
                </div>
            ))}
        </div>
    ),
}
