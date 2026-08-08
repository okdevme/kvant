import type { Dispatch, SetStateAction } from 'react'
import type { KvantAdapter, KvantAdapterInterface } from '../../types/adapter'
import type { KvantKeyMap, KvantKeyMapOutput, KvantKeyMapRawInput } from '../../types/schema'
import type { SyncEvent } from '../../types/sync'
import type {
  KvantReactAdapter,
  KvantReactAdapterInterface,
  KvantReactAdapterOptions,
  KvantReactAdapterValue,
} from '../types/adapter'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useEventBus } from '../../events/bus'
import { parseMap, syncMap } from '../../utils/map'
import { stateToUpdates, updatesToObject } from '../../utils/sync'

function useNormalizedAdapter<A extends KvantReactAdapter | KvantAdapter>(
  adapter: A,
  keys: string[],
  options: Partial<KvantReactAdapterOptions<A>>,
): KvantReactAdapterInterface<
  KvantReactAdapterValue<A>
> {
  const standaloneAdapterRef = useRef<KvantAdapterInterface>(null)

  if (!standaloneAdapterRef.current) {
    const api = adapter(keys, options)
    if ('snapshot' in api)
      return api

    standaloneAdapterRef.current = api
  }

  const api = standaloneAdapterRef.current
  const snapshot = useSyncExternalStore(
    api.subscribe,
    api.getSnapshot,
    api.getSnapshot,
  )

  useEffect(() => () => api.dispose?.(), [])

  return {
    key: api.key,
    snapshot,
    update: api.update,
  }
}

/**
 * Binds a map of keys to React state, parsed through the given schemas.
 * Writes go through the adapter and sync across hooks sharing the same adapter.
 *
 * @returns `[states, setStates]` tuple
 */
export function useKvantStates<
  A extends KvantReactAdapter | KvantAdapter,
  M extends KvantKeyMap<KvantReactAdapterValue<A>>,
>(
  adapter: A,
  keyMap: M,
  options: Partial<KvantReactAdapterOptions<A>> = {},
): [
  KvantKeyMapOutput<M>,
  Dispatch<SetStateAction<KvantKeyMapOutput<M>>>,
] {
  const { key: adapterKey, snapshot, update } = useNormalizedAdapter(
    adapter,
    Object.keys(keyMap),
    options,
  )

  const [internalState, setInternalState] = useState<KvantKeyMapOutput<M>>(
    () => parseMap(
      keyMap,
      snapshot,
    ),
  )

  const snapshotCacheRef = useRef<Record<string, KvantKeyMapRawInput<M> | undefined>>({})
  const stateCacheRef = useRef<KvantKeyMapOutput<M>>(internalState)

  const bus = useEventBus<SyncEvent>(`react:sync:${adapterKey}`)

  const setState: Dispatch<SetStateAction<KvantKeyMapOutput<M>>> = useCallback((newState) => {
    const updates = stateToUpdates(
      keyMap,
      typeof newState === 'function'
        ? newState(stateCacheRef.current)
        : newState,
    )

    bus.emit({ type: 'sync', updates })

    // TODO: Throttle, debounce
    update(updatesToObject(updates))
  }, [])

  useEffect(() => {
    const state = parseMap(
      keyMap,
      snapshot,
      {
        snapshot: snapshotCacheRef.current,
        state: stateCacheRef.current,
      },
    )
    stateCacheRef.current = state
    setInternalState(state)
  }, [JSON.stringify(snapshot)])

  useEffect(() => bus.on((event) => {
    setInternalState((currentState) => {
      const newState = syncMap(
        keyMap,
        currentState,
        event.updates,
        {
          snapshot: snapshotCacheRef.current,
          state: stateCacheRef.current,
        },
      )
      stateCacheRef.current = newState
      return newState
    })
  }), [])

  return [internalState, setState]
}
