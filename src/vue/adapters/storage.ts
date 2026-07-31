import { useLocalStorageKvantAdapter, useSessionStorageKvantAdapter } from '../../adapters/storage'
import { defineKvantState } from '../utils/defineKvantState'

export const {
  useState: useLocalStorage,
  provideOptions: provideLocalStorageOptions,
} = defineKvantState(useLocalStorageKvantAdapter)
export const {
  useState: useSessionStorage,
  provideOptions: provideSessionStorageOptions,
} = defineKvantState(useSessionStorageKvantAdapter)
