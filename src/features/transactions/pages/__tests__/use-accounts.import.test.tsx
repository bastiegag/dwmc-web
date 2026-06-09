import '/src/test/setup'
import { expect, test } from 'vitest'
import * as module from '@/features/accounts/hooks/use-accounts'

test('imports use-accounts hook', () => {
    expect(module).toBeDefined()
})
