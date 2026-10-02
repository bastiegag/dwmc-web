import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from './label'
import { RadioGroup, RadioGroupItem } from './radio-group'

const meta = {
    title: 'UI/Forms/RadioGroup',
    component: RadioGroup,
    tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

const options = [
    { value: 'monthly', label: 'Monthly budget' },
    { value: 'yearly', label: 'Yearly budget' },
    { value: 'custom', label: 'Custom period' },
]

const BudgetPeriod = ({ disabled = false }: { disabled?: boolean }) => (
    <RadioGroup defaultValue="monthly" disabled={disabled} aria-label="Budget period">
        {options.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem value={option.value} id={`budget-period-${option.value}`} />
                <Label htmlFor={`budget-period-${option.value}`}>{option.label}</Label>
            </div>
        ))}
    </RadioGroup>
)

export const Default: Story = {
    render: () => <BudgetPeriod />,
}

export const Disabled: Story = {
    render: () => <BudgetPeriod disabled />,
}
