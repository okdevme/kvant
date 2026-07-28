import type { Update } from './defs/events'
import type { KvantKeyMap, KvantKeyMapOutput, KvantKeyMapRawInput } from './defs/schema'

export interface KeyMapCache<M extends KvantKeyMap> {
  snapshot: Record<string, KvantKeyMapRawInput<M> | undefined>
  state: KvantKeyMapOutput<M>
}

export function parseMap<M extends KvantKeyMap>(
  keyMap: M,
  snapshot: Record<string, KvantKeyMapRawInput<M> | undefined>,
  cache?: KeyMapCache<M>,
): KvantKeyMapOutput<M> {
  let hasChanged = false
  const state = Object.entries(keyMap).reduce((output, [key, schema]) => {
    const rawValue = snapshot[key]
    if (
      cache
      && key in cache.snapshot
      && key in cache.state
      && cache.snapshot[key] === rawValue
    ) {
      // Cache hit
      output[key as keyof M] = cache.state[key]!
      return output
    }
    // Cache miss
    hasChanged = true
    output[key as keyof M] = schema.parse(rawValue)
    if (cache)
      cache.snapshot[key] = rawValue
    return output
  }, {} as KvantKeyMapOutput<M>)

  if (!hasChanged && cache) {
    // Check that keyMap keys have not changed
    const keyMapKeys = Object.keys(keyMap)
    const cachedStateKeys = Object.keys(cache.state)
    hasChanged = keyMapKeys.length !== cachedStateKeys.length
      || keyMapKeys.some(key => !cachedStateKeys.includes(key))
  }

  return hasChanged || !cache ? state : cache.state
}

export function syncMap<M extends KvantKeyMap>(
  keyMap: M,
  state: KvantKeyMapOutput<M>,
  updates: Update[],
  cache?: KeyMapCache<M>,
): KvantKeyMapOutput<M> {
  let newState = state
  updates.forEach((item) => {
    if (
      !Object.keys(keyMap).includes(item.key)
      // || item.rawValue === cache.snapshot[item.key]
    ) {
      return
    }

    const schema = keyMap[item.key]!
    const value = item.schema !== schema ? schema.parse(item.rawValue) : item.value
    if (value === newState[item.key])
      return

    if (cache)
      cache.snapshot[item.key] = item.rawValue

    newState = { ...newState, [item.key]: value }
  })
  return newState
}

export function stateToUpdates<M extends KvantKeyMap>(
  keyMap: M,
  state: KvantKeyMapOutput<M>,
): Update[] {
  return Object.entries(state).map(([key, value]) => {
    const schema = keyMap[key]!
    const rawValue = schema.encode(value)
    return {
      key,
      rawValue,
      schema,
      value,
    }
  })
}

export function updatesToObject(updates: Update[]): Record<string, unknown> {
  return Object.fromEntries(
    updates.map(({ key, rawValue }) => [key, rawValue]),
  )
}
