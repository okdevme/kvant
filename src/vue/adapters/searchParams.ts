import { useSearchParamsKvantAdapter } from '../../adapters/searchParams'
import { defineKvantState } from '../utils/defineKvantState'

export const {
  useState: useSearchParams,
  provideOptions: provideSearchParamsOptions,
} = defineKvantState(useSearchParamsKvantAdapter)
