import type { KvantReactAdapter } from '../../react'
import type { KvantAdapterUpdateFn } from '../../types/adapter'
import { useCallback, useMemo } from 'react'
import { useSearchParams as _useSearchParams, useNavigate } from 'react-router'
import { defaultWindow } from '../../globals'
import { defineKvantState } from '../../react'
import { applySearchValues, searchToObject, withSearch } from '../../utils/search'

export interface SearchParamsKvantAdapterOptions {
  history?: 'push' | 'replace'
  scroll?: boolean
}

export type SearchParamsKvantAdapter = KvantReactAdapter<
  string | string[],
  SearchParamsKvantAdapterOptions
>

export const useSearchParamsKvantAdapter: SearchParamsKvantAdapter = (keys, options) => {
  const {
    history: historyMethod = 'replace',
    scroll = false,
  } = options

  const [searchParams] = _useSearchParams()
  const snapshot = useMemo(
    () => searchToObject(searchParams, keys),
    [searchParams],
  )

  const navigate = useNavigate()
  const update: KvantAdapterUpdateFn = useCallback((values) => {
    const location = defaultWindow?.location
    if (!location)
      return

    const url = withSearch(
      location,
      applySearchValues(location.search, values),
    )
    navigate({
      search: url.search,
      hash: url.hash,
    }, {
      replace: historyMethod === 'replace',
      preventScrollReset: !scroll,
    })
  }, [navigate])

  return {
    key: 'react-router:search-params',
    snapshot,
    update,
  }
}

export const useSearchParams = defineKvantState(useSearchParamsKvantAdapter)
