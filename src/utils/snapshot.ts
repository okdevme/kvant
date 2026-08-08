import { pick } from './object'

/** Snapshot source: a record of raw values or a getter resolving a value per key. */
export type SnapshotRaw<T> = Record<string, T> | ((key: string) => T)

/** Normalizes a snapshot source into a record limited to the given keys. */
export function normalizeSnapshot<T>(
  snapshot: SnapshotRaw<T>,
  keys: string[],
): Record<string, T> {
  return typeof snapshot === 'function'
    ? Object.fromEntries(
        keys.map(key => [key, snapshot(key)]),
      )
    : pick(snapshot, keys)
}
