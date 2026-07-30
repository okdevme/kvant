import type { LocationQueryValue, LocationQueryValueRaw } from 'vue-router'
import type { KvantAdapterUpdateFn } from '../../types/adapter'
import type { KvantVueAdapter } from '../../vue'
import { navigateTo, useRoute } from 'nuxt/app'
import { computed } from 'vue'
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

  const route = useRoute()

  const snapshot = computed(() => pick(route.query, keys))

  const update: KvantAdapterUpdateFn = (values) => {
    const { params, query, hash } = route
    navigateTo({
      params,
      query: {
        ...query,
        ...mapValues(values, normalizeValue),
      },
      hash,
    }, {
      replace: mode === 'replace',
    })
  }

  return {
    key: 'nuxt:query',
    snapshot,
    update,
  }
}

export const useRouteQuery = defineKvantState(useRouteQueryKvantAdapter)
