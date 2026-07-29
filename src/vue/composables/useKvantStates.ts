import type { Ref } from 'vue'
import type { KvantAdapter } from '../../types/adapter'
import type { KvantKeyMap, KvantKeyMapOutput, KvantKeyMapRawInput } from '../../types/schema'
import type { SyncEvent } from '../../types/sync'
import type {
  KvantVueAdapter,
  KvantVueAdapterInterface,
  KvantVueAdapterOptions,
  KvantVueAdapterValue,
} from '../types/adapter'
import { onScopeDispose, ref, shallowRef, watch } from 'vue'
import { parseMap, stateToUpdates, syncMap, updatesToObject } from '../../core'
import { useEventBus } from '../../events/bus'
import { isClient } from '../../globals'
import { watchSyncIgnorable } from './watchSyncIgnorable'

function useNormalizedAdapter<A extends KvantVueAdapter | KvantAdapter>(
  adapter: A,
  keys: string[],
): KvantVueAdapterInterface<
  KvantVueAdapterValue<A>,
  KvantVueAdapterOptions<A>
> {
  const api = adapter(keys)
  if ('snapshot' in api)
    return api

  const snapshot = shallowRef(api.getSnapshot())
  if (isClient) {
    onScopeDispose(
      api.subscribe(() => {
        snapshot.value = api.getSnapshot()
      }),
    )
  }

  return {
    key: api.key,
    snapshot,
    update: api.update,
  }
}

export function useKvantStates<
  A extends KvantVueAdapter | KvantAdapter,
  M extends KvantKeyMap<KvantVueAdapterValue<A>>,
>(
  adapter: A,
  keyMap: M,
  options: Partial<KvantVueAdapterOptions<A>> = {},
): Ref<KvantKeyMapOutput<M>> {
  const { key: adapterKey, snapshot, update } = useNormalizedAdapter(adapter, Object.keys(keyMap))

  const internalState = ref(
    parseMap(
      keyMap,
      snapshot.value,
    ),
  ) as Ref<KvantKeyMapOutput<M>>

  const snapshotCache: Record<string, KvantKeyMapRawInput<M> | undefined> = {}
  let stateCache: KvantKeyMapOutput<M> = internalState.value

  const bus = useEventBus<SyncEvent>(`vue:sync:${adapterKey}`)

  const { ignoreUpdates } = watchSyncIgnorable(internalState, (newState) => {
    const updates = stateToUpdates(
      keyMap,
      newState,
    )

    bus.emit({ type: 'sync', updates })

    // TODO: Throttle, debounce
    update(updatesToObject(updates), options)
  }, { deep: true })

  watch(snapshot, (snapshot) => {
    const state = parseMap(
      keyMap,
      snapshot,
      {
        snapshot: snapshotCache,
        state: stateCache,
      },
    )
    stateCache = state
    ignoreUpdates(() => internalState.value = state)
  }, { deep: true })

  if (isClient) {
    onScopeDispose(
      bus.on((event) => {
        const newState = syncMap(
          keyMap,
          internalState.value,
          event.updates,
          {
            snapshot: snapshotCache,
            state: stateCache,
          },
        )
        stateCache = newState
        ignoreUpdates(() => internalState.value = newState)
      }),
    )
  }

  return internalState
}
