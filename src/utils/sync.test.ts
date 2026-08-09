import { describe, expect, it } from 'vitest'
import { number } from '../schema/number'
import { string } from '../schema/string'
import { stateToUpdates, updatesToObject } from './sync'

describe('stateToUpdates', () => {
  it('encodes state values through their schemas', () => {
    const keyMap = { q: string(), page: number() }
    const updates = stateToUpdates(keyMap, { q: 'a', page: 2 })
    expect(updates).toEqual([
      { key: 'q', value: 'a', schema: keyMap.q, state: 'a' },
      { key: 'page', value: 2, schema: keyMap.page, state: 2 },
    ])
  })
})

describe('updatesToObject', () => {
  it('flattens updates into a key-value record', () => {
    expect(
      updatesToObject([
        { key: 'a', value: 1 },
        { key: 'b', value: undefined },
      ]),
    ).toEqual({ a: 1, b: undefined })
  })
})
