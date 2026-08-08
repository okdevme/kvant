import type { KvantGenericSchema } from './schema'

/** A single key update flowing through the sync bus. */
export interface Update {
  /** Updated key. */
  key: string
  /** Encoded (raw) value, as written to the storage. */
  value: any
  /** Schema used to encode the value. Lets listeners skip re-parsing when it matches their own. */
  schema?: KvantGenericSchema
  /** Decoded state value, reused by listeners whose schema matches `schema`. */
  state?: any
}

/** Broadcast event carrying a batch of key updates. */
export interface SyncEvent {
  type: 'sync'
  updates: Update[]
}
