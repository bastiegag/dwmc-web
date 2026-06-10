import '/src/test/setup'
import { expect, test } from 'vitest'
import * as module from '@/features/transactions/hooks'

test('imports transactions hooks index', () => {
    expect(module).toBeDefined()
})
