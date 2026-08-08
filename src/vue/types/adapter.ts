import type { Ref } from 'vue'
import type {
  KvantAdapter,
  KvantAdapterInterface,
  KvantAdapterOptions,
  KvantAdapterUpdateFn,
  KvantAdapterValue,
} from '../../types/adapter'

export interface KvantVueAdapterInterface<T = any> {
  /** Unique adapter identifier, used to namespace sync channels. */
  readonly key: string
  /** Current raw values for the adapter's keys. */
  readonly snapshot: Readonly<Ref<Record<string, T | undefined>>>
  /** Writes raw values to the underlying storage. */
  readonly update: KvantAdapterUpdateFn
}

export type KvantVueAdapter<
  T = any,
  Options extends object = Record<string, unknown>,
> = (
  keys: string[],
  options: Partial<Options>,
) => KvantVueAdapterInterface<T>

export type KvantVueAdapterValue<
  T extends KvantVueAdapter | KvantVueAdapterInterface | KvantAdapter | KvantAdapterInterface,
> = T extends KvantVueAdapter<infer U>
  ? U | undefined
  : T extends KvantVueAdapterInterface<infer U>
    ? U | undefined
    : T extends KvantAdapter | KvantAdapterInterface
      ? KvantAdapterValue<T>
      : never

export type KvantVueAdapterOptions<
  T extends KvantVueAdapter | KvantAdapter,
> = T extends KvantVueAdapter<any, infer U>
  ? U
  : T extends KvantAdapter
    ? KvantAdapterOptions<T>
    : never
