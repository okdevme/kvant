import type { LocationQuery, LocationQueryRaw, LocationQueryValue, LocationQueryValueRaw } from 'vue-router'
import type { KvantAdapterUpdateFn } from '../../types/adapter'
import type { KvantVueAdapter } from '../../vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { defineKvantState } from '../../vue'

export interface RouteQueryKvantAdapterOptions {
  history?: 'push' | 'replace'
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

function normalizeItem(
  value: unknown,
): LocationQueryValueRaw {
  return typeof value === 'string'
    || typeof value === 'number'
    || value == null
    ? value
    : String(value)
}

function normalizeValue(
  value: unknown,
): LocationQueryValueRaw | LocationQueryValueRaw[] {
  return Array.isArray(value)
    ? value.map(normalizeItem)
    : normalizeItem(value)
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
  }

  return {
    key: 'vue-router:query',
    snapshot,
    update,
  }
}

export const useRouteQuery = defineKvantState(useRouteQueryKvantAdapter)
