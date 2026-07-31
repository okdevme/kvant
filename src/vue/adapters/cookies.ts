import { useCookiesKvantAdapter } from '../../adapters/cookies'
import { defineKvantState } from '../utils/defineKvantState'

export const {
  useState: useCookies,
  provideOptions: provideCookiesOptions,
} = defineKvantState(useCookiesKvantAdapter)
