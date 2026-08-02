export function optionally<I, O = I>(
  transform: (value: I) => O,
): (value: I | undefined) => O | undefined {
  return value => value !== undefined
    ? transform(value)
    : undefined
}
