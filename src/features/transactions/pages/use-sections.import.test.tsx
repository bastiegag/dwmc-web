import '@/test/setup'
import { expect, test } from 'vitest'
import * as module from '@/features/categories/hooks/use-sections'

test('imports use-sections hook', () => {
    expect(module).toBeDefined()
})
