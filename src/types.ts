export type KvantAdapterWatchCallback<T> = (key?: string | undefined, value?: T | undefined) => void

export interface KvantAdapter<
  T = unknown,
  Options extends Record<string, unknown> | undefined = undefined,
> {
  readonly get: (key: string) => T | undefined
  readonly set: (key: string, value: unknown, options?: Options) => void
  readonly watch: (callback: KvantAdapterWatchCallback<T>) => () => void
}

export type KvantGenericAdapter = KvantAdapter<any, any>
export type KvantAdapterValue<T extends KvantGenericAdapter> = T extends KvantAdapter<infer U> ? U | undefined : never
export type KvantAdapterOptions<T extends KvantGenericAdapter> = T extends KvantAdapter<any, infer U> ? U : never

export interface KvantDisposableAdapter<
  T = unknown,
  Options extends Record<string, unknown> | undefined = undefined,
> extends KvantAdapter<T, Options> {
  readonly dispose: () => void
}

export interface KvantSchema<Output, Input = Output, RawInput = unknown> {
  readonly parse: (value: RawInput) => Output
  readonly encode: (value: Output) => Input
}

export type KvantGenericSchema<RawInput = any> = KvantSchema<any, any, RawInput>

export type KvantSchemaOutput<S extends KvantGenericSchema>
  = S extends KvantSchema<infer Output, any, any>
    ? Output
    : never

export type KvantSchemaInput<S extends KvantGenericSchema>
  = S extends KvantSchema<any, infer Input, any>
    ? Input
    : never

export type KvantSchemaRawInput<S extends KvantGenericSchema>
  = S extends KvantSchema<any, any, infer RawInput>
    ? RawInput
    : never
