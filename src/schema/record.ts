import type { KvantGenericSchema } from '../types/schema'
import type { RecordKey } from '../utils/types'
import type { input, KvantType, output } from './core'
import type { KvantEnum } from './enum'
import { isPlainObject } from '../utils/object'
import { generics } from './core'

export interface KvantRecord<
  Key extends KvantGenericSchema = KvantGenericSchema,
  Value extends KvantGenericSchema = KvantGenericSchema,
  IsPartial extends boolean = false,
> extends KvantType<
  (
    IsPartial extends true
      ? Partial<Record<RecordKey<output<Key>>, output<Value>>>
      : Record<RecordKey<output<Key>>, output<Value>>
  ) | undefined,
  (
    IsPartial extends true
      ? Partial<Record<RecordKey<input<Key>>, input<Value>>>
      : Record<RecordKey<input<Key>>, input<Value>>
  ) | undefined
  > {
  readonly type: 'record'
}

function _record<
  Key extends KvantGenericSchema | KvantEnum,
  Value extends KvantGenericSchema,
  IsPartial extends boolean = false,
>(
  keyType: Key,
  valueSchema: Value,
  partial: IsPartial = false as IsPartial,
): KvantRecord<Key, Value, IsPartial> {
  function produce(mode: 'parse' | 'encode', input: unknown): Record<string | number, any> | undefined {
    if (!isPlainObject(input))
      return undefined

    const obj: Record<string | number, any> = {}

    const keys = !partial && 'type' in keyType && keyType.type === 'enum'
      ? keyType.values
      : Object.keys(input)

    for (const rawKey of keys) {
      const key: unknown = keyType[mode](rawKey)
      if (typeof key !== 'string' && typeof key !== 'number')
        continue

      obj[key] = valueSchema[mode](input[rawKey])
    }

    return obj
  }

  return {
    ...generics,
    type: 'record',
    parse(input) {
      return produce('parse', input)
    },
    encode(input) {
      return produce('encode', input)
    },
  }
}

/**
 * Object schema with keys and values (de)serialized through schemas.
 *
 * With an enum key schema, all enum keys are required to be present;
 * use {@link partialRecord} to allow missing keys.
 */
export function record<
  Key extends KvantGenericSchema | KvantEnum,
  Value extends KvantGenericSchema,
>(
  keyType: Key,
  valueSchema: Value,
): KvantRecord<Key, Value> {
  return _record(keyType, valueSchema)
}

/** Like {@link record}, but enum keys may be missing from the value. */
export function partialRecord<
  Key extends KvantGenericSchema | KvantEnum,
  Value extends KvantGenericSchema,
>(
  keyType: Key,
  valueSchema: Value,
): KvantRecord<Key, Value, true> {
  return _record(keyType, valueSchema, true)
}
