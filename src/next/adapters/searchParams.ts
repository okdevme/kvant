import type { KvantReactAdapter, KvantReactAdapterInterface } from '../../react'
import type { KvantAdapterUpdateFn } from '../../types/adapter'
import type { SearchParamsValue } from '../../utils/search'
import { useSearchParams as _useSearchParams, useRouter } from 'next/navigation'
import { startTransition, useCallback, useMemo, useOptimistic } from 'react'
import { defaultWindow } from '../../globals'
import { defineKvantState } from '../../react'
import { parseSearch, stringifySearch, withSearch } from '../../utils/search'
import { normalizeSnapshot } from '../../utils/snapshot'

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
   * Writes the URL via the native history API, without triggering
   * a Next.js navigation (server round-trip).
   *
   * @default true
   */
  shallow?: boolean
  /**
   * Scrolls to the top after writing the URL.
   *
   * @default false
   */
  scroll?: boolean
}

export type SearchParamsKvantAdapter = KvantReactAdapter<
  SearchParamsValue,
  SearchParamsKvantAdapterOptions<SearchParamsValue>
>

export function useSearchParamsKvantAdapter<T>(
  keys: string[],
  options: SearchParamsKvantAdapterOptions<T>,
): KvantReactAdapterInterface<T> {
  const {
    parseSearch,
    stringifySearch,
    history: mode = 'replace',
    shallow = true,
    scroll = false,
  } = options

  const router = useRouter()
  const searchParams = _useSearchParams()
  const [optimisticSearch, setOptimisticSearch]
    = useOptimistic<string>(searchParams.toString())

  const snapshot = useMemo(
    () => normalizeSnapshot(
      parseSearch(optimisticSearch),
      keys,
    ),
    [optimisticSearch],
  )

  const update: KvantAdapterUpdateFn = useCallback((values) => {
    const location = defaultWindow?.location
    if (!location)
      return

    startTransition(() => {
      const search = stringifySearch({
        ...parseSearch(location.search),
        ...values,
      })
      if (!shallow) {
        setOptimisticSearch(search)
      }
      const url = withSearch(location, search).toString()
      history[`${mode}State`](
        null,
        '',
        url,
      )
      if (scroll) {
        defaultWindow?.scrollTo(0, 0)
      }
      if (!shallow) {
        router.replace(url, {
          scroll: false,
        })
      }
    })
  }, [])

  return {
    key: 'next:app:search-params',
    snapshot,
    update,
  }
}

export const {
  useState: useSearchParams,
  OptionsProvider: SearchParamsOptionsProvider,
} = defineKvantState<SearchParamsKvantAdapter>(
  (keys, options) => useSearchParamsKvantAdapter(keys, {
    parseSearch,
    stringifySearch,
    ...options,
  }),
)
