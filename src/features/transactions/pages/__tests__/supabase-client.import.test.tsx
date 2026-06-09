import '/src/test/setup'
import { expect, test } from 'vitest'
import * as module from '@/lib/supabase/client'

test('imports supabase client module', () => {
    expect(module).toBeDefined()
})
