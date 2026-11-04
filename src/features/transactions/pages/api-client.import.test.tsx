import '@/test/setup'
import { expect, test } from 'vitest'
import * as module from '@/lib/api-client'

test('imports api-client module', () => {
    expect(module).toBeDefined()
})
