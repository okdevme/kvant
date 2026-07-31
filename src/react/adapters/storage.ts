import { useLocalStorageKvantAdapter, useSessionStorageKvantAdapter } from '../../adapters/storage'
import { defineKvantState } from '../utils/defineKvantState'

export const {
  useState: useLocalStorage,
  OptionsProvider: LocalStorageOptionsProvider,
} = defineKvantState(useLocalStorageKvantAdapter)
export const {
  useState: useSessionStorage,
  OptionsProvider: SessionStorageOptionsProvider,
} = defineKvantState(useSessionStorageKvantAdapter)
