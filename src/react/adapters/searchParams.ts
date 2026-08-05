import type { SearchParamsKvantAdapter } from '../../adapters/searchParams'
import { useSearchParamsKvantAdapter } from '../../adapters/searchParams'
import { parseSearch, stringifySearch } from '../../utils/search'
import { defineKvantState } from '../utils/defineKvantState'

export const {
  useState: useSearchParams,
  OptionsProvider: SearchParamsOptionsProvider,
} = defineKvantState<SearchParamsKvantAdapter>(
  (keys, options) => useSearchParamsKvantAdapter(keys, {
    parseSearch,
    stringifySearch,
    ...options,
  }),
)
