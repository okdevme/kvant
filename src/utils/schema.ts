import type { KvantGenericSchema, KvantSchema } from '../types/schema'

export function noopSchema<T>(): KvantSchema<T, T, T> {
  return {
    parse: value => value,
    encode: value => value,
  }
}

function safeRun(
  schema: KvantGenericSchema,
  mode: 'parse' | 'encode',
  value: any,
): any {
  try {
    return schema[mode](value)
  }
  catch (error) {
    console.error(error)
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[kvant] Uncaught exception occurred in schema ${mode}. Schemas passed to kvant must not throw. If you're using a third-party schema provider, make sure to handle all possible cases or set a fallback value in case of an error (using catch() method in Zod).`)
    }
    return undefined
  }
}
export function safeParse(schema: KvantGenericSchema, value: any): any {
  return safeRun(schema, 'parse', value)
}
export function safeEncode(schema: KvantGenericSchema, value: any): any {
  return safeRun(schema, 'encode', value)
}
