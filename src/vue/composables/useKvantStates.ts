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
import { getCurrentInstance, onMounted, onScopeDispose, ref, shallowRef, watch } from 'vue'
import { useEventBus } from '../../events/bus'
import { isClient } from '../../globals'
import { parseMap, syncMap } from '../../utils/map'
import { stateToUpdates, updatesToObject } from '../../utils/sync'
import { watchSyncIgnorable } from './watchSyncIgnorable'

function useNormalizedAdapter<A extends KvantVueAdapter | KvantAdapter>(
  adapter: A,
  keys: string[],
  options: Partial<KvantVueAdapterOptions<A>>,
): KvantVueAdapterInterface<
  KvantVueAdapterValue<A>
> {
  const api = adapter(keys, options)
  if ('snapshot' in api)
    return api

  // During hydration the root vnode's el is set to the SSR element before
  // any component setup runs, while plain client mounts never set it.
  const hydrating = !!api.getServerSnapshot && !!getCurrentInstance()?.root.vnode.el
  const snapshot = shallowRef(
    hydrating ? api.getServerSnapshot!() : api.getSnapshot(),
  )

  onMounted(() => {
    if (hydrating)
      snapshot.value = api.getSnapshot()

    const unsubscribe = api.subscribe(() => {
      snapshot.value = api.getSnapshot()
    })
    const dispose = api.effects?.()
    onScopeDispose(() => {
      unsubscribe()
      dispose?.()
    })
  })

  return {
    key: api.key,
    snapshot,
    update: api.update,
  }
}

/**
 * Binds a map of keys to a writable ref, parsed through the given schemas.
 * Writes go through the adapter and sync across composables sharing the same adapter.
 */
export function useKvantStates<
  A extends KvantVueAdapter | KvantAdapter,
  M extends KvantKeyMap<KvantVueAdapterValue<A>>,
>(
  adapter: A,
  keyMap: M,
  options: Partial<KvantVueAdapterOptions<A>> = {},
): Ref<KvantKeyMapOutput<M>> {
  const { key: adapterKey, snapshot, update } = useNormalizedAdapter(
    adapter,
    Object.keys(keyMap),
    options,
  )

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
    update(updatesToObject(updates))
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
