import type { KvantReactAdapter } from '../../../react'
import type { KvantAdapterUpdateFn } from '../../../types/adapter'
import { useSearchParams as _useSearchParams, useRouter } from 'next/navigation'
import { startTransition, useCallback, useMemo, useOptimistic } from 'react'
import { defineKvantState } from '../../../react'

export interface SearchParamsKvantAdapterOptions {
  shallow?: boolean
  history?: 'push' | 'replace'
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
      shallow = true,
      scroll = false,
      history: historyMethod = 'replace',
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
      // debug('[nuqs next/app] Updating url: %s', url)
      // First, update the URL locally without triggering a network request,
      // this allows keeping a reactive URL if the network is slow.
      const updateMethod
        = historyMethod === 'push' ? history.pushState : history.replaceState
      // Since replaceState calls are not monitored (see patchHistory above),
      // the mutex is not needed to absorb cascade calls — they go undetected.
      // Set to 0 so that the next external pushState immediately resets.
      // setQueueResetMutex(0)
      updateMethod.call(
        history,
        // In next@14.1.0, useSearchParams becomes reactive to shallow updates,
        // but only if passing `null` as the history state.
        null,
        '', // historyUpdateMarker,
        url,
      )
      if (scroll) {
        window.scrollTo(0, 0)
      }
      if (!shallow) {
        // Call the Next.js router to perform a network request
        // and re-render server components.
        router.replace(url, {
          scroll: false,
        })
      }
    })
  }, [])

  return {
    key: 'next:app',
    snapshot,
    update,
  }
}

export const useSearchParams = defineKvantState(useSearchParamsKvantAdapter)
