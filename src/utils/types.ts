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
