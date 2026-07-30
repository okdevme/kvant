export type KvantAdapterUpdateFn = (values: Record<string, unknown>) => void

export interface KvantAdapterInterface<T = any> {
  readonly key: string
  readonly subscribe: (callback: () => void) => () => void
  readonly getSnapshot: () => Record<string, T | undefined>
  readonly update: KvantAdapterUpdateFn
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
