import type { KvantGenericSchema } from '../types/schema'
import type { NoUndefined, RecordKey } from '../utils/types'
import type { input, KvantType, output } from './core'
import { isObject } from '../utils/object'
import { generics } from './core'

export interface KvantMap<
  Key extends KvantGenericSchema = KvantGenericSchema,
  Value extends KvantGenericSchema = KvantGenericSchema,
> extends KvantType<
  Map<NoUndefined<output<Key>>, NoUndefined<output<Value>>> | undefined,
  Partial<Record<RecordKey<input<Key>>, input<Value>>> | undefined
  > {
  readonly type: 'map'
}

export function map<
  Key extends KvantGenericSchema = KvantGenericSchema,
  Value extends KvantGenericSchema = KvantGenericSchema,
>(
  keySchema: Key,
  valueSchema: Value,
): KvantMap<Key, Value> {
  return {
    ...generics,
    type: 'map',
    parse(input) {
      if (!isObject(input))
        return undefined

      const map = new Map<any, any>()

      for (const rawKey of Object.keys(input)) {
        const key: unknown = keySchema.parse(rawKey)
        if (key === undefined)
          continue

        const value: unknown = valueSchema.parse(input[rawKey])
        if (value === undefined)
          continue

        map.set(key, value)
      }

      return map
    },
    encode(input) {
      if (input === undefined)
        return undefined

      const obj: Record<string | number, any> = {}

      for (const rawKey of input.keys()) {
        const key: unknown = keySchema.encode(rawKey)
        if (typeof key !== 'string' && typeof key !== 'number')
          continue

        obj[key] = valueSchema.encode(input.get(rawKey))
      }

      return obj
    },
  }
}
