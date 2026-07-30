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
