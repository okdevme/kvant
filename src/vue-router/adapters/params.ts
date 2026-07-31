import type {
  RouteParamValue,
  RouteParamValueRaw,
} from 'vue-router'
import type { KvantAdapterUpdateFn } from '../../types/adapter'
import type { KvantVueAdapter } from '../../vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mapValues, pick } from '../../utils/object'
import { defineKvantState } from '../../vue'

export interface RouteParamsKvantAdapterOptions {
  history?: 'push' | 'replace'
}

export type RouteParamsKvantAdapter = KvantVueAdapter<
  RouteParamValue | RouteParamValue[],
  RouteParamsKvantAdapterOptions
>

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

export const useRouteParamsKvantAdapter: RouteParamsKvantAdapter = (keys, options) => {
  const {
    history: mode = 'replace',
  } = options

  const router = useRouter()
  const route = useRoute()

  const snapshot = computed(() => pick(route.params, keys))

  const update: KvantAdapterUpdateFn = (values) => {
    const { params, query, hash } = route
    router[mode]({
      params: {
        ...params,
        ...mapValues(values, normalizeValue),
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

export const {
  useState: useRouteParams,
  provideOptions: provideRouteParamsOptions,
} = defineKvantState(useRouteParamsKvantAdapter)
