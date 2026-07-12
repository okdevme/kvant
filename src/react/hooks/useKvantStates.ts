import type { SetStateAction } from 'react'
import type { KvantAdapter, KvantAdapterInterface } from '../../defs/adapter'
import type { SyncEvent, SyncEventItem } from '../../defs/events'
import type { KvantKeyMap, KvantKeyMapOutput, KvantKeyMapRawInput } from '../../defs/schema'
import type {
  KvantReactAdapter,
  KvantReactAdapterInterface,
  KvantReactAdapterOptions,
  KvantReactAdapterValue,
} from '../defs/adapter'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useEventBus } from '../../events/bus'
import { parseMap } from '../../parse'

export type KvantSetState<
  A extends KvantReactAdapter | KvantAdapter,
  M extends KvantKeyMap<KvantReactAdapterValue<A>>,
> = (
  state: SetStateAction<KvantKeyMapOutput<M>>,
  options?: Partial<KvantReactAdapterOptions<A>>,
) => void

function useNormalizedAdapter<A extends KvantReactAdapter | KvantAdapter>(
  adapter: A,
  keys: string[],
): KvantReactAdapterInterface<
  KvantReactAdapterValue<A>,
  KvantReactAdapterOptions<A>
> {
  const standaloneAdapterRef = useRef<KvantAdapterInterface>(null)

  if (!standaloneAdapterRef.current) {
    const api = adapter(keys)
    if ('snapshot' in api) {
      return api as KvantReactAdapterInterface<
        KvantReactAdapterValue<A>,
        KvantReactAdapterOptions<A>
      >
    }

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
  } as KvantReactAdapterInterface<
    KvantReactAdapterValue<A>,
    KvantReactAdapterOptions<A>
  >
}

export function useKvantStates<
  A extends KvantReactAdapter | KvantAdapter,
  M extends KvantKeyMap<KvantReactAdapterValue<A>>,
>(
  adapter: A,
  keyMap: M,
  options: Partial<KvantReactAdapterOptions<A>> = {},
): [
  KvantKeyMapOutput<M>,
  KvantSetState<A, M>,
] {
  const { key: adapterKey, snapshot, update } = useNormalizedAdapter(adapter, Object.keys(keyMap))

  const [internalState, setInternalState] = useState<KvantKeyMapOutput<M>>(
    () => parseMap(
      keyMap,
      snapshot as Record<string, KvantKeyMapRawInput<M>>,
    ),
  )

  const snapshotCacheRef = useRef<Record<string, KvantKeyMapRawInput<M> | undefined>>({})
  const stateCacheRef = useRef<KvantKeyMapOutput<M>>(internalState)

  useEffect(() => {
    const state = parseMap(
      keyMap,
      snapshot as Record<string, KvantKeyMapRawInput<M>>,
      {
        snapshot: snapshotCacheRef.current,
        state: stateCacheRef.current,
      },
    )
    stateCacheRef.current = state
    setInternalState(state)
  }, [JSON.stringify(snapshot)])

  const bus = useEventBus<SyncEvent>(`sync:${adapterKey}`)

  useEffect(() => bus.on((event) => {
    setInternalState((currentState) => {
      let newState = currentState
      event.updates.forEach((item) => {
        if (
          !Object.keys(keyMap).includes(item.key)
          // || item.rawValue === snapshotCacheRef.current[item.key]
        ) {
          return
        }

        const schema = keyMap[item.key]!
        const value = item.schema !== schema ? schema.parse(item.rawValue) : item.value
        if (value === newState[item.key])
          return

        snapshotCacheRef.current[item.key] = item.rawValue
        newState = { ...newState, [item.key]: value }
      })
      stateCacheRef.current = newState
      return newState
    })
  }), [])

  const setState: KvantSetState<A, M> = useCallback((newState, callOptions) => {
    newState = typeof newState === 'function'
      ? newState(stateCacheRef.current)
      : newState

    const updates: SyncEventItem[] = Object.entries(newState).map(([key, value]) => {
      const schema = keyMap[key]!
      const rawValue = schema.encode(value)
      return {
        key,
        rawValue,
        schema,
        value,
      }
    })

    bus.emit({ type: 'sync', updates })

    // TODO: Throttle, debounce
    update(
      Object.fromEntries(
        updates.map(({ key, rawValue }) => [key, rawValue]),
      ),
      { ...options, ...callOptions },
    )
  }, [
    ...Object.entries(options).flat(),
    bus.emit,
  ])

  return [internalState, setState]
}
