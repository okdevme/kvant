import type { KvantGenericSchema } from './schema'

export interface Update {
  key: string
  rawValue: any
  schema?: KvantGenericSchema
  value?: any
}

export interface SyncEvent {
  type: 'sync'
  updates: Update[]
}
