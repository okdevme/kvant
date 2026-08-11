import type { Ref } from 'vue'
import { describe, expectTypeOf, it } from 'vitest'
import { useCookiesKvantAdapter } from '../../adapters/cookies'
import { number, string } from '../../schema'
import { useKvantState } from '../composables/useKvantState'

describe('useKvantState types (vue)', () => {
  it('infers state and setter types from the schema', () => {
    const state = useKvantState(useCookiesKvantAdapter, 'count', number())
    expectTypeOf(state).toEqualTypeOf<Ref<number | undefined>>()
  })

  it('removes undefined with a default schema', () => {
    const state = useKvantState(useCookiesKvantAdapter, 'count', number().default(0))
    expectTypeOf(state).toEqualTypeOf<Ref<number>>()
  })

  it('accepts adapters via the defined pre-bound hooks shape', () => {
    const state = useKvantState(useCookiesKvantAdapter, 'q')
    expectTypeOf(state).toEqualTypeOf<Ref<string | undefined>>()
  })

  it('infers key map output', () => {
    const state = useKvantState(useCookiesKvantAdapter, {
      q: string(),
      page: number().default(1),
    })
    expectTypeOf(state).toEqualTypeOf<Ref<{
      q?: string | undefined
      page: number
    }>>()
  })
})
