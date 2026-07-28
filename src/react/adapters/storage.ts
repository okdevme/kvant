import { useLocalStorageKvantAdapter, useSessionStorageKvantAdapter } from '../../adapters/storage'
import { defineKvantState } from '../utils/defineKvantState'

export const useLocalStorage = defineKvantState(useLocalStorageKvantAdapter)
export const useSessionStorage = defineKvantState(useSessionStorageKvantAdapter)
