import { useCookiesKvantAdapter } from '../../adapters/cookies'
import { defineKvantState } from '../utils/defineKvantState'

export const {
  useState: useCookies,
  OptionsProvider: CookiesOptionsProvider,
} = defineKvantState(useCookiesKvantAdapter)
