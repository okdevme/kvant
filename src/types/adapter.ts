/**
 * Writes raw key-value updates to the underlying storage.
 * An `undefined` value removes the key.
 */
export type KvantAdapterUpdateFn = (values: Record<string, unknown>) => void

/**
 * Low-level, framework-agnostic adapter contract.
 * Exposes a snapshot with subscribe/notify semantics,
 * compatible with `useSyncExternalStore` and shallow refs.
 */
export interface KvantAdapterInterface<T = any> {
  /** Unique adapter identifier, used to namespace sync channels. */
  readonly key: string
  /** Subscribes to snapshot changes. Returns an unsubscribe function. */
  readonly subscribe: (callback: () => void) => () => void
  /** Returns the current raw values for the adapter's keys. */
  readonly getSnapshot: () => Record<string, T | undefined>
  /** Writes raw values to the underlying storage. */
  readonly update: KvantAdapterUpdateFn
  /** Releases listeners and subscriptions. */
  readonly dispose?: () => void
}

export type KvantAdapter<
  T = any,
  Options extends object = Record<string, unknown>,
> = (
  keys: string[],
  options: Partial<Options>,
) => KvantAdapterInterface<T>

export type KvantAdapterValue<T extends KvantAdapter | KvantAdapterInterface> = T extends KvantAdapter<infer U>
  ? U | undefined
  : T extends KvantAdapterInterface<infer U>
    ? U | undefined
    : never

export type KvantAdapterOptions<T extends KvantAdapter> = T extends KvantAdapter<any, infer U>
  ? U
  : never
