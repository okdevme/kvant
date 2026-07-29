import type { LocationQuery, LocationQueryRaw, LocationQueryValue, LocationQueryValueRaw } from 'vue-router'
import type { KvantAdapterUpdateFn } from '../../types/adapter'
import type { KvantVueAdapter } from '../../vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { defaultWindow } from '../../globals'
import { defineKvantState } from '../../vue'

export interface RouteQueryKvantAdapterOptions {
  history?: 'push' | 'replace'
  scroll?: boolean
}

export type RouteQueryKvantAdapter = KvantVueAdapter<
  LocationQueryValue | LocationQueryValue[],
  RouteQueryKvantAdapterOptions
>

function toSnapshot(
  query: LocationQuery,
  keys: string[],
): Record<string, LocationQueryValue | LocationQueryValue[]> {
  return Object.fromEntries(
    Object.entries(query)
      .filter(([key]) => keys.includes(key)),
  )
}

function normalizeValue(
  value: unknown,
  nested: boolean = false,
): LocationQueryValueRaw | LocationQueryValueRaw[] {
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'undefined':
      return value
    case 'object':
      if (value === null)
        return null
      if (!nested && Array.isArray(value))
        return value.map(v => normalizeValue(v, true) as LocationQueryValueRaw)
      // falls through
    default:
      return String(value)
  }
}

function normalizeValues(
  values: Record<string, unknown>,
): LocationQueryRaw {
  return Object.fromEntries(
    Object.entries(values)
      .map(([key, value]) => [key, normalizeValue(value)]),
  )
}

export const useRouteQueryKvantAdapter: RouteQueryKvantAdapter = (keys) => {
  const router = useRouter()
  const route = useRoute()

  const snapshot = computed(() => toSnapshot(route.query, keys))

  const update: KvantAdapterUpdateFn<RouteQueryKvantAdapterOptions> = (values, options = {}) => {
    const {
      history: mode = 'replace',
      scroll = false,
    } = options

    const { params, query, hash } = route
    router[mode]({
      params,
      query: {
        ...query,
        ...normalizeValues(values),
      },
      hash,
    })

    if (scroll) {
      defaultWindow?.scrollTo(0, 0)
    }
  }

  return {
    key: 'vue-router:query',
    snapshot,
    update,
  }
}

export const useRouteQuery = defineKvantState(useRouteQueryKvantAdapter)
