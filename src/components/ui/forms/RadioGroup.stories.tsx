import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from './Label'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

const meta = {
    title: 'Design System/Components/Forms/Radio Group',
    component: RadioGroup,
    tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

const defaultOptions = [
    { value: 'monthly', label: 'Monthly budget' },
    { value: 'yearly', label: 'Yearly budget' },
    { value: 'custom', label: 'Custom period' },
]

const multipleOptions = [
    ...defaultOptions,
    { value: 'weekly', label: 'Weekly budget' },
    { value: 'quarterly', label: 'Quarterly budget' },
    { value: 'annual', label: 'Annual budget' },
]

const BudgetPeriod = ({
    disabled = false,
    orientation,
    options = defaultOptions,
}: {
    disabled?: boolean
    orientation?: 'vertical' | 'horizontal'
    options?: typeof defaultOptions
}) => (
    <RadioGroup
        defaultValue="monthly"
        disabled={disabled}
        aria-label="Budget period"
        orientation={orientation}
    >
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

export const Horizontal: Story = {
    render: () => <BudgetPeriod orientation="horizontal" />,
}

export const HorizontalWithMultipleOptions: Story = {
    render: () => <BudgetPeriod orientation="horizontal" options={multipleOptions} />,
}
