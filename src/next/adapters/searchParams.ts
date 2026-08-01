import type { KvantReactAdapter } from '../../react'
import type { KvantAdapterUpdateFn } from '../../types/adapter'
import { useSearchParams as _useSearchParams, useRouter } from 'next/navigation'
import { startTransition, useCallback, useMemo, useOptimistic } from 'react'
import { defaultWindow } from '../../globals'
import { defineKvantState } from '../../react'
import { applySearchValues, searchToObject, withSearch } from '../../utils/search'

export interface SearchParamsKvantAdapterOptions {
  history?: 'push' | 'replace'
  shallow?: boolean
  scroll?: boolean
}

export type SearchParamsKvantAdapter = KvantReactAdapter<
  string | string[],
  SearchParamsKvantAdapterOptions
>

export const useSearchParamsKvantAdapter: SearchParamsKvantAdapter = (keys, options) => {
  const {
    history: mode = 'replace',
    shallow = true,
    scroll = false,
  } = options

  const router = useRouter()
  const searchParams = _useSearchParams()
  const [optimisticSearchParams, setOptimisticSearchParams]
    = useOptimistic<URLSearchParams>(searchParams)
  const snapshot = useMemo(
    () => searchToObject(optimisticSearchParams, keys),
    [optimisticSearchParams],
  )

  const update: KvantAdapterUpdateFn = useCallback((values) => {
    const location = defaultWindow?.location
    if (!location)
      return

    startTransition(() => {
      const search = applySearchValues(location.search, values)
      if (!shallow) {
        setOptimisticSearchParams(search)
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
} = defineKvantState(useSearchParamsKvantAdapter)
