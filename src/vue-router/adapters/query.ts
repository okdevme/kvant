import type { LocationQueryValue, LocationQueryValueRaw } from 'vue-router'
import type { KvantAdapterUpdateFn } from '../../types/adapter'
import type { KvantVueAdapter } from '../../vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mapValues, pick } from '../../utils/object'
import { defineKvantState } from '../../vue'

export interface RouteQueryKvantAdapterOptions {
  history?: 'push' | 'replace'
}

export type RouteQueryKvantAdapter = KvantVueAdapter<
  LocationQueryValue | LocationQueryValue[],
  RouteQueryKvantAdapterOptions
>

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

export const useRouteQueryKvantAdapter: RouteQueryKvantAdapter = (keys, options) => {
  const {
    history: mode = 'replace',
  } = options

  const router = useRouter()
  const route = useRoute()

  const snapshot = computed(() => pick(route.query, keys))

  const update: KvantAdapterUpdateFn = (values) => {
    const { params, query, hash } = route
    router[mode]({
      params,
      query: {
        ...query,
        ...mapValues(values, normalizeValue),
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

export const {
  useState: useRouteQuery,
  provideOptions: provideRouteQueryOptions,
} = defineKvantState(useRouteQueryKvantAdapter)
