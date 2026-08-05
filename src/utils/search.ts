export type SearchParamsValue = string | string[]

export function parseSearch(
  search: string,
): Record<string, SearchParamsValue> {
  const searchParams = new URLSearchParams(search)

  return Object.fromEntries(
    [...searchParams.keys()].map((key) => {
      const values = searchParams.getAll(key)
      return [
        key,
        values.length > 1
          ? values
          : values[0]!,
      ]
    }),
  )
}

export function stringifySearch(
  values: Record<string, unknown>,
): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(values)) {
    const values = Array.isArray(value) ? value : [value]
    for (const value of values) {
      if (value === undefined)
        continue

      searchParams.append(key, String(value))
    }
  }
  return searchParams.toString()
}

export function withSearch(
  url: string | URL | Location,
  search: string | URLSearchParams,
): URL {
  url = new URL(url instanceof Location ? url.href : url)
  url.search = search instanceof URLSearchParams ? search.toString() : search
  return url
}
