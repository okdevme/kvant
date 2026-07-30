import type { KvantKeyMap, KvantKeyMapOutput, KvantKeyMapRawInput } from '../types/schema'
import type { Update } from '../types/sync'

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
    const value = snapshot[key]
    if (
      cache
      && key in cache.snapshot
      && key in cache.state
      && cache.snapshot[key] === value
    ) {
      // Cache hit
      output[key as keyof M] = cache.state[key]!
      return output
    }
    // Cache miss
    hasChanged = true
    output[key as keyof M] = schema.parse(value)
    if (cache)
      cache.snapshot[key] = value
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
      // || item.value === cache.snapshot[item.key]
    ) {
      return
    }

    const schema = keyMap[item.key]!
    const state = item.schema !== schema ? schema.parse(item.value) : item.state
    if (state === newState[item.key])
      return

    if (cache)
      cache.snapshot[item.key] = item.value

    newState = { ...newState, [item.key]: state }
  })
  return newState
}
