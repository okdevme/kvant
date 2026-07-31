import { pick } from './object'

export type SnapshotRaw<T> = Record<string, T> | ((key: string) => T)

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
