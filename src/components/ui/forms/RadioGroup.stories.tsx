import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldLabel, FieldLegend, Fieldset } from '@/components/form'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

const meta = {
    title: 'Design System/Primitives/Forms/Radio Group',
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
    <Fieldset>
        <FieldLegend id="budget-period-legend">Budget period</FieldLegend>
        <RadioGroup
            defaultValue="monthly"
            disabled={disabled}
            aria-labelledby="budget-period-legend"
            orientation={orientation}
        >
            {options.map((option) => (
                <Field
                    key={option.value}
                    disabled={disabled}
                    className="flex items-center gap-2 space-y-0"
                >
                    <RadioGroupItem
                        value={option.value}
                        id={`budget-period-${option.value}`}
                        disabled={disabled}
                    />
                    <FieldLabel htmlFor={`budget-period-${option.value}`}>
                        {option.label}
                    </FieldLabel>
                </Field>
            ))}
        </RadioGroup>
    </Fieldset>
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
