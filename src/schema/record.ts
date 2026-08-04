import type { KvantGenericSchema } from '../types/schema'
import type { input, KvantGenericType, KvantType, output } from './core'
import type { KvantEnum } from './enum'
import { isPlainObject } from '../utils/object'
import { generics } from './core'

export interface KvantRecord<
  Key extends KvantGenericType = KvantGenericType,
  Value extends KvantGenericSchema = KvantGenericSchema,
  IsPartial extends boolean = false,
> extends KvantType<
  (
    IsPartial extends true
      ? Partial<Record<output<Key> & PropertyKey, output<Value>>>
      : Record<output<Key> & PropertyKey, output<Value>>
  ) | undefined,
  (
    IsPartial extends true
      ? Partial<Record<input<Key> & PropertyKey, input<Value>>>
      : Record<input<Key> & PropertyKey, input<Value>>
  ) | undefined
  > {
  readonly type: 'record'
}

function _record<
  Key extends KvantGenericType | KvantEnum,
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

    const keys = !partial && keyType.type === 'enum'
      ? (keyType as KvantEnum).values
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

export function record<
  Key extends KvantGenericType | KvantEnum,
  Value extends KvantGenericSchema,
>(
  keyType: Key,
  valueSchema: Value,
): KvantRecord<Key, Value> {
  return _record(keyType, valueSchema)
}

export function partialRecord<
  Key extends KvantGenericType | KvantEnum,
  Value extends KvantGenericSchema,
>(
  keyType: Key,
  valueSchema: Value,
): KvantRecord<Key, Value, true> {
  return _record(keyType, valueSchema, true)
}
