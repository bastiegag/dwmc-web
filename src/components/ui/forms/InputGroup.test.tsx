import type { FormEvent } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { InputGroup, InputGroupButton } from './InputGroup'

describe('InputGroup', () => {
    it('keeps an auxiliary button from submitting its surrounding form', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault())

        render(
            <form onSubmit={onSubmit}>
                <InputGroup>
                    <InputGroupButton onClick={vi.fn()}>Search</InputGroupButton>
                </InputGroup>
            </form>,
        )

        const button = screen.getByRole('button', { name: 'Search' })
        expect(button).toHaveAttribute('type', 'button')

        await user.click(button)
        expect(onSubmit).not.toHaveBeenCalled()
    })
})
