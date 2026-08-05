import { useSearchParamsKvantAdapter } from '../../adapters/searchParams'
import { parseSearch, stringifySearch } from '../../utils/search'
import { defineKvantState } from '../utils/defineKvantState'

export const {
  useState: useSearchParams,
  OptionsProvider: SearchParamsOptionsProvider,
} = defineKvantState(
  (keys, options) => useSearchParamsKvantAdapter(keys, {
    ...options,
    parseSearch,
    stringifySearch,
  }),
)
