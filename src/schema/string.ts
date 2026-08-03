import type { KvantType } from './core'
import { generics } from './core'
import { overwrite } from './overwrite'

type KvantStringGenericSchema = KvantType<string, any, any>

interface KvantStringGenerics {
  readonly trim: <S extends KvantStringGenericSchema>(this: S) => S
  readonly toLowerCase: <S extends KvantStringGenericSchema>(this: S) => S
  readonly toUpperCase: <S extends KvantStringGenericSchema>(this: S) => S
}

const stringGenerics = {
  trim(this: KvantStringGenericSchema) {
    return overwrite(this, value => value.trim())
  },
  toLowerCase(this: KvantStringGenericSchema) {
    return overwrite(this, value => value.toLowerCase())
  },
  toUpperCase(this: KvantStringGenericSchema) {
    return overwrite(this, value => value.toUpperCase())
  },
} as KvantStringGenerics

export interface KvantString extends KvantType<string>, KvantStringGenerics {
  readonly type: 'string'
}

export function string(): KvantString {
  return {
    ...generics,
    ...stringGenerics,
    type: 'string',
    parse(value) {
      return String(value)
    },
    encode(value) {
      return value
    },
  }
}

export interface KvantUriComponent extends KvantString {}

export function uriComponent(): KvantUriComponent {
  return overwrite(string(), {
    decode: (value) => {
      try {
        return decodeURIComponent(value)
      }
      catch {
        return value
      }
    },
    encode: encodeURIComponent,
  })
}
