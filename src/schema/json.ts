import type { KvantGenericSchema } from '../types/schema'
import type { KvantType, output } from './core'
import { generics } from './core'

export interface KvantJSONOptions {
  reviver?: (key: string, value: unknown) => unknown
  replacer?: (key: string, value: unknown) => unknown
  space?: string | number
}

export interface KvantJSON<S extends KvantGenericSchema> extends KvantType<output<S> | undefined, string | undefined> {
  readonly type: 'json'
}

export function json<S extends KvantGenericSchema>(
  schema: S,
  options?: KvantJSONOptions,
): KvantJSON<S> {
  return {
    ...generics,
    type: 'json',
    parse(value) {
      if (typeof value !== 'string')
        return undefined

      try {
        return schema.parse(
          JSON.parse(value, options?.reviver),
        )
      }
      catch {
        return undefined
      }
    },
    encode(value) {
      if (value === undefined)
        return undefined

      return JSON.stringify(
        schema.encode(value),
        options?.replacer,
        options?.space,
      )
    },
  }
}
