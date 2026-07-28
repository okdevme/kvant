import type { Ref } from 'vue'
import type {
  KvantAdapter,
  KvantAdapterInterface,
  KvantAdapterOptions,
  KvantAdapterUpdateFn,
  KvantAdapterValue,
} from '../../defs/adapter'

export interface KvantVueAdapterInterface<
  T = any,
  Options extends object = Record<string, unknown>,
> {
  readonly key: string
  readonly snapshot: Readonly<Ref<Record<string, T | undefined>>>
  readonly update: KvantAdapterUpdateFn<Options>
}

export type KvantVueAdapter<
  T = any,
  Options extends object = Record<string, unknown>,
> = (keys: string[]) => KvantVueAdapterInterface<T, Options>

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
  T extends KvantVueAdapter | KvantVueAdapterInterface | KvantAdapter | KvantAdapterInterface,
> = T extends KvantVueAdapter<any, infer U>
  ? U
  : T extends KvantVueAdapterInterface<any, infer U>
    ? U
    : T extends KvantAdapter | KvantAdapterInterface
      ? KvantAdapterOptions<T>
      : never
