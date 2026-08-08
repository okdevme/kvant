import type { KvantAdapter, KvantAdapterInterface, KvantAdapterUpdateFn } from '../types/adapter'
import type { SearchParamsValue } from '../utils/search'
import type { SnapshotRaw } from '../utils/snapshot'
import { useEventBus } from '../events/bus'
import { createEventHook } from '../events/hook'
import { defaultWindow, isClient } from '../globals'
import { withSearch } from '../utils/search'
import { normalizeSnapshot } from '../utils/snapshot'

export interface SearchParamsKvantAdapterOptions<T> {
  /** Parses the location search string into raw values. */
  parseSearch: (search: string) => Record<string, T | undefined>
  /** Serializes raw values back into a search string. */
  stringifySearch: (values: Record<string, unknown>) => string
  /**
   * History mode used when writing the URL.
   *
   * @default 'replace'
   */
  history?: 'push' | 'replace'
  /**
   * Scrolls to the top after writing the URL.
   *
   * @default false
   */
  scroll?: boolean
  /**
   * Search source used when `location` is unavailable (SSR):
   * a raw search string or per-key values/getter.
   */
  fallback?: string | SnapshotRaw<T | undefined>
}

export type SearchParamsKvantAdapter = KvantAdapter<
  SearchParamsValue,
  SearchParamsKvantAdapterOptions<SearchParamsValue>
>

export function useSearchParamsKvantAdapter<T>(
  keys: string[],
  options: SearchParamsKvantAdapterOptions<T>,
): KvantAdapterInterface<T> {
  const {
    parseSearch,
    stringifySearch,
    history: mode = 'replace',
    scroll = false,
    fallback = {},
  } = options

  let search: string
  let snapshot: Record<string, T | undefined>

  function reconcile(): void {
    search = defaultWindow?.location.search ?? ''
    snapshot = normalizeSnapshot(
      defaultWindow
        ? parseSearch(defaultWindow.location.search)
        : typeof fallback === 'string'
          ? parseSearch(fallback)
          : fallback,
      keys,
    )
  }
  reconcile()

  const adapterKey = 'search-params'
  const bus = useEventBus<'sync'>(`adapter:${adapterKey}`)
  const hook = createEventHook()

  const onSync = (): void => {
    if (defaultWindow?.location.search === search)
      return

    reconcile()
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
        stringifySearch({
          ...parseSearch(defaultWindow.location.search),
          ...values,
        }),
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
