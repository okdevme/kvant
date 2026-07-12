import type { KvantGenericSchema } from './schema'

export interface SyncEventItem {
  key: string
  rawValue: any
  schema?: KvantGenericSchema
  value?: any
}

export interface SyncEvent {
  type: 'sync'
  updates: SyncEventItem[]
}
