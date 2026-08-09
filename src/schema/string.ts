import type { KvantType } from './core'
import { generics } from './core'
import { overwrite } from './overwrite'
import { refine } from './refine'

type KvantStringGenericSchema = KvantType<string | undefined, any, any>

interface KvantStringGenerics {
  readonly max: <S extends KvantStringGenericSchema>(this: S, maxLength: number) => S
  readonly min: <S extends KvantStringGenericSchema>(this: S, minLength: number) => S
  readonly length: <S extends KvantStringGenericSchema>(this: S, length: number) => S
  readonly regex: <S extends KvantStringGenericSchema>(this: S, regex: RegExp) => S
  readonly startsWith: <S extends KvantStringGenericSchema>(this: S, value: string) => S
  readonly endsWith: <S extends KvantStringGenericSchema>(this: S, value: string) => S
  readonly includes: <S extends KvantStringGenericSchema>(this: S, value: string) => S
  readonly uppercase: <S extends KvantStringGenericSchema>(this: S) => S
  readonly lowercase: <S extends KvantStringGenericSchema>(this: S) => S
  readonly trim: <S extends KvantStringGenericSchema>(this: S) => S
  readonly toLowerCase: <S extends KvantStringGenericSchema>(this: S) => S
  readonly toUpperCase: <S extends KvantStringGenericSchema>(this: S) => S
  readonly normalize: <S extends KvantStringGenericSchema>(this: S) => S
  readonly slice: <S extends KvantStringGenericSchema>(this: S, start: number, end?: number) => S
}

const uppercaseRegex = /^[^a-z]*$/
const lowercaseRegex = /^[^A-Z]*$/

const stringGenerics = {
  max(this: KvantStringGenericSchema, maxLength) {
    return refine(this, v => v.length <= maxLength)
  },
  min(this: KvantStringGenericSchema, minLength) {
    return refine(this, v => v.length >= minLength)
  },
  length(this: KvantStringGenericSchema, length) {
    return refine(this, v => v.length === length)
  },
  regex(this: KvantStringGenericSchema, regex) {
    return refine(this, v => regex.test(v))
  },
  startsWith(this: KvantStringGenericSchema, value) {
    return refine(this, v => v.startsWith(value))
  },
  endsWith(this: KvantStringGenericSchema, value) {
    return refine(this, v => v.endsWith(value))
  },
  includes(this: KvantStringGenericSchema, value) {
    return refine(this, v => v.includes(value))
  },
  uppercase(this: KvantStringGenericSchema) {
    return refine(this, v => uppercaseRegex.test(v))
  },
  lowercase(this: KvantStringGenericSchema) {
    return refine(this, v => lowercaseRegex.test(v))
  },
  trim(this: KvantStringGenericSchema) {
    return overwrite(this, v => v.trim())
  },
  toLowerCase(this: KvantStringGenericSchema) {
    return overwrite(this, v => v.toLowerCase())
  },
  toUpperCase(this: KvantStringGenericSchema) {
    return overwrite(this, v => v.toUpperCase())
  },
  normalize(this: KvantStringGenericSchema) {
    return overwrite(this, v => v.normalize())
  },
  slice(this: KvantStringGenericSchema, start, end) {
    return overwrite(this, v => v.slice(start, end))
  },
} as KvantStringGenerics

export interface KvantString extends KvantType<string | undefined>, KvantStringGenerics {
  readonly type: 'string'
}

const objStringTag = {}.toString()

export function string(): KvantString {
  return {
    ...generics,
    ...stringGenerics,
    type: 'string',
    parse(value) {
      if (value == null || Array.isArray(value))
        return undefined

      const str = String(value)

      if (str === objStringTag)
        return undefined

      return str
    },
    encode(value) {
      return value
    },
  }
}

export interface KvantUriComponent extends KvantString {}

/** String with URI component encoding. */
export function uriComponent(): KvantUriComponent {
  return overwrite(string(), {
    decode: (value) => {
      try {
        return decodeURIComponent(value)
      }
      catch {
        return undefined
      }
    },
    encode: encodeURIComponent,
  })
}

export interface KvantBase64 extends KvantString {}

/** Base64-encoded string. */
export function base64(): KvantBase64 {
  return overwrite(string(), {
    decode: (value) => {
      try {
        return atob(value)
      }
      catch {
        return undefined
      }
    },
    encode: btoa,
  })
}

/** URL-safe Base64-encoded string. */
export function base64url(): KvantBase64 {
  return overwrite(string(), {
    decode: (value) => {
      try {
        const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
        const padding = '='.repeat((4 - (base64.length % 4)) % 4)
        return atob(base64 + padding)
      }
      catch {
        return undefined
      }
    },
    encode: value => btoa(value)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, ''),
  })
}
