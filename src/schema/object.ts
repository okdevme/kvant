import type { KvantGenericSchema } from '../types/schema'
import type { Extend, Flatten, InferOptionality, Mask, Writeable } from '../utils'
import type { KvantUnknown } from './any'
import type { input, KvantType, output } from './core'
import type { KvantOptional } from './optional'
import { unknown } from './any'
import { generics } from './core'
import { optional } from './optional'

type ObjectShape<K extends PropertyKey = string> = Readonly<Record<K, KvantGenericSchema>>

type SafeExtendShape<Target extends ObjectShape, Source extends ObjectShape> = {
  [K in keyof Source]: K extends keyof Target
    ? output<Source[K]> extends output<Target[K]>
      ? input<Source[K]> extends input<Target[K]>
        ? Source[K]
        : never
      : never
    : Source[K]
}

export interface KvantObject<
  Shape extends ObjectShape,
  Catchall extends KvantGenericSchema | undefined = undefined,
> extends KvantType<
  InferOptionality<
      (
        Catchall extends KvantGenericSchema
          ? { [x: string]: output<Catchall> }
          : object
        ) & {
          [K in keyof Shape]: output<Shape[K]>
        }
  > | undefined,
  InferOptionality<
      (
        Catchall extends KvantGenericSchema
          ? { [x: string]: input<Catchall> }
          : object
        ) & {
          [K in keyof Shape]: input<Shape[K]>
        }
  > | undefined
  > {
  readonly type: 'object'
  readonly shape: Shape

  readonly catchall: <T extends KvantGenericSchema>(schema: T) => KvantObject<Shape, T>

  readonly extend: <T extends ObjectShape>(shape: T) => KvantObject<Extend<Shape, Writeable<T>>, Catchall>

  readonly safeExtend: <T extends ObjectShape>(
    shape: SafeExtendShape<Shape, T> & Partial<ObjectShape<keyof Shape>>,
  ) => KvantObject<Extend<Shape, Writeable<T>>, Catchall>

  readonly pick: <M extends Mask<keyof Shape>>(
    mask: M & Record<Exclude<keyof M, keyof Shape>, never>,
  ) => KvantObject<Flatten<Pick<Shape, Extract<keyof Shape, keyof M>>>, Catchall>

  readonly omit: <M extends Mask<keyof Shape>>(
    mask: M & Record<Exclude<keyof M, keyof Shape>, never>,
  ) => KvantObject<Flatten<Omit<Shape, Extract<keyof Shape, keyof M>>>, Catchall>

  readonly partial: {
    (): KvantObject<
      {
        -readonly [K in keyof Shape]: KvantOptional<Shape[K]>
      },
      Catchall
    >
    <M extends Mask<keyof Shape>>(
      mask: M & Record<Exclude<keyof M, keyof Shape>, never>,
    ): KvantObject<
      {
        -readonly [K in keyof Shape]: K extends keyof M
          ? KvantOptional<Shape[K]>
          : Shape[K]
      },
      Catchall
    >
  }
}

// TODO: keyof() method (after KvantEnum implementation)
export function object<
  Shape extends ObjectShape,
  Catchall extends KvantGenericSchema | undefined = undefined,
>(
  shape: Shape,
  catchall?: Catchall,
): KvantObject<Shape, Catchall> {
  function produce(mode: 'parse' | 'encode', value: any): Record<string, any> | undefined {
    if (typeof value !== 'object' || value === null)
      return undefined

    const obj: Record<string, any> = {}

    for (const key in shape) {
      const output: unknown = shape[key]?.[mode](value[key])
      if (output !== undefined) {
        obj[key] = output
        continue
      }
      if (key in value)
        obj[key] = undefined
    }

    if (!catchall)
      return obj

    for (const key in value) {
      if (key in shape)
        continue

      obj[key] = catchall[mode](value[key])
    }

    return obj
  }

  return {
    ...generics,
    type: 'object',
    shape,
    // @ts-expect-error complex dynamic type
    parse(value: any) {
      return produce('parse', value)
    },
    // @ts-expect-error complex dynamic type
    encode(value) {
      return produce('encode', value)
    },
    catchall(schema) {
      return object(shape, schema)
    },
    // @ts-expect-error complex dynamic type
    extend(source) {
      return object({ ...shape, ...source }, catchall)
    },
    // @ts-expect-error complex dynamic type
    safeExtend(source) {
      return object({ ...shape, ...source }, catchall)
    },
    // @ts-expect-error complex dynamic type
    pick(mask) {
      const newShape: Writeable<ObjectShape> = {}
      for (const key in mask) {
        if (!(key in shape)) {
          throw new Error(`Unrecognized key: "${key}"`)
        }
        if (!mask[key])
          continue
        newShape[key] = shape[key]!
      }
      return object(newShape, catchall)
    },
    // @ts-expect-error complex dynamic type
    omit(mask) {
      const newShape: Writeable<ObjectShape> = { ...shape }
      for (const key in mask) {
        if (!(key in shape)) {
          throw new Error(`Unrecognized key: "${key}"`)
        }
        if (!mask[key])
          continue
        delete newShape[key]
      }
      return object(newShape, catchall)
    },
    // @ts-expect-error complex dynamic type
    partial(mask) {
      const newShape: Writeable<ObjectShape> = { ...shape }

      if (mask) {
        for (const key in mask) {
          if (!(key in shape)) {
            throw new Error(`Unrecognized key: "${key}"`)
          }
          if (!mask[key])
            continue
          newShape[key] = optional(shape[key]!)
        }
      }
      else {
        for (const key in shape) {
          newShape[key] = optional(shape[key]!)
        }
      }

      return object(newShape, catchall)
    },
  }
}

export function looseObject<Shape extends ObjectShape>(
  shape: Shape,
): KvantObject<Shape, KvantUnknown> {
  return object(shape, unknown())
}
