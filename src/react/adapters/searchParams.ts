import { useSearchParamsKvantAdapter } from '../../adapters/searchParams'
import { defineKvantState } from '../utils/defineKvantState'

export const useSearchParams = defineKvantState(useSearchParamsKvantAdapter)
