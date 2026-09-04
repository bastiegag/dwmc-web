import { describe, expect, it } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { Progress } from '@/components/ui/progress'

describe('Progress', () => {
    it('clamps values above 100%', () => {
        render(<Progress value={150} />)

        expect(screen.getByRole('progressbar').firstElementChild).toHaveStyle({
            transform: 'translateX(-0%)',
        })
    })

    it('clamps values below 0%', () => {
        render(<Progress value={-10} />)

        expect(screen.getByRole('progressbar').firstElementChild).toHaveStyle({
            transform: 'translateX(-100%)',
        })
    })
})
