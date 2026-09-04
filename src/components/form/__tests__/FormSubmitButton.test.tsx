import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { FormSubmitButton } from '@/components/form/FormSubmitButton'

describe('FormSubmitButton', () => {
    it('renders children as button label', () => {
        render(<FormSubmitButton>Submit</FormSubmitButton>)
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    })

    it('has type="submit"', () => {
        render(<FormSubmitButton>Submit</FormSubmitButton>)
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })

    it('is not disabled by default', () => {
        render(<FormSubmitButton>Submit</FormSubmitButton>)
        expect(screen.getByRole('button')).not.toBeDisabled()
    })

    it('is disabled when isLoading is true', () => {
        render(<FormSubmitButton isLoading>Submit</FormSubmitButton>)
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('marks the button as busy when isLoading is true', () => {
        render(<FormSubmitButton isLoading>Submit</FormSubmitButton>)
        expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    })

    it('shows loadingText and hides children when loading', () => {
        render(
            <FormSubmitButton isLoading loadingText="Saving...">
                Submit
            </FormSubmitButton>,
        )
        expect(screen.getByText('Saving...')).toBeInTheDocument()
        expect(screen.queryByText('Submit')).not.toBeInTheDocument()
    })

    it('defaults loading text to "Loading..."', () => {
        render(<FormSubmitButton isLoading>Submit</FormSubmitButton>)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('is disabled when the disabled prop is passed', () => {
        render(<FormSubmitButton disabled>Submit</FormSubmitButton>)
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('renders a LoadingSpinner when loading', () => {
        render(<FormSubmitButton isLoading>Submit</FormSubmitButton>)
        expect(screen.getByRole('status')).toBeInTheDocument()
    })
})
