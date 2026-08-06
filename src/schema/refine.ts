import type { KvantGenericSchema } from '../types/schema'
import type { NoUndefined } from '../utils/types'
import type { output } from './core'
import { overwrite } from './overwrite'

export function refine<S extends KvantGenericSchema>(
  schema: S,
  check: (value: NoUndefined<output<S>>) => boolean,
  ...[fallback = undefined]: undefined extends output<S>
    ? [fallback?: output<S> | (() => output<S>)]
    : [fallback: output<S> | (() => output<S>)]
): S {
  return overwrite(
    schema,
    value => (
      check(value)
        ? value
        : typeof fallback === 'function'
          ? (fallback as () => output<S>)()
          : fallback
    ) as output<S>,
  )
}
