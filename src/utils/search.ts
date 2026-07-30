export function normalizeSearchParams(
  searchParams: string | URLSearchParams,
): URLSearchParams {
  return typeof searchParams === 'string'
    ? new URLSearchParams(searchParams)
    : searchParams
}

export function searchToObject(
  searchParams: string | URLSearchParams,
  keys?: string[],
): Record<string, string | string[] | undefined> {
  searchParams = normalizeSearchParams(searchParams)
  keys ??= [...searchParams.keys()]

  return Object.fromEntries(
    keys.map((key) => {
      const values = searchParams.getAll(key)
      return [
        key,
        values.length > 1
          ? values
          : values[0],
      ]
    }),
  )
}

export function applySearchValues(
  searchParams: string | URLSearchParams,
  values: Record<string, unknown>,
): URLSearchParams {
  searchParams = normalizeSearchParams(searchParams)

  for (const [key, value] of Object.entries(values)) {
    searchParams.delete(key)
    if (Array.isArray(value))
      value.forEach(entry => searchParams.append(key, String(entry)))
    else if (value !== undefined)
      searchParams.set(key, String(value))
  }
  return searchParams
}

export function toSearch(
  searchParams: string | URLSearchParams,
): string {
  searchParams = normalizeSearchParams(searchParams)

  return searchParams.size > 0
    ? `?${searchParams.toString()}`
    : ''
}

export function withSearch(
  url: string | URL | Location,
  search: string | URLSearchParams,
): URL {
  url = new URL(url instanceof Location ? url.href : url)
  url.search = typeof search === 'string' ? search : toSearch(search)
  return url
}
