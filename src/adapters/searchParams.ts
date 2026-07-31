import type { KvantAdapter, KvantAdapterUpdateFn } from '../types/adapter'
import type { SnapshotRaw } from '../utils/snapshot'
import { useEventBus } from '../events/bus'
import { createEventHook } from '../events/hook'
import { defaultWindow, isClient } from '../globals'
import { applySearchValues, searchToObject, withSearch } from '../utils/search'
import { normalizeSnapshot } from '../utils/snapshot'

export interface SearchParamsKvantAdapterOptions {
  history?: 'push' | 'replace'
  scroll?: boolean
  fallback?: string | URLSearchParams | SnapshotRaw<string | string[] | undefined>
}

export type SearchParamsKvantAdapter = KvantAdapter<
  string | string[],
  SearchParamsKvantAdapterOptions
>

export const useSearchParamsKvantAdapter: SearchParamsKvantAdapter = (keys, options) => {
  const {
    history: mode = 'replace',
    scroll = false,
    fallback = {},
  } = options

  let search = defaultWindow?.location.search ?? ''
  let snapshot = normalizeSnapshot(
    defaultWindow
      ? searchToObject(defaultWindow.location.search, keys)
      : typeof fallback === 'string' || fallback instanceof URLSearchParams
        ? searchToObject(fallback, keys)
        : fallback,
    keys,
  )

  const adapterKey = 'search-params'
  const bus = useEventBus<'sync'>(`adapter:${adapterKey}`)
  const hook = createEventHook()

  const onSync = (): void => {
    if (defaultWindow?.location.search === search)
      return

    search = defaultWindow?.location.search ?? ''
    snapshot = searchToObject(search, keys)
    hook.trigger()
  }

  if (isClient) {
    bus.on(onSync)
    defaultWindow?.addEventListener('popstate', onSync)
  }
  const dispose = (): void => {
    hook.clear()
    bus.off(onSync)
    defaultWindow?.removeEventListener('popstate', onSync)
  }

  const update: KvantAdapterUpdateFn = (values) => {
    if (!defaultWindow)
      return

    defaultWindow.history[`${mode}State`](
      defaultWindow.history.state,
      '',
      withSearch(
        defaultWindow.location,
        applySearchValues(defaultWindow.location.search, values),
      ),
    )
    bus.emit('sync')

    if (scroll) {
      defaultWindow?.scrollTo(0, 0)
    }
  }

  return {
    key: adapterKey,
    subscribe: hook.on,
    getSnapshot: () => snapshot,
    update,
    dispose,
  }
}
