import type { KvantKeyMap, KvantKeyMapOutput, KvantKeyMapRawInput } from '../types/schema'
import type { Update } from '../types/sync'
import { safeParse } from './schema'

export interface KeyMapCache {
  snapshot: Record<string, any>
  state: Record<string, any>
}

export function parseMap<M extends KvantKeyMap>(
  keyMap: M,
  snapshot: Record<string, KvantKeyMapRawInput<M> | undefined>,
  cache?: KeyMapCache,
): KvantKeyMapOutput<M> {
  let hasChanged = false
  const state = Object.entries(keyMap).reduce((output, [key, schema]) => {
    const value = snapshot[key]
    if (
      cache
      && key in cache.snapshot
      && key in cache.state
      && cache.snapshot[key] === value
    ) {
      // Cache hit
      output[key] = cache.state[key]!
      return output
    }
    // Cache miss
    hasChanged = true
    output[key] = safeParse(schema, value)
    if (cache)
      cache.snapshot[key] = value
    return output
  }, {} as Record<string, any>)

  if (!hasChanged && cache) {
    // Check that keyMap keys have not changed
    const keyMapKeys = Object.keys(keyMap)
    const cachedStateKeys = Object.keys(cache.state)
    hasChanged = keyMapKeys.length !== cachedStateKeys.length
      || keyMapKeys.some(key => !cachedStateKeys.includes(key))
  }

  return (hasChanged || !cache ? state : cache.state) as KvantKeyMapOutput<M>
}

export function syncMap<M extends KvantKeyMap>(
  keyMap: M,
  state: Record<string, any>,
  updates: Update[],
  cache?: KeyMapCache,
): KvantKeyMapOutput<M> {
  let newState = state
  updates.forEach((item) => {
    if (
      !Object.keys(keyMap).includes(item.key)
      // || item.value === cache.snapshot[item.key]
    ) {
      return
    }

    const schema = keyMap[item.key]!
    const state = item.schema !== schema ? safeParse(schema, item.value) : item.state
    if (state === newState[item.key])
      return

    if (cache)
      cache.snapshot[item.key] = item.value

    newState = { ...newState, [item.key]: state }
  })
  return newState as KvantKeyMapOutput<M>
}
