import type { KvantReactAdapterInterface } from '../../react'
import type { KvantAdapterUpdateFn } from '../../types/adapter'
import { useSearchParams as _useSearchParams, useRouter } from 'next/navigation'
import { startTransition, useCallback, useMemo, useOptimistic } from 'react'
import { defaultWindow } from '../../globals'
import { defineKvantState } from '../../react'
import { parseSearch, stringifySearch, withSearch } from '../../utils/search'
import { normalizeSnapshot } from '../../utils/snapshot'

export interface SearchParamsKvantAdapterOptions<T> {
  parseSearch: (search: string) => Record<string, T | undefined>
  stringifySearch: (values: Record<string, unknown>) => string
  history?: 'push' | 'replace'
  shallow?: boolean
  scroll?: boolean
}

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
} = defineKvantState(
  (keys, options) => useSearchParamsKvantAdapter(keys, {
    parseSearch,
    stringifySearch,
    ...options,
  }),
)
