import type { Dispatch, SetStateAction } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { useCookiesKvantAdapter } from '../../adapters/cookies'
import { number, string } from '../../schema'
import { useKvantState } from '../hooks/useKvantState'
import { useKvantStates } from '../hooks/useKvantStates'

describe('useKvantState types', () => {
  it('infers state and setter types from the schema', () => {
    const [state, setState] = useKvantState(useCookiesKvantAdapter, 'count', number())
    expectTypeOf(state).toEqualTypeOf<number | undefined>()
    expectTypeOf(setState).toEqualTypeOf<Dispatch<SetStateAction<number | undefined>>>()
  })

  it('removes undefined with a default schema', () => {
    const [state] = useKvantState(useCookiesKvantAdapter, 'count', number().default(0))
    expectTypeOf(state).toEqualTypeOf<number>()
  })

  it('accepts adapters via the defined pre-bound hooks shape', () => {
    const [state] = useKvantState(useCookiesKvantAdapter, 'q')
    expectTypeOf(state).toEqualTypeOf<string | undefined>()
  })

  it('infers key map output', () => {
    const [states] = useKvantStates(useCookiesKvantAdapter, {
      q: string(),
      page: number().default(1),
    })
    expectTypeOf(states).toEqualTypeOf<{
      q?: string | undefined
      page: number
    }>()
  })
})
