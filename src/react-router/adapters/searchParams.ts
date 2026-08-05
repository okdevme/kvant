import type { KvantReactAdapter, KvantReactAdapterInterface } from '../../react'
import type { KvantAdapterUpdateFn } from '../../types/adapter'
import type { SearchParamsValue } from '../../utils/search'
import { useCallback, useMemo } from 'react'
import { useSearchParams as _useSearchParams, useNavigate } from 'react-router'
import { defaultWindow } from '../../globals'
import { defineKvantState } from '../../react'
import { parseSearch, stringifySearch, withSearch } from '../../utils/search'
import { normalizeSnapshot } from '../../utils/snapshot'

// TODO: shallow routing
// react-router doesn't have first-party support for it,
// so we will have to set up custom useSearchParams hook and patch native history API
export interface SearchParamsKvantAdapterOptions<T> {
  parseSearch: (search: string) => Record<string, T | undefined>
  stringifySearch: (values: Record<string, unknown>) => string
  history?: 'push' | 'replace'
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
    scroll = false,
  } = options

  const [searchParams] = _useSearchParams()

  const snapshot = useMemo(
    () => normalizeSnapshot(
      parseSearch(searchParams.toString()),
      keys,
    ),
    [searchParams],
  )

  const navigate = useNavigate()
  const update: KvantAdapterUpdateFn = useCallback((values) => {
    const location = defaultWindow?.location
    if (!location)
      return

    const url = withSearch(
      location,
      stringifySearch({
        ...parseSearch(location.search),
        ...values,
      }),
    )
    navigate({
      search: url.search,
      hash: url.hash,
    }, {
      replace: mode === 'replace',
      preventScrollReset: !scroll,
    })
  }, [navigate])

  return {
    key: 'react-router:search-params',
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
