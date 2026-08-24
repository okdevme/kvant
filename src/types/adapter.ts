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
  /**
   * Subscribes to snapshot changes.
   * @returns An unsubscribe function.
   */
  readonly subscribe: (callback: () => void) => () => void
  /** Returns the current raw values for the adapter's keys. */
  readonly getSnapshot: () => Record<string, T | undefined>
  /**
   * Returns the raw values as rendered on the server (SSR).
   * Used as the server snapshot during hydration,
   * the real client values are applied right after hydration.
   *
   * @default getSnapshot
   */
  readonly getServerSnapshot?: () => Record<string, T | undefined>
  /** Writes raw values to the underlying storage. */
  readonly update: KvantAdapterUpdateFn
  /**
   * Register necessary effects (listeners, subscriptions, etc.)
   * @returns A cleanup function to dispose of the effects.
   */
  readonly effects?: () => (() => void) | void
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
