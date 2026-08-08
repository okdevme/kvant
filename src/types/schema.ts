import type { InferOptionality } from '../utils/types'

/**
 * Bidirectional schema: parses raw storage values into typed state
 * and encodes state back into storable values.
 *
 * @typeParam Output - typed state value
 * @typeParam Input - value written to the storage
 * @typeParam RawInput - raw value read from the storage
 */
export interface KvantSchema<Output, Input = Output, RawInput = unknown> {
  /** Converts a raw storage value into typed state. Invalid input must yield `undefined`, never throw. */
  readonly parse: (value: RawInput) => Output
  /** Converts typed state into a storable value. */
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
export type KvantKeyMapInput<M extends KvantKeyMap> = InferOptionality<{ [K in keyof M]: KvantSchemaInput<M[K]> }>
export type KvantKeyMapOutput<M extends KvantKeyMap> = InferOptionality<{ [K in keyof M]: KvantSchemaOutput<M[K]> }>
