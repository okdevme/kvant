export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type InferOptionality<T extends object> = Prettify<
  {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K]
  } & {
    [K in keyof T as undefined extends T[K] ? K : never]?: T[K]
  }
>

// https://stackoverflow.com/questions/55541275/typescript-check-for-the-any-type
export type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N
export type IsAny<T> = IfAny<T, true, false>

export type MaybeMultiple<T> = T extends any[] ? T : T | T[]

export type NoUndefined<T> = T extends undefined ? never : T

export type SomeObject = Record<PropertyKey, any>

export type Identity<T> = T

export type Flatten<T> = Identity<{ [k in keyof T]: T[k] }>

export type Mask<Keys extends PropertyKey> = { [K in Keys]?: true }

export type Writeable<T> = { -readonly [P in keyof T]: T[P] } & {}

export type Extend<A extends SomeObject, B extends SomeObject> = Flatten<
  // fast path when there is no keys overlap
  keyof A & keyof B extends never
    ? A & B
    : {
      [K in keyof A as K extends keyof B ? never : K]: A[K];
    } & {
      [K in keyof B]: B[K];
    }
>

export function isObject(data: unknown): data is Record<PropertyKey, unknown> {
  return typeof data === 'object' && data !== null && !Array.isArray(data)
}

export function isPlainObject(o: unknown): o is Record<PropertyKey, unknown> {
  if (!isObject(o))
    return false

  // modified constructor
  const ctor = o.constructor
  if (ctor === undefined)
    return true

  if (typeof ctor !== 'function')
    return true

  // modified prototype
  const prot = ctor.prototype
  if (!isObject(prot))
    return false

  // ctor doesn't have static `isPrototypeOf`
  return Object.hasOwn(prot, 'isPrototypeOf')
}

export function shallowClone<T>(o: T): T {
  if (isPlainObject(o))
    return { ...o }
  if (Array.isArray(o))
    return [...o] as T
  if (o instanceof Map)
    return new Map(o) as T
  if (o instanceof Set)
    return new Set(o) as T
  return o
}
