import { useSearchParamsKvantAdapter } from '../../adapters/searchParams'
import { defineKvantState } from '../utils/defineKvantState'

export const {
  useState: useSearchParams,
  OptionsProvider: SearchParamsOptionsProvider,
} = defineKvantState(useSearchParamsKvantAdapter)
