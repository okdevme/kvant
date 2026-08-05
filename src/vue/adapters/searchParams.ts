import { useSearchParamsKvantAdapter } from '../../adapters/searchParams'
import { parseSearch, stringifySearch } from '../../utils/search'
import { defineKvantState } from '../utils/defineKvantState'

export const {
  useState: useSearchParams,
  provideOptions: provideSearchParamsOptions,
} = defineKvantState(
  (keys, options) => useSearchParamsKvantAdapter(keys, {
    parseSearch,
    stringifySearch,
    ...options,
  }),
)
