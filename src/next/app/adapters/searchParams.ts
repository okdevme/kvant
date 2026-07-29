import type { KvantReactAdapter } from '../../../react'
import type { KvantAdapterUpdateFn } from '../../../types/adapter'
import { useSearchParams as _useSearchParams, useRouter } from 'next/navigation'
import { startTransition, useCallback, useMemo, useOptimistic } from 'react'
import { defaultWindow } from '../../../globals'
import { defineKvantState } from '../../../react'

export interface SearchParamsKvantAdapterOptions {
  history?: 'push' | 'replace'
  shallow?: boolean
  scroll?: boolean
}

export type SearchParamsKvantAdapter = KvantReactAdapter<
  string | string[],
  SearchParamsKvantAdapterOptions
>

function toSnapshot(
  searchParams: URLSearchParams,
  keys: string[],
): Record<string, string | string[] | undefined> {
  return Object.fromEntries(
    keys.map((key) => {
      const values = searchParams.getAll(key)
      return [
        key,
        values.length > 1
          ? values
          : values[0],
      ]
    }),
  )
}

function applyValues(
  searchParams: URLSearchParams,
  values: Record<string, unknown>,
): URLSearchParams {
  for (const [key, value] of Object.entries(values)) {
    searchParams.delete(key)
    if (Array.isArray(value))
      value.forEach(entry => searchParams.append(key, String(entry)))
    else if (value !== undefined)
      searchParams.set(key, String(value))
  }
  return searchParams
}

function renderURL(searchParams: URLSearchParams): string {
  const { origin, pathname, hash } = location
  const search = searchParams.size > 0
    ? `?${searchParams.toString()}`
    : ''
  return origin + pathname + search + hash
}

export const useSearchParamsKvantAdapter: SearchParamsKvantAdapter = (keys) => {
  const router = useRouter()
  const searchParams = _useSearchParams()
  const [optimisticSearchParams, setOptimisticSearchParams]
    = useOptimistic<URLSearchParams>(searchParams)
  const snapshot = useMemo(
    () => toSnapshot(optimisticSearchParams, keys),
    [optimisticSearchParams],
  )

  const update: KvantAdapterUpdateFn<SearchParamsKvantAdapterOptions> = useCallback((values, options = {}) => {
    const {
      history: historyMethod = 'replace',
      shallow = true,
      scroll = false,
    } = options

    startTransition(() => {
      const search = applyValues(
        new URLSearchParams(location.search),
        values,
      )
      if (!shallow) {
        setOptimisticSearchParams(search)
      }
      const url = renderURL(search)
      history[`${historyMethod}State`](
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

export const useSearchParams = defineKvantState(useSearchParamsKvantAdapter)
