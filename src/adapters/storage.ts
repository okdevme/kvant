import type { KvantAdapter, KvantAdapterInterface, KvantAdapterUpdateFn } from '../types/adapter'
import type { SyncEvent, Update } from '../types/sync'
import type { SnapshotRaw } from '../utils/snapshot'
import { useEventBus } from '../events/bus'
import { createEventHook } from '../events/hook'
import { defaultWindow, isClient } from '../globals'
import { mapValues } from '../utils/object'
import { normalizeSnapshot } from '../utils/snapshot'

export interface StorageKvantAdapterOptions {
  /** Values used when the storage is unavailable (SSR). */
  fallback?: SnapshotRaw<string | null | undefined>
}

/**
 * Creates an adapter factory for a given Web Storage instance.
 *
 * @param storage - storage instance, may be `undefined` during SSR
 * @param storageKey - unique identifier for the storage instance
 */
export function useStorageKvantAdapter(
  storage: Storage | undefined,
  storageKey: string,
  keys: string[],
  options: StorageKvantAdapterOptions,
): KvantAdapterInterface<string> {
  const {
    fallback = {},
  } = options

  let snapshot: Record<string, string | undefined> = mapValues(
    normalizeSnapshot(
      storage?.getItem ?? fallback,
      keys,
    ),
    value => value ?? undefined,
  )

  const adapterKey = `storage:${storageKey}`
  const bus = useEventBus<SyncEvent>(`adapter:${adapterKey}`)
  const hook = createEventHook()

  const onSync = (event: SyncEvent): void => {
    let hasChanged = false
    for (const item of event.updates) {
      if (
        !keys.includes(item.key)
        || item.value === snapshot[item.key]
      ) {
        continue
      }

      snapshot = { ...snapshot, [item.key]: item.value }
      hasChanged = true
    }

    if (hasChanged)
      hook.trigger()
  }

  const onStorageEvent = (event: StorageEvent): void => {
    if (event.storageArea !== storage)
      return

    if (event.key === null) {
      onSync({
        type: 'sync',
        updates: keys.map(key => ({ key, value: undefined })),
      })
    }
    else if (keys.includes(event.key)) {
      onSync({
        type: 'sync',
        updates: [{ key: event.key, value: event.newValue ?? undefined }],
      })
    }
  }

  if (isClient) {
    bus.on(onSync)
    defaultWindow?.addEventListener('storage', onStorageEvent)
  }
  const dispose = (): void => {
    hook.clear()
    bus.off(onSync)
    defaultWindow?.removeEventListener('storage', onStorageEvent)
  }

  const update: KvantAdapterUpdateFn = (values) => {
    if (!storage)
      return

    const updates: Update[] = []
    for (const key in values) {
      const value = values[key] !== undefined ? String(values[key]) : undefined

      if (value !== undefined)
        storage.setItem(key, value)
      else
        storage.removeItem(key)

      updates.push({ key, value })
    }

    if (updates.length)
      bus.emit({ type: 'sync', updates })
  }

  return {
    key: adapterKey,
    subscribe: hook.on,
    getSnapshot: () => snapshot,
    update,
    dispose,
  }
}

export type StorageKvantAdapter = KvantAdapter<string>

export const useLocalStorageKvantAdapter: StorageKvantAdapter
  = (keys, options) => useStorageKvantAdapter(defaultWindow?.localStorage, 'local', keys, options)

export const useSessionStorageKvantAdapter: StorageKvantAdapter
  = (keys, options) => useStorageKvantAdapter(defaultWindow?.sessionStorage, 'session', keys, options)
