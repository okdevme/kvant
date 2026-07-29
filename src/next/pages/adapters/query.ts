import type { NextRouter } from 'next/router'
import type { ParsedUrlQuery, ParsedUrlQueryInput } from 'node:querystring'
import type { KvantReactAdapter } from '../../../react'
import type { KvantAdapterUpdateFn } from '../../../types/adapter'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { defaultWindow } from '../../../globals'
import { defineKvantState } from '../../../react'

declare global {
  interface Window {
    next?: {
      router?: NextRouter
    }
  }
}

export interface RouterQueryKvantAdapterOptions {
  history?: 'push' | 'replace'
  shallow?: boolean
  scroll?: boolean
}

export type RouterQueryKvantAdapter = KvantReactAdapter<
  string | string[],
  RouterQueryKvantAdapterOptions
>

function toSnapshot(
  params: ParsedUrlQuery,
  keys: string[],
): Record<string, string | string[] | undefined> {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([key]) => keys.includes(key)),
  )
}

function normalizeItem(
  value: unknown,
): string | number | boolean {
  return typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'boolean'
    ? value
    : String(value)
}

function normalizeValue(
  value: unknown,
): ParsedUrlQueryInput[string] {
  // Passing null or undefined back when setting the state
  // results in the value being set to an empty string.
  // Passing an empty array instead results in the value properly becoming undefined.
  if (value == null)
    return []

  return Array.isArray(value)
    ? value.map(normalizeItem)
    : normalizeItem(value)
}

function normalizeValues(
  values: Record<string, unknown>,
): ParsedUrlQueryInput {
  return Object.fromEntries(
    Object.entries(values)
      .map(([key, value]) => [key, normalizeValue(value)]),
  )
}

export const useRouterQueryKvantAdapter: RouterQueryKvantAdapter = (keys) => {
  const router = useRouter()
  const snapshot = useMemo(
    () => toSnapshot(router.query, keys),
    [JSON.stringify(router.query)],
  )

  const update: KvantAdapterUpdateFn<RouterQueryKvantAdapterOptions> = useCallback((values, options = {}) => {
    const {
      history: historyMethod = 'replace',
      shallow = true,
      scroll = false,
    } = options

    // While the Next.js team doesn't recommend using internals like this,
    // we need direct access to the pages router, as a bound/closured version from
    // useRouter may be out of date by the time the updateUrl function is called,
    // and would also cause updateUrl to not be referentially stable
    const router = defaultWindow?.next?.router
    if (!router)
      return

    router[historyMethod](
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          ...normalizeValues(values),
        },
        hash: location.hash,
      },
      undefined,
      { shallow, scroll },
    )
  }, [])

  return {
    key: 'next:pages:query',
    snapshot,
    update,
  }
}

export const useRouterQuery = defineKvantState(useRouterQueryKvantAdapter)
