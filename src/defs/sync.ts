import type { KvantGenericSchema } from './schema'

export interface Update {
  key: string
  value: any
  schema?: KvantGenericSchema
  state?: any
}

export interface SyncEvent {
  type: 'sync'
  updates: Update[]
}
