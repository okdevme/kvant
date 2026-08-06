import type { KvantKeyMap } from '../types/schema'
import type { Update } from '../types/sync'

export function stateToUpdates(
  keyMap: KvantKeyMap,
  state: Record<string, any>,
): Update[] {
  return Object.keys(keyMap).map((key) => {
    const schema = keyMap[key]!
    const stateValue = state[key]
    const value = schema.encode(stateValue)
    return {
      key,
      value,
      schema,
      state: stateValue,
    }
  })
}

export function updatesToObject(updates: Update[]): Record<string, unknown> {
  return Object.fromEntries(
    updates.map(({ key, value }) => [key, value]),
  )
}
