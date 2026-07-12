export type KvantAdapterUpdateFn<Options extends Record<string, unknown> = Record<string, unknown>>
  = (values: Record<string, unknown>, options?: Partial<Options>) => void

export interface KvantAdapterInterface<
  T = unknown,
  Options extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly key: string
  readonly subscribe: (callback: () => void) => () => void
  readonly getSnapshot: () => Record<string, T | undefined>
  readonly update: KvantAdapterUpdateFn<Options>
  readonly dispose?: () => void
}

export type KvantAdapter<
  T = unknown,
  Options extends Record<string, unknown> = Record<string, unknown>,
> = (keys: string[]) => KvantAdapterInterface<T, Options>

export type KvantAdapterValue<T extends KvantAdapter | KvantAdapterInterface> = T extends KvantAdapter<infer U>
  ? U | undefined
  : T extends KvantAdapterInterface<infer U>
    ? U | undefined
    : never
export type KvantAdapterOptions<T extends KvantAdapter | KvantAdapterInterface> = T extends KvantAdapter<any, infer U>
  ? U
  : T extends KvantAdapterInterface<any, infer U>
    ? U
    : never
