import type { KvantKeyMap, KvantKeyMapOutput } from '../types/schema'
import type { Update } from '../types/sync'

export function stateToUpdates<M extends KvantKeyMap>(
  keyMap: M,
  state: KvantKeyMapOutput<M>,
): Update[] {
  return Object.entries(state).map(([key, state]) => {
    const schema = keyMap[key]!
    const value = schema.encode(state)
    return {
      key,
      value,
      schema,
      state,
    }
  })
}

export function updatesToObject(updates: Update[]): Record<string, unknown> {
  return Object.fromEntries(
    updates.map(({ key, value }) => [key, value]),
  )
}
