// @vitest-environment happy-dom
// Covers docs/content/docs/_shared/snippets/_custom-search-serializer.mdx
// (qs-based parseSearch/stringifySearch options, nested object URLs).
import qs from 'qs'
import { afterEach, describe, expect, it } from 'vitest'
import { number } from '../schema/number'
import { object } from '../schema/object'
import { string } from '../schema/string'
import { tuple } from '../schema/tuple'
import { safeParse } from '../utils/schema'
import { useSearchParamsKvantAdapter } from './searchParams'

// Options copied verbatim from the docs.
const qsOptions = {
  parseSearch: (search: string) => qs.parse(search, { ignoreQueryPrefix: true }),
  stringifySearch: (values: Record<string, unknown>) =>
    qs.stringify(values, { encodeValuesOnly: true }),
}

describe('searchParams adapter with qs serializer (docs)', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('reads nested values from a qs-style URL', () => {
    window.history.replaceState(
      null,
      '',
      '/?filters[tags][0]=a&filters[tags][1]=b&filters[range][0]=1&filters[range][1]=9',
    )
    const adapter = useSearchParamsKvantAdapter(['filters'], qsOptions)
    expect(adapter.getSnapshot().filters).toEqual({ tags: ['a', 'b'], range: ['1', '9'] })
  })

  it('writes nested values in qs format', () => {
    window.history.replaceState(null, '', '/')
    const adapter = useSearchParamsKvantAdapter(['filters'], qsOptions)
    adapter.update({ filters: { tags: ['a', 'b'], range: ['1', '9'] } })
    expect(window.location.search)
      .toBe('?filters[tags][0]=a&filters[tags][1]=b&filters[range][0]=1&filters[range][1]=9')
  })

  it('roundtrips a kv.object schema through the qs serializer', () => {
    // Doc example schema.
    const filtersSchema = object({
      tags: string().array().default([]),
      range: tuple([number(), number()]).optional(),
    }).default({ tags: [] })

    window.history.replaceState(
      null,
      '',
      '/?filters[tags][0]=a&filters[tags][1]=b&filters[range][0]=1&filters[range][1]=9',
    )
    const adapter = useSearchParamsKvantAdapter(['filters'], qsOptions)
    expect(safeParse(filtersSchema, adapter.getSnapshot().filters))
      .toEqual({ tags: ['a', 'b'], range: [1, 9] })
  })

  it('applies schema defaults when the key is absent', () => {
    const filtersSchema = object({
      tags: string().array().default([]),
      range: tuple([number(), number()]).optional(),
    }).default({ tags: [] })

    const adapter = useSearchParamsKvantAdapter(['filters'], qsOptions)
    expect(safeParse(filtersSchema, adapter.getSnapshot().filters))
      .toEqual({ tags: [] })
  })
})
