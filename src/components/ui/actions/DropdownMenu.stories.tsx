import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from './DropdownMenu'
import { Button } from './Button'

const meta = {
    title: 'Design System/Primitives/Actions/Dropdown Menu',
    component: DropdownMenu,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Base UI menu wrapper for contextual actions. Use `DropdownMenuTrigger` with `render` to supply the trigger element. Checkbox and radio items keep their state via `checked` and `value`.',
            },
        },
    },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button>Actions</Button>}></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={fn()}>Rename</DropdownMenuItem>
                <DropdownMenuItem onClick={fn()}>Duplicate</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
}

export const DisabledItem: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button>Actions</Button>}></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={fn()}>Rename</DropdownMenuItem>
                <DropdownMenuItem disabled>Archive (unavailable)</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
}

export const CheckboxItem: Story = {
    render: function CheckboxItemRender() {
        const [showArchived, setShowArchived] = useState(false)
        const [showHidden, setShowHidden] = useState(true)
        return (
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={<Button variant="outlined">View options</Button>}
                ></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuCheckboxItem
                        checked={showArchived}
                        onCheckedChange={setShowArchived}
                    >
                        Show archived
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={showHidden} onCheckedChange={setShowHidden}>
                        Show hidden
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    },
}

export const RadioItem: Story = {
    render: function RadioItemRender() {
        const [period, setPeriod] = useState('month')
        return (
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={<Button variant="outlined">Period: {period}</Button>}
                ></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup value={period} onValueChange={setPeriod}>
                        <DropdownMenuRadioItem value="week">Week</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="month">Month</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="year">Year</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    },
}

export const NestedMenu: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button>Export</Button>}></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Export as</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={fn()}>CSV</DropdownMenuItem>
                        <DropdownMenuItem onClick={fn()}>PDF</DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={fn()}>Print</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
}

export const DestructiveAction: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={<Button variant="outlined">More</Button>}
            ></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={fn()}>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={fn()}
                    className="text-destructive focus:text-destructive"
                >
                    Delete account
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
}
