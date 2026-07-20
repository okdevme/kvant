import type {
  KvantAdapter,
  KvantAdapterInterface,
  KvantAdapterOptions,
  KvantAdapterUpdateFn,
  KvantAdapterValue,
} from '../../defs/adapter'

export interface KvantReactAdapterInterface<
  T = any,
  Options extends object = Record<string, unknown>,
> {
  readonly key: string
  readonly snapshot: Record<string, T | undefined>
  readonly update: KvantAdapterUpdateFn<Options>
}

export type KvantReactAdapter<
  T = any,
  Options extends object = Record<string, unknown>,
> = (keys: string[]) => KvantReactAdapterInterface<T, Options>

export type KvantReactAdapterValue<
  T extends KvantReactAdapter | KvantReactAdapterInterface | KvantAdapter | KvantAdapterInterface,
> = T extends KvantReactAdapter<infer U>
  ? U | undefined
  : T extends KvantReactAdapterInterface<infer U>
    ? U | undefined
    : KvantAdapterValue<T>

export type KvantReactAdapterOptions<
  T extends KvantReactAdapter | KvantReactAdapterInterface | KvantAdapter | KvantAdapterInterface,
> = T extends KvantReactAdapter<any, infer U>
  ? U
  : T extends KvantReactAdapterInterface<any, infer U>
    ? U
    : KvantAdapterOptions<T>
