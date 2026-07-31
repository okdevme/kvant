import { useCookiesKvantAdapter } from '../../adapters/cookies'
import { defineKvantState } from '../utils/defineKvantState'

export const useCookies = defineKvantState(useCookiesKvantAdapter)
