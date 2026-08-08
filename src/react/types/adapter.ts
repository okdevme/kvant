import type {
  KvantAdapter,
  KvantAdapterInterface,
  KvantAdapterOptions,
  KvantAdapterUpdateFn,
  KvantAdapterValue,
} from '../../types/adapter'

export interface KvantReactAdapterInterface<T = any> {
  /** Unique adapter identifier, used to namespace sync channels. */
  readonly key: string
  /** Current raw values for the adapter's keys. Must be referentially stable between changes. */
  readonly snapshot: Readonly<Record<string, T | undefined>>
  /** Writes raw values to the underlying storage. */
  readonly update: KvantAdapterUpdateFn
}

export type KvantReactAdapter<
  T = any,
  Options extends object = Record<string, unknown>,
> = (
  keys: string[],
  options: Partial<Options>,
) => KvantReactAdapterInterface<T>

export type KvantReactAdapterValue<
  T extends KvantReactAdapter | KvantReactAdapterInterface | KvantAdapter | KvantAdapterInterface,
> = T extends KvantReactAdapter<infer U>
  ? U | undefined
  : T extends KvantReactAdapterInterface<infer U>
    ? U | undefined
    : T extends KvantAdapter | KvantAdapterInterface
      ? KvantAdapterValue<T>
      : never

export type KvantReactAdapterOptions<
  T extends KvantReactAdapter | KvantAdapter,
> = T extends KvantReactAdapter<any, infer U>
  ? U
  : T extends KvantAdapter
    ? KvantAdapterOptions<T>
    : never
