import type {
  RouteParamsGeneric,
  RouteParamsRawGeneric,
  RouteParamValue,
  RouteParamValueRaw,
} from 'vue-router'
import type { KvantAdapterUpdateFn } from '../../types/adapter'
import type { KvantVueAdapter } from '../../vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { defineKvantState } from '../../vue'

export interface RouteParamsKvantAdapterOptions {
  history?: 'push' | 'replace'
}

export type RouteParamsKvantAdapter = KvantVueAdapter<
  RouteParamValue | RouteParamValue[],
  RouteParamsKvantAdapterOptions
>

function toSnapshot(
  params: RouteParamsGeneric,
  keys: string[],
): Record<string, RouteParamValue | RouteParamValue[]> {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([key]) => keys.includes(key)),
  )
}

function normalizeValue(
  value: unknown,
): RouteParamValueRaw | string[] {
  if (Array.isArray(value))
    return value.map(String)

  // Passing undefined when setting the state
  // results in the param not being updated and remaining in its previous state.
  // Passing an empty string instead results in the value properly becoming undefined.
  if (value == null)
    return ''

  return typeof value === 'string'
    || typeof value === 'number'
    ? value
    : String(value)
}

function normalizeValues(
  values: Record<string, unknown>,
): RouteParamsRawGeneric {
  return Object.fromEntries(
    Object.entries(values)
      .map(([key, value]) => [key, normalizeValue(value)]),
  )
}

export const useRouteParamsKvantAdapter: RouteParamsKvantAdapter = (keys) => {
  const router = useRouter()
  const route = useRoute()

  const snapshot = computed(() => toSnapshot(route.params, keys))

  const update: KvantAdapterUpdateFn<RouteParamsKvantAdapterOptions> = (values, options = {}) => {
    const {
      history: mode = 'replace',
    } = options

    const { params, query, hash } = route
    router[mode]({
      params: {
        ...params,
        ...normalizeValues(values),
      },
      query,
      hash,
    })
  }

  return {
    key: 'vue-router:params',
    snapshot,
    update,
  }
}

export const useRouteParams = defineKvantState(useRouteParamsKvantAdapter)
