import type { Prettify } from '../utils'

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

export type KvantKeyMap<RawInput = any> = Record<string, KvantGenericSchema<RawInput>>
export type KvantKeyMapRawInput<M extends KvantKeyMap> = M extends KvantKeyMap<infer RawInput> ? RawInput : never
export type KvantKeyMapInput<M extends KvantKeyMap> = Prettify<{ [K in keyof M]: KvantSchemaInput<M[K]> }>
export type KvantKeyMapOutput<M extends KvantKeyMap> = Prettify<{ [K in keyof M]: KvantSchemaOutput<M[K]> }>
